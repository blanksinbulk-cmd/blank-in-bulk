import { createClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const supabase = createClient();
  const { data: products } = await supabase.from("products").select("slug, updated_at").eq("is_published", true);

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  const staticRoutes = ["", "/printing", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = (products || []).map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
