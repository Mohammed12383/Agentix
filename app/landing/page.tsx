"use client";

import { useCallback, useEffect, useState } from "react";
import { IntroAnimation, HERO_REVEAL_MS } from "@/components/intro-animation";
import { MobileNav } from "@/components/mobile-nav";
import { LiveAgentFeed, LiveAgentCounter } from "@/components/live-agent-feed";
import { StackingAgentCards } from "@/components/stacking-agent-cards";
import { DevExSection } from "@/components/devex-section";

export default function LandingPage() {
  const [heroReady, setHeroReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const handleIntroDone = useCallback(() => {
    setHeroReady(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">
      <IntroAnimation onDone={handleIntroDone} />
      <MobileNav />

      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ transform: videoReady ? "scale(1.05)" : "scale(0.85)", transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentix-hero-9yW3wnTNMfn2U6lsVhTTZSJFEvAoSj.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 18%, rgba(245,244,240,0.85) 35%, rgba(245,244,240,0.5) 55%, rgba(245,244,240,0.15) 75%, transparent 100%)" }} />

        <div className="absolute inset-x-0 bottom-0 z-30 px-6 md:px-12 pb-12 max-w-3xl">
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-light leading-[1.0] tracking-tight mb-10"
            style={{
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(24px)",
              transform: heroReady ? "translateY(0px)" : "translateY(32px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), filter 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            Build &amp;<br />orchestrate AI<br />agents while<br />you sleep.
          </h1>
          <div className="mt-8">
            <a
              href="http://localhost:5173/"
              data-testid="landing-start-building"
              className="inline-flex items-center rounded-xl bg-[#111] px-6 py-3 text-sm tracking-widest text-white transition-colors hover:bg-[#333]"
            >
              Start building
            </a>
          </div>
          <div className="mt-10 flex items-end gap-2">
            <LiveAgentCounter />
            <span className="text-black/30 text-sm mb-1 tracking-wide">agents active globally</span>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <StackingAgentCards />
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <DevExSection />
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">Agents working 24/7, autonomously.</h2>
            <p className="mt-6 text-base text-black/40 leading-relaxed max-w-sm">At any moment, thousands of agents are running tasks on behalf of teams around the world.</p>
          </div>
          <LiveAgentFeed />
        </div>
      </section>
    </div>
  );
}
