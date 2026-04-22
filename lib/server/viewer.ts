import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeAppRole, type AppRole } from "@/lib/types/app-role";

type ViewerContext = {
  isAuthenticated: boolean;
  role: AppRole;
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: User | null;
};

function requestedRoleFromUser(user: User): AppRole {
  return normalizeAppRole(
    user.user_metadata?.requested_role ??
      user.user_metadata?.role ??
      user.app_metadata?.role,
  );
}

async function ensureUserRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User,
) {
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (roleRow?.role) {
    return normalizeAppRole(roleRow.role);
  }

  const fallbackRole = requestedRoleFromUser(user);

  const { data: insertedRole } = await supabase
    .from("user_roles")
    .upsert(
      {
        id: user.id,
        role: fallbackRole,
      },
      { onConflict: "id" },
    )
    .select("role")
    .single();

  return normalizeAppRole(insertedRole?.role ?? fallbackRole);
}

export async function getViewerContext(): Promise<ViewerContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthenticated: false,
      role: "donor",
      supabase,
      user: null,
    };
  }

  const role = await ensureUserRole(supabase, user);

  return {
    isAuthenticated: true,
    role,
    supabase,
    user,
  };
}

export async function requireViewer() {
  const viewer = await getViewerContext();

  if (!viewer.user) {
    redirect("/login");
  }

  return viewer as ViewerContext & { user: User };
}

export async function requireRole(role: AppRole) {
  const viewer = await requireViewer();

  if (viewer.role !== role) {
    redirect(role === "organization" ? "/" : "/profile");
  }

  return viewer;
}
