import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { waLink } from "@/lib/format";

export const revalidate = 0;

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Blanks In Bulk for wholesale apparel and printing enquiries.",
};

export default async function ContactPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  return (
    <div className="min-h-screen bg-white">
      <Header settings={settings} />
      <WhatsAppButton phone={settings?.phone} />

      <main className="max-w-2xl mx-auto px-5 py-14">
        <section className="mb-10 text-center">
          <p className="text-olive font-bold text-xs tracking-[0.2em] uppercase mb-3">Get In Touch</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight mb-3 text-ink">
            Let's talk stock.
          </h1>
        </section>

        <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold mb-0.5">Email</p>
            <p className="font-semibold text-[15px] text-ink">{settings?.email}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold mb-0.5">Phone</p>
            <p className="font-semibold text-[15px] text-ink">{settings?.phone}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold mb-0.5">Note</p>
            <p className="text-sm text-muted">{settings?.note}</p>
          </div>

          <div className="flex gap-3 pt-2 flex-wrap">
            <a
              href={waLink(settings?.phone, "Hi Blanks In Bulk, I'd like to find out more about your products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[100px] text-center bg-[#25D366] hover:bg-[#1ebe5a] transition-colors text-white font-semibold text-sm py-3 rounded-full"
            >
              WhatsApp
            </a>
            <a
              href={"mailto:" + settings?.email}
              className="flex-1 min-w-[100px] text-center bg-black hover:bg-[#222] transition-colors text-white font-semibold text-sm py-3 rounded-full"
            >
              Email us
            </a>
            <a
              href={"tel:" + (settings?.phone || "").replace(/\s/g, "")}
              className="flex-1 min-w-[100px] text-center border border-ink text-ink hover:bg-black hover:text-white transition-colors font-semibold text-sm py-3 rounded-full"
            >
              Call us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
