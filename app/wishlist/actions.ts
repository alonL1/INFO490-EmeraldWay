"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/server/viewer";

function listingPayload(formData: FormData) {
  return {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    item_type: (formData.get("item_type") as string) || null,
    condition: (formData.get("condition") as string) || null,
    location: (formData.get("location") as string) || null,
    priority: (formData.get("priority") as string) || "Medium",
    status: (formData.get("status") as string) || "Open",
    image_url: (formData.get("image_url") as string) || null,
  };
}

export async function createListing(formData: FormData) {
  const viewer = await requireRole("organization");

  const { error } = await viewer.supabase.from("listings").insert({
    profile_id: viewer.user.id,
    ...listingPayload(formData),
  });

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/wishlist");
  redirect("/wishlist");
}

export async function updateListing(formData: FormData) {
  const viewer = await requireRole("organization");
  const listingId = formData.get("listingId") as string;

  const { error } = await viewer.supabase
    .from("listings")
    .update(listingPayload(formData))
    .eq("id", listingId)
    .eq("profile_id", viewer.user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/wishlist");
  revalidatePath(`/wishlist/${listingId}`);
  redirect(`/wishlist/${listingId}`);
}

export async function deleteListing(formData: FormData) {
  const viewer = await requireRole("organization");
  const listingId = formData.get("listingId") as string;

  const { error } = await viewer.supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("profile_id", viewer.user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/wishlist");
  redirect("/wishlist");
}
