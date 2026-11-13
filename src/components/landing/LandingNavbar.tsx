"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Orbit, Menu, X, ArrowUpRight } from "lucide-react";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-cyan-500/20 bg-[#030712]/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent border-b border-white/[0.04]"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brand & Mission Status */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Orbit className="h-4.5 w-4.5 text-cyan-400 animate-spin" style={{ animationDuration: "20s" }} />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm group-hover:bg-cyan-400/20 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-wider text-white">
                SIDERO<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SPACE</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-300/70 uppercase">
                Zero-G Combustion Intel
              </span>
            </div>
          </Link>

          {/* Telemetry Indicator Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-950/40 px-3 py-1 text-[11px] font-mono text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>ORBIT: LEO 408KM</span>
            <span className="text-cyan-500/50">|</span>
            <span className="text-emerald-400">TELEMETRY LIVE</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <a
            href="#challenge"
            className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-300 transition-colors"
          >
            Challenge
          </a>
          <a
            href="#features"
            className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-300 transition-colors"
          >
            Features
          </a>
          <a
            href="#creator"
            className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-300 transition-colors"
          >
            Creator
          </a>
        </nav>

        {/* Desktop Action Launch Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-indigo-500/30 px-7 py-3 text-sm font-mono font-semibold tracking-wider text-white shadow-[0_0_24px_rgba(6,182,212,0.2)] transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02]"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>VISIT PROJECT</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-cyan-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 text-cyan-300 md:hidden hover:bg-cyan-950/30"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="border-b border-cyan-500/20 bg-[#030712]/95 backdrop-blur-2xl px-6 py-5 md:hidden">
          <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
            <a
              href="#challenge"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3 text-slate-200"
            >
              <span>Challenge</span>
              <ArrowUpRight className="h-4 w-4 text-cyan-400" />
            </a>
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3 text-slate-200"
            >
              <span>Features</span>
              <ArrowUpRight className="h-4 w-4 text-blue-400" />
            </a>
            <a
              href="#creator"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3 text-slate-200"
            >
              <span>Creator</span>
              <ArrowUpRight className="h-4 w-4 text-cyan-400" />
            </a>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-3 text-center font-bold text-white shadow-lg shadow-cyan-500/25"
            >
              <span>Visit Project</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
