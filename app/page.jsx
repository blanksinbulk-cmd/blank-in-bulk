import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 0;

export default async function HomePage({ searchParams }) {
  const supabase = createClient();

  const [{ data: settings }, { data: categories }, { data: products }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select("*, categories(name, slug), product_media(id, media_type, url, position)")
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  const activeCategory = searchParams?.category || "All";
  const visibleProducts =
    activeCategory === "All"
      ? products || []
      : (products || []).filter((p) => p.categories?.name === activeCategory);

  const categoryThumbnail = (name) => {
    const item = (products || []).find((p) => p.categories?.name === name);
    const media = item?.product_media?.find((m) => m.media_type === "image");
    return media?.url || null;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header settings={settings} />
      <WhatsAppButton phone={settings?.phone} />

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-5 pt-12 pb-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-muted font-semibold mb-4">
              Wholesale Blank Apparel
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.1] mb-5 text-ink">
              Quality blank apparel for <span className="text-olive">every</span> brand.
            </h1>
            <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
              Premium blank apparel ready for printing, embroidery and branding. Wholesale pricing with
              nationwide delivery within 2-3 working days.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#shop"
                className="bg-black hover:bg-[#222] text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors"
              >
                SHOP NOW
              </a>
              <Link
                href="/printing"
                className="border border-olive text-olive hover:bg-olive hover:text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors"
              >
                VIEW PRINTING SERVICES
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#F5F5F3]">
              {categoryThumbnail("Hoodies") ? (
                <img src={categoryThumbnail("Hoodies")} alt="Premium blank hoodies" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                  Add products to see them here
                </div>
              )}
            </div>
            <div className="absolute -bottom-5 -left-5 sm:left-6 bg-white border border-line rounded-2xl shadow-xl px-5 py-4 max-w-[200px]">
              <p className="font-display font-extrabold text-lg leading-none text-ink">3+ Years</p>
              <p className="font-display font-extrabold text-lg leading-tight text-ink mb-1">in Business</p>
              <p className="text-xs text-muted">Quality you can trust.</p>
            </div>
          </div>
        </section>

        {/* Category tiles */}
        {categories?.length > 0 && (
          <section className="max-w-6xl mx-auto px-5 py-16">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-center mb-10 text-ink">
              Our Most Popular Blanks
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${encodeURIComponent(cat.name)}#shop`}
                  className="group bg-white border border-line rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-[4/5] bg-[#F5F5F3] overflow-hidden">
                    {categoryThumbnail(cat.name) ? (
                      <img
                        src={categoryThumbnail(cat.name)}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                        No photo yet
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-ink">{cat.name}</span>
                    <span className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0">
                      Shop Now
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Shop grid */}
        <section id="shop" className="max-w-6xl mx-auto px-5 py-16 border-t border-line scroll-mt-20">
          <h2 className="font-display font-extrabold text-2xl text-ink mb-6">Shop All</h2>

          <div className="flex items-center gap-2 flex-wrap mb-8">
            <Link
              href="/#shop"
              className={
                "text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors " +
                (activeCategory === "All"
                  ? "bg-black text-white border-black"
                  : "border-line text-muted hover:border-black hover:text-black")
              }
            >
              All
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${encodeURIComponent(cat.name)}#shop`}
                className={
                  "text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors " +
                  (activeCategory === cat.name
                    ? "bg-black text-white border-black"
                    : "border-line text-muted hover:border-black hover:text-black")
                }
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {visibleProducts.length === 0 && (
            <div className="text-center py-16 text-muted text-sm">
              No products here yet — add some from the admin dashboard.
            </div>
          )}
        </section>

        {/* About */}
        <section className="max-w-3xl mx-auto px-5 py-16 border-t border-line text-center">
          <p className="text-olive font-bold text-xs tracking-[0.2em] uppercase mb-3">Who we are</p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mb-4">
            {settings?.about_heading || "About Us"}
          </h2>
          <p className="text-muted text-base leading-relaxed">{settings?.about_text}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
