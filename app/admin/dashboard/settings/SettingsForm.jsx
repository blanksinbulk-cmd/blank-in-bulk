"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ settings, updateAction }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData) {
    setSaving(true);
    setError("");
    setSaved(false);
    const result = await updateAction(formData);
    setSaving(false);
    if (result?.error) setError(result.error);
    else {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-4">
      <Field label="Email">
        <input name="email" type="email" defaultValue={settings?.email} required className="input" />
      </Field>
      <Field label="Phone (WhatsApp) — use +27 format">
        <input name="phone" defaultValue={settings?.phone} required className="input" />
      </Field>
      <Field label="Note shown on Contact page">
        <textarea name="note" defaultValue={settings?.note} rows={2} className="input resize-none" />
      </Field>
      <Field label="About Us heading">
        <input name="about_heading" defaultValue={settings?.about_heading} className="input" />
      </Field>
      <Field label="About Us text">
        <textarea name="about_text" defaultValue={settings?.about_text} rows={4} className="input resize-none" />
      </Field>

      {error && <p className="text-sm text-[#B23B3B]">{error}</p>}
      {saved && <p className="text-sm text-olive">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-black hover:bg-[#222] text-white font-semibold text-sm py-3 rounded-full disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save changes"}
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
