"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product, coverImage }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [colour, setColour] = useState(product.colours?.[0] || "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      moq: product.moq,
      image: coverImage || null,
      size: size || null,
      colour: colour || null,
      qty: Math.max(1, Number(qty) || 1),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const outOfStock = product.stock_status === "out_of_stock";

  return (
    <div className="flex flex-col gap-4">
      {product.sizes?.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold mb-1.5">Size</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={
                  "text-xs px-3 py-1.5 rounded-full border transition-colors " +
                  (size === s ? "bg-black text-white border-black" : "border-line text-muted hover:border-black")
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colours?.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold mb-1.5">Colour</p>
          <div className="flex flex-wrap gap-1.5">
            {product.colours.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColour(c)}
                className={
                  "text-xs px-3 py-1.5 rounded-full border transition-colors " +
                  (colour === c ? "bg-black text-white border-black" : "border-line text-muted hover:border-black")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold mb-1.5">Quantity</p>
          <div className="flex items-center border border-line rounded-full overflow-hidden">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, Number(q) - 1))}
              className="w-9 h-9 flex items-center justify-center text-lg text-muted hover:bg-[#F5F5F3]"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-12 text-center text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQty((q) => Number(q) + 1)}
              className="w-9 h-9 flex items-center justify-center text-lg text-muted hover:bg-[#F5F5F3]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          disabled={outOfStock}
          onClick={handleAdd}
          className="flex-1 bg-black hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors"
        >
          {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to Order"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push("/cart");
          }}
          disabled={outOfStock}
          className="flex-1 border border-ink disabled:opacity-40 disabled:cursor-not-allowed text-ink hover:bg-black hover:text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors"
        >
          Add & View Order
        </button>
      </div>
    </div>
  );
}
