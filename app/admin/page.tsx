import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Panel - Hansco Dev",
  description: "Manage your portfolio content",
};

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // You can add additional role-based checks here if needed
  // For now, any authenticated user can access admin panel
  // In production, you'd want to check against an admin table

  return <AdminLayout />;
}
