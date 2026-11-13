import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SideroSpace — Microgravity Combustion Research Intelligence",
  description:
    "Explore NASA microgravity combustion research data through interactive visualizations. FLEX, BASS-II, and SAFFIRE experiments analyzed for fire safety in space.",
  openGraph: {
    title: "SideroSpace — Microgravity Combustion Research Intelligence",
    description:
      "Explore NASA microgravity combustion research data through interactive visualizations.",
    siteName: "SideroSpace",
    type: "website",
  },
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="landing-page-shell">{children}</div>;
}
