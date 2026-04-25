import Image from "next/image";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-surface-dark border-t border-white/[0.06] pt-[60px] pb-8">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="font-serif text-xl text-white mb-2.5">AdventFlow</div>
            <p className="text-[13px] leading-[1.7] text-white/40 max-w-[280px]">
              A platform built for Seventh-day Adventist congregations — helping members, leaders, and administrators stay connected, organized, and mission-focused.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/35">Platform</div>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Features", href: "#tools" },
                { label: "Who Is It For", href: "#who" },
                { label: "How It Works", href: "#how-it-works" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[13px] text-white/50 hover:text-white/85 transition-colors no-underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Church */}
          <div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/35">Church</div>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "About AdventFlow", href: "#" },
                { label: "Contact Us", href: "#" },
                { label: "Adventist.org", href: "https://adventist.org", external: true },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-[13px] text-white/50 hover:text-white/85 transition-colors no-underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/35">Legal</div>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Use", href: "#" },
                { label: "RA 10173 / DPA", href: "#" },
                { label: "License", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[13px] text-white/50 hover:text-white/85 transition-colors no-underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t border-white/[0.07] pt-6">
          <span className="text-[12px] text-white/30">
            © {new Date().getFullYear()} AdventFlow. Built for the Adventist Mission.
          </span>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-white/70 transition-colors no-underline"
            aria-label="GitHub"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
