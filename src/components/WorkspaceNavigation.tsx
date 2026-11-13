"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  ChevronDown,
  Flame,
  FlaskConical,
  GitCompareArrows,
  Lightbulb,
  MessageCircleQuestion,
  Orbit,
  Waves,
  Database,
} from "lucide-react";

const experimentLinks = [
  { href: "/flex", label: "FLEX", icon: Waves },
  { href: "/bass-ii", label: "BASS-II", icon: Database },
  { href: "/saffire", label: "SAFFIRE-I", icon: Flame },
];

const primaryLinks = [
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/research", label: "Research Library", icon: BookOpen },
  { href: "/ask", label: "Ask SideroSpace", icon: MessageCircleQuestion }
];

export default function WorkspaceNavigation() {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname === "/landingpage" ||
    pathname.startsWith("/landingpage/") ||
    pathname === "/landing-page" ||
    pathname.startsWith("/landing-page/")
  ) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href;
  const isExperimentActive = experimentLinks.some(({ href }) =>
    isActive(href)
  );

  const renderExperimentLinks = (className: string) =>
    experimentLinks.map(({ href, label, icon: Icon }) => (
      <Link
        key={href}
        href={href}
        aria-current={isActive(href) ? "page" : undefined}
        className={`${className}${isActive(href) ? " active" : ""}`}
      >
        <Icon size={15} aria-hidden="true" />
        <span>{label}</span>
      </Link>
    ));

  return (
    <header className="site-header">
      <Link className="site-brand" href="/" aria-label="SideroSpace home">
        <span className="site-brand-mark">
          <Orbit size={19} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span className="site-brand-copy">
          <strong>SideroSpace</strong>
          <small>COMBUSTION RESEARCH INTELLIGENCE</small>
        </span>
      </Link>

      <nav className="site-nav-desktop" aria-label="Main navigation">
        <Link
          href="/dashboard"
          aria-current={isActive("/dashboard") ? "page" : undefined}
          className={`site-nav-link${isActive("/dashboard") ? " active" : ""}`}
        >
          <Activity size={15} aria-hidden="true" />
          Dashboard
        </Link>

        <details
          className={`site-nav-experiments${isExperimentActive ? " active" : ""}`}
        >
          <summary
            className="site-nav-link"
            aria-current={isExperimentActive ? "page" : undefined}
          >
            <FlaskConical size={15} aria-hidden="true" />
            Experiments
            <ChevronDown
              size={13}
              className="site-nav-chevron"
              aria-hidden="true"
            />
          </summary>
          <div className="site-nav-menu" aria-label="Experiment pages">
            {renderExperimentLinks("site-nav-menu-link")}
          </div>
        </details>

        {primaryLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={`site-nav-link${isActive(href) ? " active" : ""}`}
          >
            <Icon size={15} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <details className="site-nav-mobile">
        <summary className="site-nav-mobile-trigger">
          <span className="site-nav-mobile-trigger-label">
            <FlaskConical size={16} aria-hidden="true" />
            Navigation
          </span>
          <ChevronDown
            size={14}
            className="site-nav-chevron"
            aria-hidden="true"
          />
        </summary>
        <nav className="site-nav-mobile-menu" aria-label="Main navigation">
          <Link
            href="/dashboard"
            aria-current={isActive("/dashboard") ? "page" : undefined}
          >
            <Activity size={15} aria-hidden="true" />
            Dashboard
          </Link>
          <details
            className={`site-nav-mobile-experiments${
              isExperimentActive ? " active" : ""
            }`}
          >
            <summary>
              <FlaskConical size={15} aria-hidden="true" />
              Experiments
              <ChevronDown
                size={13}
                className="site-nav-chevron"
                aria-hidden="true"
              />
            </summary>
            <div className="site-nav-mobile-submenu">
              {renderExperimentLinks("site-nav-mobile-sublink")}
            </div>
          </details>
          {primaryLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
