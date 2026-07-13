"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { signInWithGoogle, logOut } from "@/lib/firebase";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  ChevronDown,
  BookOpen,
  PlusCircle,
  Zap,
} from "lucide-react";

export default function Navbar() {
  const { user, loading } = useAuth();
  const { reset } = useRoadmapStore();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCreateRoadmap = () => {
    reset();
    if (!user) {
      signInWithGoogle();
    } else {
      router.push("/create");
    }
  };

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    await logOut();
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-xl font-bold ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Job2Roadmap
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Pricing
            </a>

            {!loading && (
              <>
                {user ? (
                  /* 🎯 PROFILE DROPDOWN */
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setProfileDropdownOpen(!profileDropdownOpen)
                      }
                      className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/10 transition-all group"
                    >
                      {/* Avatar */}
                      {user?.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full ring-2 ring-white/50 group-hover:ring-white"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/50">
                          {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      {/* Name & Email */}
                      <div className="hidden lg:block text-left">
                        <p
                          className={`text-sm font-semibold leading-tight ${
                            isScrolled ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {user?.displayName?.split(" ")[0] || "User"}
                        </p>
                        <p
                          className={`text-xs ${
                            isScrolled ? "text-gray-500" : "text-white/70"
                          }`}
                        >
                          {user?.email?.split("@")[0]}...
                        </p>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isScrolled ? "text-gray-500" : "text-white/70"
                        } ${profileDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* 🎯 DROPDOWN MENU */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900 text-sm">
                            {user?.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>

                          <Link
                            href="/create"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Create Roadmap
                          </Link>

                          <Link
                            href="/dashboard/roadmaps"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          >
                            <BookOpen className="w-4 h-4" />
                            My Roadmaps
                          </Link>

                          <Link
                            href="/dashboard/settings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Sign In Button */
                  <button
                    onClick={signInWithGoogle}
                    className="flex items-center gap-2 bg-white text-gray-800 px-5 py-2.5 rounded-lg text-sm font-medium hover:shadow-lg transition-all border border-gray-200 hover:border-gray-300"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X
                className={`w-6 h-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col gap-2">
              <a
                href="#features"
                className="text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50"
              >
                Pricing
              </a>

              <div className="h-px bg-gray-200 my-1" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    {user?.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt=""
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="text-gray-700 py-2 px-2 rounded-lg hover:bg-purple-50 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link
                    href="/create"
                    className="text-gray-700 py-2 px-2 rounded-lg hover:bg-purple-50 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Create Roadmap
                  </Link>
                  <Link
                    href="/dashboard/roadmaps"
                    className="text-gray-700 py-2 px-2 rounded-lg hover:bg-purple-50 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> My Roadmaps
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="text-gray-700 py-2 px-2 rounded-lg hover:bg-purple-50 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-red-600 py-2 px-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="bg-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Sign In with Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
