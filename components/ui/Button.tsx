import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-light)] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:text-[var(--color-ink)] hover:-translate-y-[1px]",
  secondary:
    "bg-transparent text-[var(--color-ink)] border border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bg-light)]",
  ghost:
    "bg-transparent text-[var(--color-ink)] underline-offset-4 hover:underline hover:text-[var(--color-brand-teal)]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm rounded-md",
  lg: "h-12 px-6 text-base rounded-md",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...rest
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
