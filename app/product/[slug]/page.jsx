import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductGallery from "@/components/ProductGallery";
import { currency, waLink } from "@/lib/format";
import { notFound } from "next/navigation";

export const revalidate = 0;

async function getProduct(slug) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(name), product_media(id, media_type, url, position)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description?.slice(0, 155) || `${product.name} - wholesale blank apparel from Blanks In Bulk.`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 155),
      images: product.product_media?.[0]?.url ? [product.product_media[0].url] : [],
    },
  };
}

const STOCK_LABEL = {
  in_stock: { text: "In stock", className: "bg-olive/10 text-olive" },
  low_stock: { text: "Low stock", className: "bg-[#B8860B]/10 text-[#B8860B]" },
  out_of_stock: { text: "Out of stock", className: "bg-[#B23B3B]/10 text-[#B23B3B]" },
};

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  const media = (product.product_media || []).sort((a, b) => a.position - b.position);
  const stock = STOCK_LABEL[product.stock_status] || STOCK_LABEL.in_stock;

  const enquiryMessage = `Hi Blanks In Bulk, I'd like to order:\n${product.name} (MOQ: ${product.moq})\n\nI'd also like a quote that includes printing on this item.`;

  return (
    <div className="min-h-screen bg-white">
      <Header settings={settings} />
      <WhatsAppButton phone={settings?.phone} />

      <main className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery media={media} />

        <div>
          {product.categories?.name && (
            <p className="text-xs tracking-[0.2em] uppercase text-olive font-semibold mb-2">
              {product.categories.name}
            </p>
          )}
          <h1 className="font-display font-extrabold text-3xl text-ink mb-3">{product.name}</h1>

          <span className={"inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 " + stock.className}>
            {stock.text}
          </span>

          <div className="flex items-center gap-3 mb-4">
            {product.was_price && Number(product.was_price) > Number(product.price) && (
              <span className="text-sm text-[#999] line-through">{currency(product.was_price)}</span>
            )}
            <span className="font-display font-extrabold text-2xl text-ink">{currency(product.price)}</span>
          </div>

          <div className="inline-block bg-[#F5F5F3] border border-line rounded-full px-4 py-1.5 text-sm font-semibold text-ink mb-6">
            MOQ: {product.moq}
          </div>

          {product.description && (
            <p className="text-muted text-base leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold mb-1.5">Sizes</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <span key={s} className="text-xs border border-line rounded-full px-2.5 py-1">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.colours?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold mb-1.5">Colours</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.colours.map((c) => (
                    <span key={c} className="text-xs border border-line rounded-full px-2.5 py-1">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {product.sku && <p className="text-xs text-[#999] mb-6">SKU: {product.sku}</p>}

          <a
            href={waLink(settings?.phone, enquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors"
          >
            Enquire on WhatsApp (with printing)
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
