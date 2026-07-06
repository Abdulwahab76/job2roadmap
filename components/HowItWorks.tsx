"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ClipboardList, Cpu, Map, Target } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Paste Job Description",
    description:
      "Copy any job posting from LinkedIn, Indeed, or company websites.",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: Cpu,
    title: "AI Analyzes Skills",
    description:
      "Our AI extracts required technologies and skill levels automatically.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Map,
    title: "Get Your Roadmap",
    description:
      "Receive a structured learning path with phases and resources.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Target,
    title: "Track & Achieve",
    description: "Follow the roadmap, track progress, and land your dream job!",
    color: "from-orange-500 to-red-500",
  },
];

export default function HowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Four simple steps to your personalized learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-purple-200 to-blue-200">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full"></div>
                </div>
              )}

              <div className="text-center">
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                >
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-bold text-gray-600">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
