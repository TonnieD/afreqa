import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Zap, Heart, Shield, Music, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "About Our Movement",
  description: "Learn about Afreqa, Nairobi's premier electronic music festival brand blending African rhythms with Tomorrowland-style fantasy.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. HERO */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-afreqa-teal text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Origin & Vision</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-chrome tracking-tight">
          WHERE FREQUENCIES UNITE
        </h1>

        <p className="text-base sm:text-xl text-afreqa-silver max-w-2xl mx-auto leading-relaxed font-light">
          Afreqa was born from a singular obsession: to build East Africa&apos;s most transcendent electronic dance music gathering.
        </p>
      </div>

      {/* 2. THE STORY */}
      <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-afreqa-chrome-high/15 space-y-6 relative overflow-hidden shadow-metallic">
        <div className="absolute top-0 right-0 w-80 h-80 bg-afreqa-violet/15 rounded-full blur-[100px] pointer-events-none" />

        <h2 className="font-display font-black text-2xl sm:text-3xl text-afreqa-chrome-high">
          Nairobi as the Epicenter of Sound
        </h2>

        <div className="space-y-4 text-sm sm:text-base text-afreqa-silver leading-relaxed font-light">
          <p>
            For years, electronic dance music in East Africa operated in fractured basements and isolated club nights. But Kenya possesses a musical heartbeat unlike anywhere else on earth—rhythms built on ancient polyrhythms, organic percussion, and an electric modern youth culture hungry for cinematic scale.
          </p>
          <p>
            Inspired by the architectural grandeur, mystical storytelling, and utopian atmosphere of global icons like Tomorrowland, Afreqa re-imagines festival culture through an authentic African lens. We replace generic commercial EDM with the deep, visceral grooves of Afro-Tech, Melodic Techno, Progressive House, and futuristic tribal rhythms.
          </p>
          <p>
            When you enter an Afreqa edition, the mundane world dissolves. You step into an altar of sound—where monolithic stage sculptures, synchronized laser rays, and thousands of beating hearts become one single pulse.
          </p>
        </div>
      </div>

      {/* 3. CORE PILLARS / MANIFESTO */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="font-display font-black text-3xl text-chrome">
            Our Five Guiding Truths
          </h2>
          <p className="text-xs font-mono text-afreqa-silver-mid mt-1">
            The foundation upon which every Afreqa stage is erected
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl glass-panel p-6 border border-afreqa-chrome-high/10 space-y-2">
            <div className="flex items-center gap-2 text-afreqa-teal font-mono text-xs font-bold uppercase tracking-wider">
              <Music className="w-4 h-4" />
              <span>01. Uncompromising Audio</span>
            </div>
            <h3 className="font-display font-bold text-xl text-afreqa-chrome-high">Sound That Moves Blood</h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed">
              We engineer custom acoustic deployments with extreme sub-bass control, ensuring deep chest impact with zero ear-piercing harshness.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-6 border border-afreqa-chrome-high/10 space-y-2">
            <div className="flex items-center gap-2 text-afreqa-violet font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>02. Visual Fantasy</span>
            </div>
            <h3 className="font-display font-bold text-xl text-afreqa-chrome-high">Light As Architecture</h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed">
              Stage design is never a mere backdrop; it is a portal. We craft layered lasers, pyro flourishes, and atmospheric fog synchronized to every crescendo.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-6 border border-afreqa-chrome-high/10 space-y-2">
            <div className="flex items-center gap-2 text-afreqa-gold font-mono text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              <span>03. The Unified Tribe</span>
            </div>
            <h3 className="font-display font-bold text-xl text-afreqa-chrome-high">Radical Dancefloor Freedom</h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed">
              The dancefloor is sacred ground. Judgment, harassment, and elitism are checked at the turnstiles. Everyone dances as equals.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-6 border border-afreqa-chrome-high/10 space-y-2">
            <div className="flex items-center gap-2 text-afreqa-teal font-mono text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>04. Uncompromised Safety</span>
            </div>
            <h3 className="font-display font-bold text-xl text-afreqa-chrome-high">Vigilant Care</h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed">
              Professional venue security, respectful entry screening, free hydration points, and rapid on-site medical care to look after every dancer.
            </p>
          </div>
        </div>
      </div>

      {/* 4. CTA */}
      <div className="rounded-3xl glass-panel p-8 text-center space-y-4 border border-afreqa-teal/30 shadow-glow-teal">
        <h3 className="font-display font-extrabold text-2xl text-afreqa-chrome-high">
          Ready to experience the frequency?
        </h3>
        <p className="text-sm text-afreqa-silver max-w-md mx-auto">
          Reserve your place at our next flagship edition through our verified ticketing portal.
        </p>
        <div className="pt-2">
          <Link
            href="/go/tickets/resonance"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-afreqa-teal to-afreqa-violet text-afreqa-shadow font-extrabold text-sm uppercase tracking-wider shadow-glow-teal hover:scale-105 transition-all"
          >
            <span>Get Official Tickets via HustleSasa</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

