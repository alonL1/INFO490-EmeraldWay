"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, requireViewer } from "@/lib/server/viewer";

// Reject any redirectTo that isn't a same-origin path.
function safeRedirect(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  return value;
}

export async function ensureThread(formData: FormData) {
  const viewer = await requireRole("organization");
  const donationId = formData.get("donationId") as string;
  const redirectTo = safeRedirect(formData.get("redirectTo"));

  // 1. Pull the donation row. The donations SELECT RLS policy restricts to
  //    auth.uid() = organization_id, so this is also our ownership check.
  const { data: donation, error } = await viewer.supabase
    .from("donations")
    .select("id, donor_id, organization_id")
    .eq("id", donationId)
    .single();
  if (error || !donation) throw error ?? new Error("Donation not found");

  // 2. Upsert keyed on the UNIQUE donation_id. CRITICAL: ignoreDuplicates: true.
  //    Without this, every repeat call does an UPDATE-on-conflict which fires
  //    set_updated_at and re-sorts the thread to the top of the list.
  const { data: thread, error: threadError } = await viewer.supabase
    .from("message_threads")
    .upsert(
      {
        donation_id: donation.id,
        donor_id: donation.donor_id,
        organization_id: donation.organization_id,
      },
      { onConflict: "donation_id", ignoreDuplicates: true },
    )
    .select("id")
    .maybeSingle();

  // ignoreDuplicates: true returns NO row on conflict. Re-fetch when that happens.
  let threadId = thread?.id;
  if (!threadId) {
    const { data: existing, error: fetchError } = await viewer.supabase
      .from("message_threads")
      .select("id")
      .eq("donation_id", donation.id)
      .single();
    if (fetchError || !existing) {
      throw threadError ?? fetchError ?? new Error("Could not resolve thread");
    }
    threadId = existing.id;
  }

  revalidatePath("/incoming-donations");
  revalidatePath(`/incoming-donations/${donation.id}`);
  redirect(redirectTo ?? `/messages?thread=${threadId}`);
}

export async function sendMessage(formData: FormData) {
  const viewer = await requireViewer();
  const threadId = formData.get("threadId") as string;
  const body = ((formData.get("body") as string) ?? "").trim();
  if (!body) return; // ignore empty submits silently

  // RLS enforces participant + sender_id; no extra check needed.
  const { error: insertError } = await viewer.supabase
    .from("messages")
    .insert({ thread_id: threadId, sender_id: viewer.user.id, body });
  if (insertError) throw insertError;

  // One SQL roundtrip — function checks participant via auth.uid() internally.
  const { error: rpcError } = await viewer.supabase.rpc(
    "mark_thread_other_side_unread",
    { p_thread_id: threadId },
  );
  if (rpcError) throw rpcError;
  // Intentionally NO revalidatePath('/messages'): Realtime delivers the update.
}

export async function markThreadRead(formData: FormData) {
  const viewer = await requireViewer();
  const threadId = formData.get("threadId") as string;
  // Two cheap UPDATEs, each scoped by the matching participant column. Whichever
  // side the caller is on, exactly one of these touches the row (RLS UPDATE
  // policy plus the filter both restrict to the actual participant). Avoids the
  // SELECT-then-UPDATE roundtrip.
  await viewer.supabase
    .from("message_threads")
    .update({ donor_unread: false })
    .eq("id", threadId)
    .eq("donor_id", viewer.user.id);
  await viewer.supabase
    .from("message_threads")
    .update({ org_unread: false })
    .eq("id", threadId)
    .eq("organization_id", viewer.user.id);
}

export async function reportMessage(formData: FormData) {
  const viewer = await requireViewer();
  const messageId = formData.get("messageId") as string;
  const reason = ((formData.get("reason") as string) ?? "").trim() || null;
  const { error } = await viewer.supabase
    .from("message_reports")
    .insert({ message_id: messageId, reporter_id: viewer.user.id, reason });
  if (error) throw error;
}
