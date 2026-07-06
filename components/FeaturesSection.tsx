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
  Shield,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Skill Extraction",
    description:
      "Our AI instantly identifies required skills from any job description.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    description: "Get hand-picked free courses, tutorials, and documentation.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Personalized Path",
    description: "Roadmaps tailored to your target role and experience level.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your complete learning path in seconds, not hours.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Track your learning journey with visual progress indicators.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Share2,
    title: "Share & Collaborate",
    description: "Share roadmaps with peers and learn together.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Industry Verified",
    description: "Roadmaps based on real job market requirements.",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: Sparkles,
    title: "Always Updated",
    description: "Continuously updated with latest tech trends and tools.",
    color: "from-orange-500 to-red-500",
  },
];

export default function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Land the Job
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From skill extraction to progress tracking, we've got you covered
            every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
