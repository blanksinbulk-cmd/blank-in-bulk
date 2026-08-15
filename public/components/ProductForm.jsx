"use client";

import { useState } from "react";

export default function ProductForm({ product, categories, onSubmit, submitLabel = "Save" }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData) {
    setSaving(true);
    setError("");
    const result = await onSubmit(formData);
    setSaving(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-4">
      <Field label="Product name">
        <input name="name" defaultValue={product?.name} required className="input" />
      </Field>

      <Field label="Description">
        <textarea name="description" defaultValue={product?.description} rows={4} className="input resize-none" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <select name="category_id" defaultValue={product?.category_id || ""} className="input">
            <option value="">No category</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="SKU (optional)">
          <input name="sku" defaultValue={product?.sku} className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (R)">
          <input name="price" type="number" step="0.01" defaultValue={product?.price} required className="input" />
        </Field>
        <Field label="Was price (optional)">
          <input name="was_price" type="number" step="0.01" defaultValue={product?.was_price || ""} className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Stock status">
          <select name="stock_status" defaultValue={product?.stock_status || "in_stock"} className="input">
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </Field>
        <Field label="MOQ (e.g. 10 units, 1 dozen)">
          <input name="moq" defaultValue={product?.moq || "1 unit"} required className="input" />
        </Field>
      </div>

      <Field label="Bulk pricing note (optional, shown under the price — e.g. &quot;Buy 50+ units and save 10%&quot;)">
        <input name="bulk_note" defaultValue={product?.bulk_note || ""} placeholder="Buy 50+ units and save 10%" className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sizes (comma separated)">
          <input name="sizes" defaultValue={(product?.sizes || []).join(", ")} placeholder="S, M, L, XL" className="input" />
        </Field>
        <Field label="Colours (comma separated)">
          <input name="colours" defaultValue={(product?.colours || []).join(", ")} placeholder="Black, White, Navy" className="input" />
        </Field>
      </div>

      {product && (
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="is_published" defaultChecked={product.is_published} />
          Published (visible on the live site)
        </label>
      )}

      {error && <p className="text-sm text-[#B23B3B]">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-black hover:bg-[#222] text-white font-semibold text-sm py-3 rounded-full disabled:opacity-60"
      >
        {saving ? "Saving..." : submitLabel}
      </button>

      <style jsx>{`
        :global(.input) {
          background: #f5f5f3;
          border: 1px solid #eaeaea;
          border-radius: 0.5rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          width: 100%;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #7a8060;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold">{label}</label>
      {children}
    </div>
  );
}
