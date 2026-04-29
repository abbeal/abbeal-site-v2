import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentry example · Abbeal (internal)",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
