import Link from "next/link";

export default function SimpleFooter() {
  return (
    <footer className="relative w-full border-t border-white/[0.08] bg-[#01040d] py-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Short Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <Link href="/" className="text-sm font-bold text-white tracking-tight">
            Sidero<span className="text-blue-400">Space</span>
          </Link>
          <span className="hidden sm:inline text-slate-600">|</span>
          <p className="text-xs text-slate-400 max-w-xl">
            Independent educational project for NASA Space Apps Challenge 2026. Not affiliated with or endorsed by NASA.
          </p>
        </div>

        {/* Minimal Links */}
        <div className="flex items-center gap-6 text-xs font-mono">
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/research" className="hover:text-blue-400 transition-colors">
            Research
          </Link>
          <Link
            href="https://github.com/adimail/SideroSpace"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
