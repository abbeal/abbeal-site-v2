"use client";

import { motion } from "motion/react";
import Image from "next/image";

type MomentsDict = {
  moments: {
    tape: string;
    title: string;
    subtitle: string;
    items: {
      slug: string;
      caption: string;
      sub: string;
      size: "xl" | "l" | "m" | "s";
    }[];
  };
};

/* Bento grid sizing per item size — desktop only, mobile stacks 1-col */
const sizeClass: Record<string, string> = {
  xl: "md:col-span-2 md:row-span-2",
  l: "md:col-span-2 md:row-span-1",
  m: "md:col-span-2 md:row-span-2",
  s: "md:col-span-1 md:row-span-2",
};

export function Moments({ dict }: { dict: Record<string, unknown> }) {
  const d = (dict as unknown as MomentsDict).moments;

  return (
    <section
      id="moments"
      className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32"
    >
      <div className="max-w-3xl">
        <span className="tape-label">{d.tape}</span>
        <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
          {d.title}
        </h2>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {d.subtitle}
        </p>
      </div>

      <div
        className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        style={{ gridAutoRows: "200px" }}
      >
        {d.items.map((item, i) => (
          <motion.figure
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.6,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            className={`group relative overflow-hidden bg-[var(--color-ink)] min-h-[200px] ${sizeClass[item.size] ?? ""}`}
          >
            <Image
              src={`/moments/${item.slug}.jpg`}
              alt={item.caption}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover grayscale-[20%] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
            />
            {/* Bottom gradient overlay for caption legibility */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />
            {/* Persistent caption */}
            <figcaption className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 pointer-events-none">
              <span className="self-start font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 bg-[var(--color-bg-light)]/95 text-[var(--color-ink)] backdrop-blur-sm">
                {item.caption}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-white/0 group-hover:text-white/90 transition-colors duration-300 pl-2 max-w-[90%]">
                {item.sub}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
