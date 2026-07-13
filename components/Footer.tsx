import { Compass, Mail } from "lucide-react";

const productLinks = ["Features", "How it works", "Pricing", "Roadmaps"];
const companyLinks = ["About", "Blog", "Careers", "Contact"];

export default function Footer() {
  return (
    <footer className="border-t border-[#1C2436] bg-[#0A0E1A]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2FE6A8]">
                <Compass className="h-5 w-5 text-[#08211A]" strokeWidth={2} />
              </div>
              <span className="font-display text-lg font-semibold text-[#EDF0E6]">
                Job2Roadmap
              </span>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-[#94A0B8]">
              Turn any job description into a route you can actually walk. Built
              to get you from here to hired.
            </p>
            <a
              href="mailto:hello@job2roadmap.com"
              className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#232B40] text-[#94A0B8] transition-colors hover:border-[#2FE6A8] hover:text-[#2FE6A8]"
              aria-label="Email Job2Roadmap"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-[#5C6884]">
              Product
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-[#94A0B8] transition-colors hover:text-[#EDF0E6]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-[#5C6884]">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-[#94A0B8] transition-colors hover:text-[#EDF0E6]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#1C2436] pt-8 font-mono text-xs text-[#5C6884] md:flex-row">
          <span>&copy; 2026 Job2Roadmap. All rights reserved.</span>
          <span className="uppercase tracking-[0.15em]">end of trail</span>
        </div>
      </div>
    </footer>
  );
}
