import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { PortfolioItemForm } from "@/components/admin/PortfolioItemForm";
import { PortfolioItemsList } from "@/components/admin/PortfolioItemsList";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-sm">Admin Panel</h1>
            <p className="mt-2 text-slate-400">Manage your portfolio content and settings</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700/50 bg-slate-800/30 text-slate-300 hover:bg-slate-800/50 transition"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Add Portfolio Item Form */}
            <PortfolioItemForm />

            {/* Admin Settings */}
            <AdminSettingsForm />
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-100 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Admin User</p>
                  <p className="text-slate-200 font-medium truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Last Login</p>
                  <p className="text-slate-200 font-medium">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Admin Guide</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <span>Fill in portfolio item details</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">2.</span>
                  <span>Click "Add Portfolio Item"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <span>View items in the list below</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">4.</span>
                  <span>Edit or delete as needed</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">5.</span>
                  <span>Update settings anytime</span>
                </li>
              </ul>
            </div>

            {/* Categories Info */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Categories</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  <span>Teaching</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Items List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Portfolio Items</h2>
          <PortfolioItemsList />
        </div>
      </div>
    </div>
  );
}
