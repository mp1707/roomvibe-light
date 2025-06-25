"use client";

import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";
import CreditsDisplay from "./CreditsDisplay";
import MobileMenu from "./MobileMenu";

const Header = () => {
  return (
    <header className="w-full bg-base-100/80 backdrop-blur-sm border-b border-base-300/50 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 lg:py-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Desktop Credits Display */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/inspiration"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content transition-all duration-200 rounded-lg hover:bg-base-200/50 group"
              >
                <svg
                  className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Inspiration
              </Link>
              <CreditsDisplay className="flex" />

              <AuthButton />

              {/* Desktop Settings */}
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-base-content/60 hover:text-base-content transition-all duration-200 rounded-lg hover:bg-base-200/50 group"
                aria-label="Zu den Einstellungen"
              >
                <svg
                  className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>

              <ThemeToggle />
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-3">
              {/* <AuthButton /> */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
