"use client";

import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userMutedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let startTimeSet = false;

    const attemptPlayback = () => {
      if (audio.readyState < HTMLMediaElement.HAVE_METADATA) return;
      if (!startTimeSet) {
        audio.currentTime = 160;
        startTimeSet = true;
      }
      if (userMutedRef.current) return;

      audio.muted = false;
      void audio.play().then(
        () => {
          window.removeEventListener("pointerdown", attemptPlayback);
          window.removeEventListener("keydown", attemptPlayback);
        },
        () => {
          // Browsers may block audible autoplay until the first user gesture.
        },
      );
    };

    audio.muted = false;
    audio.addEventListener("loadedmetadata", attemptPlayback);
    window.addEventListener("pointerdown", attemptPlayback);
    window.addEventListener("keydown", attemptPlayback);
    attemptPlayback();

    return () => {
      audio.removeEventListener("loadedmetadata", attemptPlayback);
      window.removeEventListener("pointerdown", attemptPlayback);
      window.removeEventListener("keydown", attemptPlayback);
      audio.pause();
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldMute = !userMutedRef.current;
    userMutedRef.current = shouldMute;
    audio.muted = shouldMute;
    setMusicMuted(shouldMute);

    if (!shouldMute) {
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA && audio.currentTime < 160) {
        audio.currentTime = 160;
      }
      void audio.play().catch(() => {
        // The browser will retry on the next user gesture.
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030711] text-white">
      <audio
        ref={audioRef}
        src="/Music/Hanz_Zimmer_-_S.T.A.Y._ost_Interstellar_(mp3.pm).mp3"
        preload="auto"
      />

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,rgba(18,75,139,0.2),transparent_55%)]" />

      {/* Stars */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 20%, white 100%, transparent),
            radial-gradient(1px 1px at 80% 15%, white 100%, transparent),
            radial-gradient(1px 1px at 35% 45%, white 100%, transparent),
            radial-gradient(1px 1px at 70% 55%, white 100%, transparent),
            radial-gradient(1.5px 1.5px at 90% 35%, white 100%, transparent),
            radial-gradient(1px 1px at 20% 65%, white 100%, transparent)
          `,
          backgroundSize: "350px 350px",
        }}
      />

      {/* Independent landing page navigation */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.10] bg-[#030711]/35 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Desktop navigation */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            <Link
              href="#challenge"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Challenge
            </Link>

            <Link
              href="#features"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Features
            </Link>

            <Link
              href="#creator"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Creator
            </Link>
          </div>

          {/* Desktop project and soundtrack controls */}
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <Link
              href="/dashboard"
              className="rounded-full border border-blue-300/50 bg-gradient-to-r from-blue-500/30 to-cyan-400/20 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.2)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-200/70 hover:shadow-[0_0_32px_rgba(59,130,246,0.4)]"
            >
              Visit Project <span className="ml-2">↗</span>
            </Link>
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={musicMuted ? "Unmute landing soundtrack" : "Mute landing soundtrack"}
              aria-pressed={!musicMuted}
              title={musicMuted ? "Unmute soundtrack" : "Mute soundtrack"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-300/30 bg-blue-950/40 text-blue-100 backdrop-blur-md transition hover:border-cyan-200/70 hover:bg-blue-900/60"
            >
              {musicMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={musicMuted ? "Unmute landing soundtrack" : "Mute landing soundtrack"}
              aria-pressed={!musicMuted}
              title={musicMuted ? "Unmute soundtrack" : "Mute soundtrack"}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-blue-100"
            >
              {musicMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-xl text-white"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </nav>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-[#030711]/95 px-6 py-6 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4">
              {[
                { label: "Challenge", href: "#challenge" },
                { label: "Features", href: "#features" },
                { label: "Creator", href: "#creator" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-slate-300 transition hover:text-blue-300"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full border border-blue-300/50 bg-gradient-to-r from-blue-500/30 to-cyan-400/20 px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.2)]"
              >
                Visit Project ↗
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero content */}
      <section className="relative z-20 flex min-h-screen flex-col items-center px-5 pt-32 text-center sm:pt-36">
        <h1 className="max-w-5xl text-6xl font-semibold tracking-[-0.055em] sm:text-7xl md:text-8xl lg:text-[104px] text-white">
          Sidero<span className="text-blue-400">Space</span>
        </h1>

        <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
          Explore how fire behaves beyond Earth. SideroSpace brings selected NASA microgravity combustion data and research evidence into one place to explore, compare, and understand.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-full bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] border border-blue-400/40 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-400 hover:shadow-[0_0_35px_rgba(59,130,246,0.6)]"
          >
            Explore the Project
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>
          </Link>

          <Link
            href="https://github.com/Muhamad-Yahya/SideroSpace"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-full border border-blue-400/30 bg-blue-950/40 px-7 py-3.5 text-sm font-medium text-blue-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/60 hover:bg-blue-900/50 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76 1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.13 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
            </svg>
            GitHub Source
          </Link>
        </div>

      </section>

      {/* Earth image - exactly as originally provided */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-[125%] -translate-x-1/2 sm:w-[110%] lg:w-full">
        <div className="absolute -top-12 left-1/2 h-24 w-[80%] -translate-x-1/2 rounded-[50%] bg-blue-500/20 blur-[70px]" />

        <div
          className="relative h-[300px] w-full overflow-hidden sm:h-[400px] md:h-[480px] lg:h-[540px]"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 100%)",
          }}
        >
          <Image
            src="/images/earth.webp"
            alt="Earth viewed from space"
            fill
            unoptimized
            preload
            sizes="100vw"
            className="object-cover object-[center_80%] opacity-90"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#030711] via-transparent to-[#030711]/20" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 z-30 h-16 w-full bg-gradient-to-t from-[#030711] to-transparent" />
    </div>
  );
}
