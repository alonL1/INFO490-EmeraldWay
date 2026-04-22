"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/server/viewer";

function createConfirmationCode() {
  return `CC-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function createDonation(formData: FormData) {
  const viewer = await requireRole("donor");
  const listingId = formData.get("listingId") as string;

  const { data: listing, error: listingError } = await viewer.supabase
    .from("listings")
    .select("id, profile_id, title, profiles(org_name)")
    .eq("id", listingId)
    .single();

  if (listingError || !listing) {
    throw listingError ?? new Error("Listing not found.");
  }

  const { data: donorProfile } = await viewer.supabase
    .from("donor_profiles")
    .select("full_name, contact_email")
    .eq("id", viewer.user.id)
    .maybeSingle();

  const confirmationCode = createConfirmationCode();

  const { data: donation, error } = await viewer.supabase
    .from("donations")
    .insert({
      confirmation_code: confirmationCode,
      donor_display_name:
        (formData.get("donor_display_name") as string) ||
        donorProfile?.full_name ||
        viewer.user.email?.split("@")[0] ||
        "Donor",
      donor_email:
        (formData.get("donor_email") as string) ||
        donorProfile?.contact_email ||
        viewer.user.email ||
        "",
      donor_id: viewer.user.id,
      listing_id: listing.id,
      message: (formData.get("message") as string) || null,
      organization_id: listing.profile_id,
      preferred_dropoff_window:
        (formData.get("preferred_dropoff_window") as string) || null,
      status: "submitted",
    })
    .select("id")
    .single();

  if (error || !donation) {
    throw error ?? new Error("Unable to create donation.");
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/donations");
  revalidatePath(`/listings/${listing.id}`);
  revalidatePath("/incoming-donations");
  redirect(`/donations/${donation.id}?submitted=1`);
}

export async function updateDonationStatus(formData: FormData) {
  const viewer = await requireRole("organization");
  const donationId = formData.get("donationId") as string;
  const redirectTo =
    (formData.get("redirectTo") as string) || `/incoming-donations/${donationId}`;
  const nextStatus = formData.get("status") as string;

  const { error } = await viewer.supabase
    .from("donations")
    .update({
      organization_response: (formData.get("organization_response") as string) || null,
      scheduled_for: (formData.get("scheduled_for") as string) || null,
      status: nextStatus,
    })
    .eq("id", donationId)
    .eq("organization_id", viewer.user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/profile");
  revalidatePath("/incoming-donations");
  revalidatePath(`/incoming-donations/${donationId}`);
  revalidatePath("/donations");
  redirect(redirectTo);
}

export async function toggleSavedListing(formData: FormData) {
  const viewer = await requireRole("donor");
  const listingId = formData.get("listingId") as string;

  const { data: existing } = await viewer.supabase
    .from("saved_listings")
    .select("id")
    .eq("donor_id", viewer.user.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    const { error } = await viewer.supabase
      .from("saved_listings")
      .delete()
      .eq("id", existing.id)
      .eq("donor_id", viewer.user.id);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await viewer.supabase.from("saved_listings").insert({
      donor_id: viewer.user.id,
      listing_id: listingId,
    });

    if (error) {
      throw error;
    }
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/saved-items");
  revalidatePath(`/listings/${listingId}`);
}
