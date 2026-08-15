import Link from "next/link";
import Image from "next/image";
import CartIcon from "./CartIcon";

export default function Header({ settings }) {
  return (
    <>
      <div className="bg-black text-white text-[11px] sm:text-xs font-body">
        <div className="max-w-6xl mx-auto px-5 py-2 flex items-center justify-between gap-3 flex-wrap">
          <span>Nationwide delivery in 2-3 working days</span>
          <span className="hidden sm:inline text-white/70">
            Mon-Fri: 9am-5pm | Sat: 9am-4pm | Sun: Orders Only
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-5 py-2 md:py-3 lg:py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="Blanks In Bulk" width={557} height={489} className="h-14 sm:h-24 lg:h-36 xl:h-40 w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-muted hover:text-ink">
              Home
            </Link>
            <Link href="/#shop" className="px-3 py-2 text-sm font-medium text-muted hover:text-ink">
              Shop
            </Link>
            <Link href="/printing" className="px-3 py-2 text-sm font-medium text-muted hover:text-ink">
              Printing
            </Link>
            <Link href="/contact" className="px-3 py-2 text-sm font-medium text-muted hover:text-ink">
              Contact
            </Link>
          </nav>

          <CartIcon />
        </div>
        <nav className="md:hidden flex items-center gap-1 px-5 pb-3 overflow-x-auto">
          <Link href="/" className="px-3 py-2 text-sm font-medium text-muted hover:text-ink flex-shrink-0">
            Home
          </Link>
          <Link href="/#shop" className="px-3 py-2 text-sm font-medium text-muted hover:text-ink flex-shrink-0">
            Shop
          </Link>
          <Link href="/printing" className="px-3 py-2 text-sm font-medium text-muted hover:text-ink flex-shrink-0">
            Printing
          </Link>
          <Link href="/contact" className="px-3 py-2 text-sm font-medium text-muted hover:text-ink flex-shrink-0">
            Contact
          </Link>
        </nav>
      </header>
    </>
  );
}
