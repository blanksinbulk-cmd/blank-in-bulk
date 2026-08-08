"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";

export default function CategoryManager({ categories, createAction, updateAction, deleteAction }) {
  const [editingId, setEditingId] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  function handleCreate(formData) {
    setError("");
    startTransition(async () => {
      const result = await createAction(formData);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleUpdate(categoryId, formData) {
    setError("");
    startTransition(async () => {
      const result = await updateAction(categoryId, formData);
      if (result?.error) setError(result.error);
      else {
        setEditingId(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        {categories.map((cat) => (
          <div key={cat.id} className="border-b border-line last:border-0 p-4">
            {editingId === cat.id ? (
              <form action={(fd) => handleUpdate(cat.id, fd)} className="flex items-center gap-2 flex-wrap">
                <input name="name" defaultValue={cat.name} className="input flex-1 min-w-[120px]" />
                <input name="sort_order" type="number" defaultValue={cat.sort_order} className="input w-20" />
                <button type="submit" disabled={isPending} className="text-xs bg-black text-white px-3 py-2 rounded-full">
                  Save
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="text-xs text-muted">
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setEditingId(cat.id)} className="text-xs text-olive hover:underline">
                    Edit
                  </button>
                  <DeleteButton
                    action={() => deleteAction(cat.id)}
                    confirmText={`Delete "${cat.name}"? Products in this category will keep their data but lose the category link.`}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && <div className="p-6 text-center text-sm text-muted">No categories yet.</div>}
      </div>

      <form action={handleCreate} className="bg-white border border-line rounded-2xl p-4 flex items-center gap-2 flex-wrap">
        <input name="name" placeholder="New category name" required className="input flex-1 min-w-[140px]" />
        <input name="sort_order" type="number" placeholder="Order" defaultValue={categories.length} className="input w-20" />
        <button type="submit" disabled={isPending} className="text-xs bg-black hover:bg-[#222] text-white px-4 py-2.5 rounded-full font-semibold">
          + Add category
        </button>
      </form>
      {error && <p className="text-sm text-[#B23B3B]">{error}</p>}

      <style jsx>{`
        :global(.input) {
          background: #f5f5f3;
          border: 1px solid #eaeaea;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #7a8060;
        }
      `}</style>
    </div>
  );
}
