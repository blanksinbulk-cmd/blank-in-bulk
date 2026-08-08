import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Blanks In Bulk | Wholesale Blank Apparel & Printing, South Africa",
    template: "%s | Blanks In Bulk",
  },
  description:
    "Wholesale blank apparel for brands, schools, churches, sports clubs and businesses across South Africa. Hoodies, T-shirts, long sleeves and caps, plus DTF, sublimation and embroidery printing services.",
  keywords: [
    "wholesale apparel",
    "blank clothing",
    "plain t-shirts",
    "hoodies",
    "custom printing",
    "DTF printing",
    "embroidery",
    "South Africa",
    "Blanks In Bulk",
  ],
  openGraph: {
    title: "Blanks In Bulk | Wholesale Blank Apparel & Printing",
    description:
      "Premium wholesale blank apparel with nationwide delivery in 2-3 working days, plus DTF, sublimation and embroidery printing services.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink antialiased">{children}</body>
    </html>
  );
}
