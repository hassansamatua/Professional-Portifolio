"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        isDark
          ? "px-3 py-1 text-xs rounded-full border border-slate-700/60 text-slate-200 hover:bg-slate-800/70 transition"
          : "px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      }
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
