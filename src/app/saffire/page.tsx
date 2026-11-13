
import type { Metadata } from "next";
import SaffireExplorer from "@/components/saffire/SaffireExplorer";
import "./saffire.css";

export const metadata: Metadata = {
  title: "SAFFIRE-I | SideroSpace",
  description:
    "Explore SAFFIRE-I experiment objectives, documented conditions, and available F1C1 pre-test imagery.",
};

export default function SaffirePage() {
  return <SaffireExplorer />;
}
