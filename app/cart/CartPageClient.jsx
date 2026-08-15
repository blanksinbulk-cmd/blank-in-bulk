"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import { currency, waLink } from "@/lib/format";

export default function CartPageClient({ phone }) {
  const { items, removeItem, updateQty, clear } = useCart();
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [artworkUrl, setArtworkUrl] = useState("");
  const [artworkName, setArtworkName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const subtotal = items.reduce((sum, i) => sum + Number(i.price || 0) * i.qty, 0);
  const totalUnits = items.reduce((sum, i) => sum + i.qty, 0);

  async function handleArtworkUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setUploadError("That file is too large — keep it under 20MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `artwork/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadErr } = await supabase.storage.from("media").upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      setArtworkUrl(pub.publicUrl);
      setArtworkName(file.name);
    } catch (err) {
      setUploadError("Upload failed — please try again, or just send your artwork separately on WhatsApp.");
    } finally {
      setUploading(false);
    }
  }

  function buildMessage() {
    const lines = [`Hi Blanks In Bulk, I'd like to order:`, ""];
    items.forEach((item) => {
      const variant = [item.size, item.colour].filter(Boolean).join(" / ");
      lines.push(`• ${item.name}${variant ? ` (${variant})` : ""} — Qty: ${item.qty} (MOQ: ${item.moq})`);
    });
    lines.push("");
    lines.push(`Total units: ${totalUnits}`);
    if (name) lines.push(`Name: ${name}`);
    if (customerPhone) lines.push(`My number: ${customerPhone}`);
    if (artworkUrl) lines.push(`Artwork: ${artworkUrl}`);
    lines.push("");
    lines.push("Please could you confirm pricing and availability.");
    return lines.join("\n");
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-5 py-16 text-center">
        <h1 className="font-display font-extrabold text-2xl text-ink mb-3">Your order is empty</h1>
        <p className="text-muted mb-6">Add some products first, then come back here to send your order.</p>
        <Link href="/#shop" className="inline-block bg-black text-white text-sm font-semibold px-6 py-3 rounded-full">
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-6">Your order</h1>

      <div className="flex flex-col gap-3 mb-8">
        {items.map((item) => (
          <div key={item.key} className="flex gap-3 bg-white border border-line rounded-2xl p-3">
            <div className="w-16 h-16 rounded-lg bg-[#F5F5F3] flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-ink truncate">{item.name}</p>
              <p className="text-xs text-muted">
                {[item.size, item.colour].filter(Boolean).join(" / ")}
              </p>
              <p className="text-xs text-muted">MOQ: {item.moq}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => updateQty(item.key, item.qty - 1)}
                  className="w-7 h-7 rounded-full border border-line text-sm flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-sm w-6 text-center">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => updateQty(item.key, item.qty + 1)}
                  className="w-7 h-7 rounded-full border border-line text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <span className="font-display font-bold text-sm text-ink">{currency(item.price)}</span>
              <button
                type="button"
                onClick={() => removeItem(item.key)}
                className="text-xs text-[#B23B3B]"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8 text-sm font-semibold text-ink border-t border-line pt-4">
        <span>{totalUnits} units — indicative subtotal</span>
        <span className="font-display text-lg">{currency(subtotal)}</span>
      </div>

      <div className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-4 mb-6">
        <h2 className="font-display font-extrabold text-base text-ink">Your details</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="bg-[#F5F5F3] border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-olive"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold">Your number</label>
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="e.g. 082 123 4567"
            className="bg-[#F5F5F3] border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-olive"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold">
            Attach your logo or artwork (optional)
          </label>
          {artworkUrl ? (
            <div className="flex items-center justify-between bg-[#F5F5F3] border border-line rounded-lg px-3 py-2.5 text-sm">
              <span className="truncate">{artworkName}</span>
              <button
                type="button"
                onClick={() => {
                  setArtworkUrl("");
                  setArtworkName("");
                }}
                className="text-xs text-[#B23B3B] flex-shrink-0 ml-2"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="border-2 border-dashed border-line rounded-lg px-3 py-4 text-sm text-muted hover:border-olive disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "+ Add a file"}
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,.ai,.eps" onChange={handleArtworkUpload} className="hidden" />
          {uploadError && <p className="text-xs text-[#B23B3B]">{uploadError}</p>}
        </div>
      </div>

      <a
        href={waLink(phone, buildMessage())}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold text-sm py-3.5 rounded-full transition-colors mb-3"
      >
        Send order via WhatsApp
      </a>

      <button
        type="button"
        onClick={clear}
        className="w-full text-center text-xs text-muted underline"
      >
        Clear order
      </button>
    </main>
  );
}
