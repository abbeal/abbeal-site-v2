"use client";

import { motion } from "motion/react";
import type { ArticleBlock } from "@/lib/articles";

const ease = [0.16, 1, 0.3, 1] as const;

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose-article space-y-6">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} index={i} />
      ))}
    </div>
  );
}

function BlockRenderer({ block, index }: { block: ArticleBlock; index: number }) {
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 0.45, delay: Math.min(index * 0.02, 0.2), ease },
  };

  switch (block.type) {
    case "h2":
      return (
        <motion.h2
          {...fadeIn}
          className="mt-14 mb-2 text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-tight scroll-mt-24"
        >
          {block.content}
        </motion.h2>
      );

    case "h3":
      return (
        <motion.h3
          {...fadeIn}
          className="mt-8 mb-1 text-xl font-semibold tracking-tight text-[var(--color-ink)] leading-snug"
        >
          {block.content}
        </motion.h3>
      );

    case "p":
      return (
        <motion.p
          {...fadeIn}
          className="text-[17px] leading-[1.65] text-[var(--color-ink)]"
        >
          {block.content}
        </motion.p>
      );

    case "list":
      return block.ordered ? (
        <motion.ol {...fadeIn} className="list-decimal pl-6 space-y-2 text-[17px] leading-[1.65] text-[var(--color-ink)] marker:text-[var(--color-brand-teal)] marker:font-mono">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </motion.ol>
      ) : (
        <motion.ul {...fadeIn} className="space-y-2.5 text-[17px] leading-[1.65] text-[var(--color-ink)]">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-teal)] shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>
      );

    case "quote":
      return (
        <motion.figure {...fadeIn} className="my-10 border-l-2 border-[var(--color-brand-teal)] pl-6 py-1">
          <blockquote className="text-xl md:text-2xl italic font-medium text-[var(--color-ink)] leading-snug tracking-tight">
            « {block.content} »
          </blockquote>
          {block.author && (
            <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">
              — {block.author}
            </figcaption>
          )}
        </motion.figure>
      );

    case "callout": {
      const tone = block.tone ?? "default";
      const tones: Record<string, string> = {
        default:
          "bg-[var(--color-bg-cream)] border border-[var(--color-border)] text-[var(--color-ink)]",
        teal:
          "bg-[var(--color-brand-teal)]/10 border border-[var(--color-brand-teal)]/30 text-[var(--color-ink)]",
        ink:
          "bg-[var(--color-ink)] text-[var(--color-bg-light)]",
      };
      return (
        <motion.aside
          {...fadeIn}
          className={`my-8 px-6 py-5 ${tones[tone]} text-[15px] leading-relaxed`}
        >
          <p>{block.content}</p>
        </motion.aside>
      );
    }

    case "code":
      return (
        <motion.pre
          {...fadeIn}
          className="my-6 overflow-x-auto bg-[var(--color-ink)] text-[var(--color-bg-light)] p-5 font-mono text-[13px] leading-[1.6] border-l-2 border-[var(--color-brand-teal)]"
        >
          {block.lang && (
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
              {block.lang}
            </div>
          )}
          <code>{block.content}</code>
        </motion.pre>
      );

    default:
      return null;
  }
}
