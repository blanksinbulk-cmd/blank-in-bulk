export function currency(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return "R0";
  return "R" + num.toLocaleString("en-ZA");
}

export function waDigits(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) return "27" + digits.slice(1);
  return digits;
}

export function waLink(phone, message) {
  return `https://wa.me/${waDigits(phone)}?text=${encodeURIComponent(message || "")}`;
}

export function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    || "item-" + Date.now();
}
