import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardHome() {
  const supabase = createClient();

  const [{ count: productCount }, { count: categoryCount }, { count: serviceCount }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("printing_services").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Products", count: productCount || 0, href: "/admin/dashboard/products" },
    { label: "Categories", count: categoryCount || 0, href: "/admin/dashboard/categories" },
    { label: "Printing Services", count: serviceCount || 0, href: "/admin/dashboard/printing" },
  ];

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white border border-line rounded-2xl p-6 hover:shadow-lg transition-all"
          >
            <p className="text-3xl font-display font-extrabold text-ink">{c.count}</p>
            <p className="text-sm text-muted mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
