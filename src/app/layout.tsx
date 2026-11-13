
import type { Metadata } from "next";
import WorkspaceNavigation from "@/components/WorkspaceNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "SideroSpace | Space Research Intelligence",
  description:
    "Explore NASA microgravity combustion research, compare experiment data, and trace evidence relevant to fire safety in space.",
  openGraph: {
    title: "SideroSpace | Space Research Intelligence",
    description:
      "Explore NASA microgravity combustion research, compare experiment data, and trace evidence relevant to fire safety in space.",
    siteName: "SideroSpace",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SideroSpace | Space Research Intelligence",
    description:
      "Explore NASA microgravity combustion research, compare experiment data, and trace evidence relevant to fire safety in space.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WorkspaceNavigation />
        {children}
      </body>
    </html>
  );
}
