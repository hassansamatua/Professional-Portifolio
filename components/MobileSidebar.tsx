"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

interface MobileSidebarProps {
  user: any;
  onLogout: () => void;
}

export function MobileSidebar({ user, onLogout }: MobileSidebarProps) {
  const { isDark, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-700 relative z-50"
        aria-label="Toggle menu"
        style={{ backgroundColor: isDark ? '#0f172a' : '#cbd5e1' }}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] md:hidden"
          onClick={closeSidebar}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-[10000] ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            } ${
              isDark
                ? 'bg-emerald-950 border-r border-emerald-800'
                : 'bg-emerald-50 border-r border-emerald-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className={`p-6 border-b ${isDark ? 'border-emerald-800' : 'border-emerald-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
                    Hansco Dev
                  </h1>
                </div>
                <button
                  onClick={closeSidebar}
                  className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-emerald-800' : 'hover:bg-emerald-100'}`}
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className={isDark ? "text-xs text-slate-400 mt-2" : "text-xs text-slate-600 mt-2"}>
                Developer • Designer • Teacher
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="p-6">
              <div className="space-y-4">
                <Link
                  href="/about"
                  onClick={closeSidebar}
                  className={`block px-4 py-3 rounded-lg transition ${
                    isDark
                      ? 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                      : 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">About</span>
                  </div>
                </Link>

                <Link
                  href="/projects"
                  onClick={closeSidebar}
                  className={`block px-4 py-3 rounded-lg transition ${
                    isDark
                      ? 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                      : 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="font-medium">Projects</span>
                  </div>
                </Link>

                <Link
                  href="/testimonies"
                  onClick={closeSidebar}
                  className={`block px-4 py-3 rounded-lg transition ${
                    isDark
                      ? 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                      : 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">Testimonials</span>
                  </div>
                </Link>

                <Link
                  href="/contact"
                  onClick={closeSidebar}
                  className={`block px-4 py-3 rounded-lg transition ${
                    isDark
                      ? 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                      : 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Contact</span>
                  </div>
                </Link>
              </div>

              {/* Theme Toggle */}
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-emerald-800' : 'border-emerald-200/20'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setTheme(isDark ? "light" : "dark");
                    closeSidebar();
                  }}
                  className={`w-full px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-emerald-800/20 text-emerald-100 hover:bg-emerald-700/30 border border-emerald-600/50'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isDark ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    )}
                  </svg>
                  <span className="font-medium">
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>
              </div>

              {/* User Section */}
              <div className="mt-6 pt-6 border-t border-slate-200/20">
                {user ? (
                  <div className="space-y-3">
                    <div className={`px-4 py-3 rounded-lg ${
                      isDark ? 'bg-slate-800/50' : 'bg-gray-100'
                    }`}>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {user.email}
                      </p>
                      <p className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Admin User
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/admin"
                        onClick={closeSidebar}
                        className={`block px-4 py-3 rounded-lg text-center transition ${
                          isDark
                            ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-600/50'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">Admin Panel</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          onLogout();
                          closeSidebar();
                        }}
                        className={`w-full px-4 py-3 rounded-lg text-center transition ${
                          isDark
                            ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-600/50'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Logout</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={closeSidebar}
                      className={`block px-4 py-3 rounded-lg text-center transition ${
                        isDark
                          ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-600/50'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Login</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
