"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * CountUp — animates a number from 0 to its target value when scrolled into view.
 * - Splits a value like "100+" into number + suffix and only animates the digits.
 * - Falls back to the static value if the user prefers reduced motion.
 * - Uses IntersectionObserver via Motion's `useInView` so the animation only
 *   fires once when the element first becomes visible.
 *
 * Usage:
 *   <CountUp value="100+" />
 *   <CountUp value="50+" duration={2} />
 *   <CountUp value="3" />            // no suffix → just "3"
 *   <CountUp value="2-3k€/mois" />   // non-leading-digit pattern → static render
 */
export function CountUp({
  value,
  duration = 1.6,
}: {
  value: string;
  duration?: number;
}) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return <>{value}</>;
  return (
    <AnimatedNumber value={Number(match[1])} suffix={match[2]} duration={duration} />
  );
}

function AnimatedNumber({
  value,
  suffix,
  duration,
}: {
  value: number;
  suffix: string;
  duration: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {n}
      {suffix}
    </span>
  );
}
