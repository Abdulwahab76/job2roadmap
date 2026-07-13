"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * ScrollTrail
 * The signature element of the redesign. A single dashed route runs down
 * the spine of the page, like a route drawn on a topo map. As the visitor
 * scrolls, the route "hikes itself in" and a waypoint marker travels along
 * it — mirroring the product's own idea of a job post becoming a walked path.
 *
 * Render once, absolutely positioned behind the page content, inside a
 * relatively-positioned wrapper that spans the sections you want traced.
 */
export default function ScrollTrail() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3,
  });
  const topPosition = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <div className="sticky top-0 h-screen w-full">
        <svg
          className="absolute left-1/2 top-0 h-screen w-[3px] -translate-x-1/2"
          viewBox="0 0 3 100"
          preserveAspectRatio="none"
        >
          <line
            x1="1.5"
            y1="0"
            x2="1.5"
            y2="100"
            stroke="#2E3548"
            strokeWidth="3"
            strokeDasharray="1 3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <motion.div
          className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ top: topPosition }}
        >
          <span className="absolute inset-0 rounded-full bg-[#2FE6A8] shadow-[0_0_0_4px_rgba(47,230,168,0.18)]" />
          <span className="absolute -inset-2 animate-ping rounded-full bg-[#2FE6A8]/40" />
        </motion.div>
      </div>
    </div>
  );
}
