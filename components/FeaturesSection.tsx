"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Brain,
  BookOpen,
  Target,
  Zap,
  BarChart3,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    coordinate: "A1",
    title: "AI skill extraction",
    description:
      "The AI reads any job post and pulls out exactly what it's asking for, no keyword guessing.",
  },
  {
    icon: BookOpen,
    coordinate: "A2",
    title: "Curated resources",
    description:
      "Every waypoint comes stocked with hand-picked free courses, docs, and tutorials.",
  },
  {
    icon: Target,
    coordinate: "A3",
    title: "Personalized path",
    description:
      "Routes are cut to your target role and where you're starting from, not a generic track.",
  },
  {
    icon: Zap,
    coordinate: "A4",
    title: "Instant results",
    description:
      "A full route from here to hired, generated in seconds instead of hours of research.",
  },
  {
    icon: BarChart3,
    coordinate: "B1",
    title: "Progress tracking",
    description:
      "Watch your position move down the trail as you clear each skill on the map.",
  },
  {
    icon: Share2,
    coordinate: "B2",
    title: "Share and collaborate",
    description:
      "Send a route to a friend or study group and hike the same trail together.",
  },
  {
    icon: ShieldCheck,
    coordinate: "B3",
    title: "Industry verified",
    description:
      "Every path is checked against real, current job market requirements, not stale lists.",
  },
  {
    icon: Sparkles,
    coordinate: "B4",
    title: "Always updated",
    description:
      "The map redraws itself as tools and tech stacks shift, so your route stays current.",
  },
];

export default function FeaturesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="features" className="relative bg-[#EDF0E6] py-28">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#5F7A6C]">
            Waypoint legend
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-[#12141C] md:text-5xl">
            Everything on the map to land the job
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#4A5160]">
            From reading the job post to tracking the last skill you clear,
            here's what's marked on every route.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.coordinate}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
              className="group relative rounded-xl border border-[#D7DACB] bg-[#F7F8F2] p-7 transition-colors hover:border-[#2FE6A8]"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#12141C] transition-colors group-hover:bg-[#2FE6A8]">
                  <feature.icon
                    className="h-5 w-5 text-[#2FE6A8] transition-colors group-hover:text-[#0A2A20]"
                    strokeWidth={1.75}
                  />
                </div>
                <span className="font-mono text-[11px] tracking-widest text-[#9AA192]">
                  {feature.coordinate}
                </span>
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-[#12141C]">
                {feature.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[#5B6152]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
