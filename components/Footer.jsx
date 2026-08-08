export default function Footer() {
  return (
    <footer className="border-t border-line mt-4">
      <div className="max-w-6xl mx-auto px-5 py-8 text-xs text-muted">
        &copy; {new Date().getFullYear()} Blanks In Bulk
      </div>
    </footer>
  );
}
