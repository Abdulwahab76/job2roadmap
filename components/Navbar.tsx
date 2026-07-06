"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { signInWithGoogle, logOut } from "@/lib/firebase";
import { Menu, X, Sparkles, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log(user, "user===");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <Sparkles className="w-6 h-6 text-white" />
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
              href="#testimonials"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Testimonials
            </a>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/create"
                      className="bg-white text-black shadow-2xs px-5 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                    >
                      Dashboard
                    </Link>

                    <div className="flex items-center gap-3 text-white">
                      {user?.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="w-12 h-12 rounded-full"
                          width={50}
                          height={50}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                          <User className="w-5 h-5" />
                        </div>
                      )}

                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold  ">
                          {user?.displayName || "User"}
                        </span>

                        <span className="text-xs  ">
                          {user?.email}
                        </span>
                      </div>

                      <button
                        onClick={logOut}
                        className="flex items-center gap-2  "
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="flex items-center gap-2 bg-white text-gray-800 px-5 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all border border-gray-200"
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
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-gray-700 py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 py-2">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-700 py-2">
                Testimonials
              </a>
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-b">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-12 h-12 rounded-full"
                        width={50}
                        height={50}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
                        <User className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">{user.displayName}</p>

                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/create"
                    className="bg-purple-600 text-white py-2 rounded-lg text-center"
                  >
                    Dashboard
                  </Link>

                  <button onClick={logOut} className="text-red-600 py-2">
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="bg-purple-600 text-white py-2 rounded-lg"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
