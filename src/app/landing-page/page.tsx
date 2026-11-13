"use client";

import StarField from "@/components/landing/StarField";
import HeroSection from "@/components/landing/HeroSection";
import SpaceTelemetryMetrics from "@/components/landing/SpaceTelemetryMetrics";
import SpaceAppsChallengeSection from "@/components/landing/SpaceAppsChallengeSection";
import SiteFeaturesDeck from "@/components/landing/SiteFeaturesDeck";
import ZeroGPhysicsSection from "@/components/landing/ZeroGPhysicsSection";
import CreatorSection from "@/components/landing/CreatorSection";
import CosmicLaunchCTA from "@/components/landing/CosmicLaunchCTA";
import SimpleFooter from "@/components/landing/SimpleFooter";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#030711] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Animated Cosmic Canvas: Twinkling multi-depth stars & random shooting meteors */}
      <StarField />

      {/* 1. Hero Section: SideroSpace vision, Earth horizon, and independent navigation */}
      <HeroSection />

      {/* 2. Project Overview: Audited telemetry and dataset records ribbon */}
      <SpaceTelemetryMetrics />

      {/* 3. The NASA Space Apps Challenge: 'Flame in Freefall' context & purpose */}
      <SpaceAppsChallengeSection />

      {/* 4. Platform Capabilities: All 7 interactive modules & tools */}
      <SiteFeaturesDeck />

      {/* 5. Fundamental Fluid Dynamics: Microgravity buoyancy reduction physics */}
      <ZeroGPhysicsSection />

      {/* 6. About the Creator: 2-column personal section with ME.png directly above the CTA */}
      <CreatorSection />

      {/* 7. Cosmic Launch CTA: 'Ready to Explore the Research?' action buttons */}
      <CosmicLaunchCTA />

      {/* 8. Simple Footer: Minimalist disclaimer & links */}
      <SimpleFooter />
    </main>
  );
}
