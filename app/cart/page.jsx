import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CartPageClient from "./CartPageClient";

export const revalidate = 0;

export const metadata = {
  title: "Your Order",
};

export default async function CartPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  return (
    <div className="min-h-screen bg-white">
      <Header settings={settings} />
      <WhatsAppButton phone={settings?.phone} />
      <CartPageClient phone={settings?.phone} />
      <Footer />
    </div>
  );
}
