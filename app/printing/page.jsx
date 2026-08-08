import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { waLink } from "@/lib/format";

export const revalidate = 0;

export const metadata = {
  title: "Printing Services",
  description: "DTF printing, sublimation and embroidery services for your wholesale blank apparel order.",
};

export default async function PrintingPage() {
  const supabase = createClient();

  const [{ data: settings }, { data: services }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase
      .from("printing_services")
      .select("*, printing_service_media(id, media_type, url, position)")
      .order("sort_order"),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Header settings={settings} />
      <WhatsAppButton phone={settings?.phone} />

      <main className="max-w-6xl mx-auto px-5 py-14">
        <section className="mb-12 text-center">
          <p className="text-olive font-bold text-xs tracking-[0.2em] uppercase mb-3">Custom Printing Services</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight mb-3 text-ink">
            From blank to branded.
          </h1>
          <p className="text-muted max-w-md mx-auto text-sm">
            Every method we offer, priced and ready. Pick a finish that fits your run size and budget.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(services || []).map((service) => {
            const media = (service.printing_service_media || []).sort((a, b) => a.position - b.position);
            const cover = media[0];
            return (
              <div key={service.id} className="bg-white border border-line rounded-2xl overflow-hidden flex flex-col">
                <div className="aspect-[16/9] bg-[#F5F5F3] overflow-hidden">
                  {cover ? (
                    cover.media_type === "video" ? (
                      <video src={cover.url} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={cover.url} alt={service.name} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                      No photos yet
                    </div>
                  )}
                </div>
                {media.length > 1 && (
                  <div className="flex items-center gap-1.5 px-4 pt-3 overflow-x-auto">
                    {media.slice(1).map((m) => (
                      <div key={m.id} className="w-10 h-10 rounded-md overflow-hidden bg-[#F5F5F3] flex-shrink-0">
                        {m.media_type === "video" ? (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-muted">
                            Video
                          </div>
                        ) : (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-6 flex flex-col gap-3">
                  <h2 className="font-display font-extrabold text-lg text-ink">{service.name}</h2>
                  <p className="text-sm text-muted leading-relaxed">{service.description}</p>
                  <p className="font-semibold text-sm text-ink mt-1">{service.starting_price}</p>
                  <a
                    href={waLink(settings?.phone, `Hi Blanks In Bulk, I'm interested in your ${service.name} service.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center bg-[#25D366] hover:bg-[#1ebe5a] transition-colors text-white font-semibold text-sm py-2.5 rounded-full flex items-center justify-center gap-1.5 mt-1"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {(!services || services.length === 0) && (
          <div className="text-center py-16 text-muted text-sm">
            No printing services yet — add some from the admin dashboard.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
