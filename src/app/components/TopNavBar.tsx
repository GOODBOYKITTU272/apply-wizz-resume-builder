"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ApplyWizzLogo } from "components/ApplyWizzLogo";
import { cx } from "lib/cx";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";

  return (
    <header
      aria-label="Site Header"
      className="flex h-[var(--top-nav-bar-height)] items-center border-b border-gray-100 px-3 lg:px-12 bg-white"
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="sr-only">Apply Wizz</span>
          <ApplyWizzLogo size="md" />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Link href="/resume-builder" className="hover:text-blue-600 transition-colors font-semibold">
            📄 Resume Builder
          </Link>
          <Link href="/resume-parser" className="hover:text-green-600 transition-colors font-semibold">
            🔍 ATS Scanner  
          </Link>
          <Link href="/resume-compare" className="hover:text-purple-600 transition-colors font-semibold">
            ⚔️ Compare Resumes
          </Link>
          <a
            href="https://apply-wizz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            🚀 Get Started Free
          </a>
        </nav>
      </div>
    </header>
  );
};