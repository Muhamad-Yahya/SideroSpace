import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask SideroSpace | Space Research Intelligence",
  description:
    "Ask research questions about FLEX, BASS-II, and SAFFIRE-I using curated answers and indexed source evidence.",
};

export default function AskLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
