import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "@/actions/products";
import { currency } from "@/lib/format";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function ProductsListPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-extrabold text-2xl text-ink">Products</h1>
        <Link
          href="/admin/dashboard/products/new"
          className="bg-black hover:bg-[#222] text-white text-sm font-semibold px-4 py-2.5 rounded-full"
        >
          + Add product
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5F3] text-left text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">MOQ</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3 font-semibold text-ink">
                  <Link href={`/admin/dashboard/products/${p.id}`} className="hover:text-olive">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{p.categories?.name || "—"}</td>
                <td className="px-4 py-3 text-ink">{currency(p.price)}</td>
                <td className="px-4 py-3 text-muted">{p.stock_status.replace("_", " ")}</td>
                <td className="px-4 py-3 text-muted">{p.moq}</td>
                <td className="px-4 py-3">{p.is_published ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/dashboard/products/${p.id}`} className="text-xs text-olive hover:underline mr-3">
                    Edit
                  </Link>
                  <DeleteButton action={deleteProduct.bind(null, p.id)} confirmText={`Delete "${p.name}"? This can't be undone.`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <div className="text-center py-16 text-muted text-sm">No products yet.</div>
        )}
      </div>
    </div>
  );
}
