import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Sparkles,
  Film,
  Images,
  History,
  Info,
  ExternalLink,
} from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "VideoForge AI — Open Source Text-to-Video up to 8 minutes",
  description:
    "Generate high-quality AI videos up to 8 minutes long with state-of-the-art open-source models including CogVideoX, Stable Video Diffusion, and Open-Sora.",
};

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07070c]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-blue-500 shadow-lg shadow-purple-500/30">
            <Film className="h-5 w-5 text-white" strokeWidth={2.4} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight text-white">
              VideoForge
              <span className="ml-1 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI
              </span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-white/40">
              Open Source
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "/", label: "Generate", icon: Sparkles },
            { href: "/gallery", label: "Gallery", icon: Images },
            { href: "/history", label: "History", icon: History },
            { href: "/about", label: "Models", icon: Info },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M12 .5C5.73.5.77 5.46.77 11.74c0 4.96 3.22 9.17 7.69 10.66.56.1.77-.24.77-.54 0-.27-.01-1.15-.02-2.09-3.13.68-3.79-1.33-3.79-1.33-.51-1.29-1.25-1.63-1.25-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.28.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.45.11-3.02 0 0 .95-.3 3.11 1.16.9-.25 1.87-.38 2.83-.38.96 0 1.93.13 2.83.38 2.16-1.46 3.11-1.16 3.11-1.16.62 1.57.23 2.73.11 3.02.72.79 1.16 1.8 1.16 3.03 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54 4.47-1.49 7.68-5.7 7.68-10.66C23.23 5.46 18.27.5 12 .5z" />
            </svg>
            <span className="hidden sm:inline">Star on GitHub</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Film className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">VideoForge AI</p>
              <p className="text-xs text-white/50">
                Open-source text-to-video generation
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-xs text-white/50">
            <p>
              Powered by CogVideoX · SVD 3 · Open-Sora · AnimateDiff · ModelScope
            </p>
          </div>
          <p className="text-xs text-white/40">
            Licensed under Apache 2.0
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07070c] text-slate-100 antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute left-0 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-500/5 blur-[120px]" />
          <div className="absolute inset-0 bg-grid opacity-[0.5]" />
        </div>
        <Nav />
        <main className="mx-auto w-full max-w-7xl px-6 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
