import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Job2Roadmap - Turn Jobs into Learning Paths",
  description:
    "AI-powered tool that converts job descriptions into personalized learning roadmaps",
};
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
