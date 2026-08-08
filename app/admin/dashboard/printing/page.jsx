import { createClient } from "@/lib/supabase/server";
import { deleteService } from "@/actions/printing";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function PrintingListPage() {
  const supabase = createClient();
  const { data: services } = await supabase.from("printing_services").select("*").order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-extrabold text-2xl text-ink">Printing Services</h1>
        <Link
          href="/admin/dashboard/printing/new"
          className="bg-black hover:bg-[#222] text-white text-sm font-semibold px-4 py-2.5 rounded-full"
        >
          + Add service
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5F3] text-left text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Starting price</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(services || []).map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="px-4 py-3 font-semibold text-ink">
                  <Link href={`/admin/dashboard/printing/${s.id}`} className="hover:text-olive">
                    {s.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{s.starting_price}</td>
                <td className="px-4 py-3 text-muted">{s.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/dashboard/printing/${s.id}`} className="text-xs text-olive hover:underline mr-3">
                    Edit
                  </Link>
                  <DeleteButton action={deleteService.bind(null, s.id)} confirmText={`Delete "${s.name}"? This can't be undone.`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!services || services.length === 0) && (
          <div className="text-center py-16 text-muted text-sm">No printing services yet.</div>
        )}
      </div>
    </div>
  );
}
