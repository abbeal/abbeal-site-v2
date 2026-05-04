"use client";

import { useEffect, useState } from "react";

const COOKIE = "theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type Theme = "light" | "dark";

function readCookieTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)theme=(dark|light)/);
  return (match?.[1] as Theme | undefined) ?? null;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.cookie = `${COOKIE}=${theme}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`;
}

/**
 * ThemeToggle — header-mounted button to flip between light and dark.
 *
 * The actual class application happens BEFORE this component mounts, via
 * an inline anti-flash script in the root layout (avoids the white flash
 * on dark-mode page loads). This component just reflects the current state
 * once mounted and lets the user flip it.
 *
 * Hidden until mount to prevent SSR/CSR mismatch warnings (the server
 * doesn't know which mode is active for this user).
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const cookieTheme = readCookieTheme();
    const initial: Theme = cookieTheme ?? (
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
    setTheme(initial);
    setMounted(true);
  }, []);

  function flip() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  if (!mounted) {
    // Render a sized placeholder so layout doesn't shift on hydration.
    return (
      <span
        aria-hidden
        className="inline-block h-8 w-8"
      />
    );
  }

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex h-8 w-8 items-center justify-center rounded text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg-cream)] transition-colors"
    >
      {isDark ? (
        // Sun icon (currently dark, click to go light)
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon icon (currently light, click to go dark)
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
