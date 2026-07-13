"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Play, Star, Zap, Users, Globe } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { signInWithGoogle } from "@/lib/firebase";
import Link from "next/link";

type HeroSectionProps = {
  onGetStarted?: () => void;
};

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const { user } = useAuth();

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/20"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white/90 text-sm">
              AI-Powered Learning Paths
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Turn Any Job Post
            <br />
            Into Your{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Learning Roadmap
            </span>
          </motion.h1>

          {/* Animated Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-8 h-12"
          >
            <TypeAnimation
              sequence={[
                "Paste a job description...",
                2000,
                "Get instant skills breakdown...",
                2000,
                "Follow your custom learning path...",
                2000,
                "Land your dream job! 🚀",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={handleGetStarted}
              className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all inline-flex items-center gap-2 transform hover:scale-105"
            >
              {user ? "Create Your Roadmap" : "Get Started Free"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#how-it-works"
              className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2 border border-white/20"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { icon: Zap, label: "Instant Generation", value: "< 3 sec" },
              { icon: Users, label: "Active Users", value: "10,000+" },
              { icon: Globe, label: "Skills Covered", value: "500+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-6 h-6 text-white/60 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
}
