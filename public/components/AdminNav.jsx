"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

const LINKS = [
  { href: "/admin/dashboard/products", label: "Products" },
  { href: "/admin/dashboard/categories", label: "Categories" },
  { href: "/admin/dashboard/printing", label: "Printing Services" },
  { href: "/admin/dashboard/settings", label: "Contact & About" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          <Link href="/admin/dashboard" className="font-display font-extrabold text-sm px-3 py-2">
            ADMIN
          </Link>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "text-sm px-3 py-2 rounded-full transition-colors " +
                (pathname.startsWith(link.href) ? "bg-white text-black font-semibold" : "text-white/70 hover:text-white")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-xs text-white/60 hover:text-white underline">
            View site
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full">
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
