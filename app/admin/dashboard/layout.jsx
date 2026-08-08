import AdminNav from "@/components/AdminNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AdminNav />
      <main className="max-w-6xl mx-auto px-5 py-8">{children}</main>
    </div>
  );
}
