import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ElyraStory } from "@/lib/elyra-data";

export function NewsCard({ story, featured = false }: { story: ElyraStory; featured?: boolean }) {
  const readHref = `/news/${encodeURIComponent(story.id)}`;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_30px_100px_rgba(2,6,23,0.12)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[color:var(--accent)] hover:bg-[color:var(--surface-strong)]",
        featured && "p-7 lg:p-8",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_45%)] opacity-0 transition duration-500 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_right,rgba(139,156,255,0.18),transparent_45%)]" />
      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
          <span>{story.source}</span>
          <span className="elyra-impact-chip rounded-full px-3 py-1 text-[color:var(--foreground)]">
            {story.impact}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-[color:var(--accent)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{story.tag}</span>
          </div>
          <h3
            className={cn(
              "font-semibold tracking-tight text-[color:var(--foreground)]",
              featured ? "text-2xl leading-tight" : "text-xl leading-tight",
            )}
          >
            <Link href={readHref} className="transition hover:text-[color:var(--accent)]">
              {story.title}
            </Link>
          </h3>
          <p className="text-sm leading-6 text-[color:var(--muted)]">{story.summary}</p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[color:var(--border)] pt-4 text-xs text-[color:var(--muted)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-1 text-[color:var(--foreground)]">
              <Clock3 className="h-3.5 w-3.5" />
              {story.time}
            </span>
            <span>{story.readTime}</span>
          </div>
          <Link
            href={readHref}
            className="inline-flex items-center gap-1.5 text-[color:var(--foreground)]/80 transition group-hover:text-[color:var(--foreground)]"
          >
            Ler mais
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}