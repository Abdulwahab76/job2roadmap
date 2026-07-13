"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ClipboardList, Cpu, Map, Target } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    mark: "01",
    title: "Paste the job description",
    description:
      "Copy any posting from LinkedIn, Indeed, or a company careers page.",
  },
  {
    icon: Cpu,
    mark: "02",
    title: "The AI reads the terrain",
    description:
      "It extracts the required technologies and the level expected for each.",
  },
  {
    icon: Map,
    mark: "03",
    title: "Your route gets drawn",
    description:
      "A structured path arrives, broken into phases with resources at each stop.",
  },
  {
    icon: Target,
    mark: "04",
    title: "Walk it, and arrive",
    description:
      "Follow the trail, check off waypoints, and land the role at the end of it.",
  },
];

export default function HowItWorks() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="how-it-works" className="relative bg-[#0A0E1A] py-28">
      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-xl text-center"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8FF5CE]">
            The route, in four legs
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-[#EDF0E6] md:text-5xl">
            How the trail gets cut
          </h2>
        </motion.div>

        <div className="relative">
          {/* Center trail line, mobile+desktop */}
          <div className="absolute left-6 top-0 h-full w-px bg-[#232B40] md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-14">
            {steps.map((step, index) => {
              const isRight = index % 2 === 1;
              return (
                <motion.div
                  key={step.mark}
                  initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: index * 0.15 }}
                  className={`relative flex items-start gap-6 md:w-1/2 ${
                    isRight
                      ? "md:ml-auto md:flex-row md:pl-14 md:text-left"
                      : "md:mr-auto md:flex-row-reverse md:pr-14 md:text-right"
                  }`}
                >
                  {/* Waypoint marker on the trail */}
                  <div
                    className={`absolute -left-0.5 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0A0E1A] bg-[#2FE6A8] md:left-1/2 md:-translate-x-1/2 ${
                      isRight ? "md:-translate-x-1/2" : ""
                    }`}
                  >
                    <span className="absolute -inset-2 rounded-full bg-[#2FE6A8]/15" />
                  </div>

                  <div className="ml-12 flex h-12 w-12 flex-none items-center justify-center rounded-lg border border-[#232B40] bg-[#111826] md:ml-0">
                    <step.icon
                      className="h-5 w-5 text-[#FFB648]"
                      strokeWidth={1.75}
                    />
                  </div>

                  <div className="ml-12 md:ml-0">
                    <span className="font-mono text-[11px] tracking-widest text-[#5C6884]">
                      waypoint {step.mark}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-semibold text-[#EDF0E6]">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[#94A0B8]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summit marker at the end of the trail */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: steps.length * 0.15 + 0.1 }}
            className="absolute -bottom-4 left-6 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#FFB648] md:left-1/2"
          >
            <Target className="h-4 w-4 text-[#412402]" strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
