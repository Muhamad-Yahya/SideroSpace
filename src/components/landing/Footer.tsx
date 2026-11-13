import Link from "next/link";

const navGroups = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Insights", href: "/insights" },
      { label: "Compare", href: "/compare" },
      { label: "Research Library", href: "/research" },
    ],
  },
  {
    title: "Investigations",
    links: [
      { label: "FLEX", href: "/flex" },
      { label: "BASS-II", href: "/bass-ii" },
      { label: "SAFFIRE-I", href: "/saffire" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/adimail/SideroSpace",
        external: true,
      },
      {
        label: "NASA Open Data",
        href: "https://data.nasa.gov",
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] bg-[#020509] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-lg font-semibold tracking-tight">
                Sidero<span className="text-blue-400">Space</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[12px] leading-6 text-slate-500">
              An independently developed research intelligence platform
              exploring NASA microgravity combustion experiments. Not affiliated
              with NASA.
            </p>
          </div>

          {/* Nav groups */}
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[12px] text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                      {"external" in link && link.external && (
                        <span className="ml-1 text-slate-600">↗</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/[0.05] pt-8 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] leading-5 text-slate-600">
              © {new Date().getFullYear()} SideroSpace. Open source under MIT
              License.
            </p>
            <p className="max-w-lg text-[9px] leading-4 text-slate-700">
              This platform uses publicly available NASA data for educational and
              research purposes. It is not endorsed by, affiliated with, or
              funded by NASA. All experiment names are property of their
              respective programs.
            </p>
          </div>
          <Link
            href="https://github.com/adimail/SideroSpace"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[11px] text-slate-500 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76 1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.13 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
            </svg>
            adimail/SideroSpace
          </Link>
        </div>
      </div>
    </footer>
  );
}
