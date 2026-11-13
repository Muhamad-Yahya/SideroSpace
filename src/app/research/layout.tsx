import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Library | SideroSpace",
  description:
    "Browse NASA source records and search indexed passages across SAFFIRE-I, FLEX, and BASS-II.",
};

export default function ResearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
