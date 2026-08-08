import Link from "next/link";
import { currency } from "@/lib/format";

const STOCK_LABEL = {
  in_stock: { text: "In stock", className: "text-olive" },
  low_stock: { text: "Low stock", className: "text-[#B8860B]" },
  out_of_stock: { text: "Out of stock", className: "text-[#B23B3B]" },
};

export default function ProductCard({ product }) {
  const cover = product.product_media?.find((m) => m.media_type === "image") || product.product_media?.[0];
  const stock = STOCK_LABEL[product.stock_status] || STOCK_LABEL.in_stock;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white border border-line rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="aspect-[4/5] bg-[#F5F5F3] overflow-hidden">
        {cover ? (
          <img
            src={cover.url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">No photo</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1.5">
        {product.categories?.name && (
          <span className="text-[10px] tracking-[0.15em] uppercase text-olive font-semibold">
            {product.categories.name}
          </span>
        )}
        <span className="font-semibold text-[15px] text-ink leading-snug">{product.name}</span>
        <span className={"text-[11px] font-semibold " + stock.className}>{stock.text}</span>
        <span className="text-[11px] text-muted">MOQ: {product.moq}</span>

        <div className="mt-auto pt-2 flex items-center gap-2">
          {product.was_price && Number(product.was_price) > Number(product.price) && (
            <span className="text-xs text-[#999] line-through">{currency(product.was_price)}</span>
          )}
          <span className="font-display font-extrabold text-base text-ink">{currency(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
