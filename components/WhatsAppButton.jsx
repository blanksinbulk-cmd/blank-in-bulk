import { waLink } from "@/lib/format";

export default function WhatsAppButton({ phone, message }) {
  return (
    <a
      href={waLink(phone, message || "Hi Blanks In Bulk, I'd like to find out more about your products.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 rounded-full shadow-lg shadow-black/20 transition-transform hover:scale-105 flex items-center justify-center overflow-hidden"
      aria-label="Chat on WhatsApp"
    >
      <img src="/wa-icon.png" alt="WhatsApp" className="w-16 h-16" />
    </a>
  );
}
