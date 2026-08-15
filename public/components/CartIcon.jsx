"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartIcon() {
  const { count } = useCart();

  return (
    <Link href="/cart" className="relative flex-shrink-0 p-2 text-ink hover:text-olive" aria-label="View cart">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-olive text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </Link>
  );
}
