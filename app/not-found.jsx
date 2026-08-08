import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display font-extrabold text-3xl text-ink mb-3">Page not found</h1>
      <p className="text-muted mb-6">That page doesn't exist or may have been removed.</p>
      <Link href="/" className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-full">
        Back to homepage
      </Link>
    </div>
  );
}
