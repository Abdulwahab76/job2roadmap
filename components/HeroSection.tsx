"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowUpRight, Compass, MapPin } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { signInWithGoogle } from "@/lib/firebase";

type HeroSectionProps = {
  onGetStarted?: () => void;
};

const SKILL_NODES = [
  { label: "React", x: 18, y: 28, delay: 0 },
  { label: "TypeScript", x: 42, y: 14, delay: 0.15 },
  { label: "System Design", x: 68, y: 24, delay: 0.3 },
  { label: "SQL", x: 30, y: 52, delay: 0.45 },
  { label: "AWS", x: 58, y: 56, delay: 0.6 },
  { label: "Testing", x: 80, y: 46, delay: 0.75 },
];

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mapRotate = useTransform(scrollYProgress, [0, 1], [8, -6]);
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleGetStarted = () => {
    if (user && onGetStarted) {
      onGetStarted();
    } else if (!user) {
      signInWithGoogle();
    } else {
      onGetStarted?.();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0A0E1A] pt-28"
    >
      {/* Topographic contour field */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.35]"
          viewBox="0 0 1200 900"
          preserveAspectRatio="xMidYMid slice"
        >
          {[...Array(9)].map((_, i) => (
            <path
              key={i}
              d={`M -100 ${120 + i * 90} C 250 ${40 + i * 90}, 450 ${
                220 + i * 90
              }, 700 ${100 + i * 90} S 1150 ${180 + i * 90}, 1400 ${
                90 + i * 90
              }`}
              fill="none"
              stroke="#1C2436"
              strokeWidth="1.5"
            />
          ))}
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A] via-transparent to-[#0A0E1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(47,230,168,0.08),transparent_55%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2E3548] bg-white/5 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8FF5CE]"
          >
            <Compass className="h-3.5 w-3.5" strokeWidth={1.75} />N 24&deg;
            06&apos; &middot; job to roadmap
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-[clamp(2.75rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-tight text-[#EDF0E6]"
          >
            Any job post,
            <br />
            plotted into a
            <br />
            <span className="text-[#2FE6A8]">route you can walk.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-7 h-8 font-mono text-base text-[#94A0B8] md:text-lg"
          >
            <TypeAnimation
              sequence={[
                "Paste a job description...",
                2000,
                "Get an instant skills breakdown...",
                2000,
                "Follow a waypoint-by-waypoint path...",
                2000,
                "Arrive at your next role.",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#2FE6A8] px-7 py-3.5 text-[15px] font-semibold text-[#08211A] transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              {user ? "Create your roadmap" : "Plot my roadmap"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2E3548] px-7 py-3.5 text-[15px] font-semibold text-[#EDF0E6] transition-colors hover:border-[#4A5470] hover:bg-white/5"
            >
              See the four waypoints
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-[#1C2436] pt-6"
          >
            {[
              ["< 3 sec", "generation"],
              ["10,000+", "hikers"],
              ["500+", "skills mapped"],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-display text-xl font-semibold text-[#EDF0E6]">
                  {value}
                </div>
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-[#5C6884]">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D-tilted "map" panel with skill nodes lighting up */}
        <motion.div
          style={{ rotateX: mapRotate, y: mapY, opacity: fade }}
          className="relative hidden aspect-[4/5] [perspective:1200px] lg:block"
        >
          <div className="relative h-full w-full rounded-2xl border border-[#232B40] bg-[#0D1220] p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
            <div className="mb-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-wide text-[#5C6884]">
              <span>senior_frontend_engineer.json</span>
              <span className="text-[#2FE6A8]">parsed</span>
            </div>

            <div className="relative h-[calc(100%-2.5rem)] w-full overflow-hidden rounded-lg border border-[#1C2436] bg-[radial-gradient(circle_at_20%_20%,rgba(47,230,168,0.06),transparent_50%)]">
              <svg className="absolute inset-0 h-full w-full">
                {SKILL_NODES.slice(1).map((node, i) => {
                  const prev = SKILL_NODES[i];
                  return (
                    <motion.line
                      key={node.label}
                      x1={`${prev.x}%`}
                      y1={`${prev.y}%`}
                      x2={`${node.x}%`}
                      y2={`${node.y}%`}
                      stroke="#2FE6A8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ duration: 0.6, delay: 0.6 + node.delay }}
                    />
                  );
                })}
              </svg>

              {SKILL_NODES.map((node) => (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + node.delay }}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-[#2E3548] bg-[#141A2A] px-2.5 py-1"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <MapPin className="h-3 w-3 text-[#FFB648]" strokeWidth={2} />
                  <span className="font-mono text-[11px] text-[#EDF0E6]">
                    {node.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#5C6884]">
        scroll to begin the route
      </div>
    </section>
  );
}
