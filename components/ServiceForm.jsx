"use client";

import { useState } from "react";

export default function ServiceForm({ service, onSubmit, submitLabel = "Save" }) {
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
      <Field label="Service name">
        <input name="name" defaultValue={service?.name} required className="input" />
      </Field>
      <Field label="Description">
        <textarea name="description" defaultValue={service?.description} rows={4} className="input resize-none" />
      </Field>
      <Field label="Starting price (e.g. Starting from R45 per item)">
        <input name="starting_price" defaultValue={service?.starting_price} required className="input" />
      </Field>
      <Field label="Display order">
        <input name="sort_order" type="number" defaultValue={service?.sort_order || 0} className="input" />
      </Field>

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
