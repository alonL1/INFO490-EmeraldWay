"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveOrganizationProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    org_name: formData.get("org_name") as string,
    description: (formData.get("description") as string) || null,
    location: (formData.get("location") as string) || null,
    contact_email: (formData.get("contact_email") as string) || null,
  });

  if (error) {
    throw error;
  }

  redirect("/profile");
}

export async function saveDonorProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("donor_profiles").upsert({
    id: user.id,
    full_name: formData.get("full_name") as string,
    bio: (formData.get("bio") as string) || null,
    location: (formData.get("location") as string) || null,
    contact_email: (formData.get("contact_email") as string) || null,
    focus_area: (formData.get("focus_area") as string) || null,
  });

  if (error) {
    throw error;
  }

  redirect("/profile");
}
