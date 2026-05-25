"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Moon, Sparkles, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ElyraStory } from "@/lib/elyra-data";

type Theme = "dark" | "light";

export default function StoryPage() {
  const params = useParams<{ id: string }>();
  const [story, setStory] = useState<ElyraStory | null>(null);
  const [similar, setSimilar] = useState<ElyraStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>("dark");

  // Aplica o tema persistido imediatamente ao montar
  useEffect(() => {
    const saved = window.localStorage.getItem("elyra-theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved: Theme = saved ?? (prefersDark ? "dark" : "light");
    setTheme(resolved);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }, []);

  // Propaga mudanças de tema
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("elyra-theme", theme);
  }, [theme]);

  // Carrega a notícia
  useEffect(() => {
    if (!params?.id) return;
    const decodedId = decodeURIComponent(params.id);

    async function load() {
      try {
        const res = await fetch(`/api/live-news?limit=30`, { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const payload = (await res.json()) as { stories?: ElyraStory[] };
        const stories = payload.stories ?? [];

        const found = stories.find((s) => s.id === decodedId);
        if (!found) {
          window.location.href = "/";
          return;
        }
        setStory(found);

        // Calcula similares por score
        const scored = stories
          .filter((s) => s.id !== decodedId)
          .map((s) => {
            let score = 0;
            if (s.category === found.category) score += 3;
            if (s.source === found.source) score += 1;
            const targetWords = new Set(
              found.title.toLowerCase().split(/\W+/).filter((w) => w.length > 3),
            );
            for (const w of s.title.toLowerCase().split(/\W+/)) {
              if (targetWords.has(w)) score += 0.4;
            }
            return { s, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 4)
          .map((x) => x.s);

        setSimilar(scored);
      } catch {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params?.id]);

  if (loading) {
    return (
      <main className="relative flex-1 overflow-hidden px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center py-32">
          <div className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
            Carregando notícia...
          </div>
        </div>
      </main>
    );
  }

  if (!story) return null;

  // Divide o summary em parágrafos quebrados nas frases
  const sentences = story.summary.split(/(?<=[.!?])\s+/).filter(Boolean);
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(" "));
  }
  if (paragraphs.length === 0) paragraphs.push(story.summary);

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-8 lg:px-8">
      {/* Barra de navegação */}
      <div className="mx-auto mb-8 flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-[color:var(--foreground)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para feed
        </Link>

        <button
          type="button"
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-[color:var(--foreground)] backdrop-blur transition hover:-translate-y-0.5"
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_320px]">
        {/* Artigo principal */}
        <article className="rounded-[34px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_30px_120px_rgba(2,6,23,0.12)] backdrop-blur-2xl sm:p-8 lg:p-10">
          {/* Tags de topo */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {story.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--accent)]">
              <Sparkles className="h-3 w-3" />
              {story.tag}
            </span>
          </div>

          {/* Header da notícia */}
          <header className="space-y-4 border-b border-[color:var(--border)] pb-8">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)] sm:text-4xl lg:text-5xl">
              {story.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
              <span className="font-medium text-[color:var(--foreground)]">{story.source}</span>
              <span className="h-1 w-1 rounded-full bg-[color:var(--muted)]/60" />
              <span>{story.time}</span>
              <span className="h-1 w-1 rounded-full bg-[color:var(--muted)]/60" />
              <span>{story.readTime} de leitura</span>
            </div>
          </header>

          <div className="mt-8 space-y-8">
            {/* Imagem — apenas se existir, sem mensagem de fallback */}
            {story.imageUrl && (
              <img
                src={story.imageUrl}
                alt={story.title}
                className="h-auto max-h-[480px] w-full rounded-2xl border border-[color:var(--border)] object-cover shadow-[0_20px_60px_rgba(2,6,23,0.14)]"
              />
            )}

            {/* Resumo editorial em destaque */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                Resumo
              </p>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-base leading-[1.85] text-[color:var(--foreground)]/90"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Conteúdo completo se existir */}
            {story.content && story.content.length > 0 && story.content[0] !== story.summary && (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Análise completa
                </p>
                <div className="space-y-5">
                  {story.content.map((paragraph, index) => (
                    <p
                      key={`${story.id}-paragraph-${index}`}
                      className="border-l-2 border-[color:var(--border)] pl-5 text-[15px] leading-[1.9] text-[color:var(--foreground)]/80 sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fonte original */}
          <footer className="mt-10 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Fonte original</p>
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)] transition hover:text-[color:var(--accent)]"
            >
              Ler direto em {story.source}
              <ExternalLink className="h-4 w-4" />
            </a>
          </footer>
        </article>

        {/* Sidebar — notícias relacionadas */}
        <aside className="h-fit rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 backdrop-blur-2xl lg:sticky lg:top-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Notícias relacionadas</p>
          <div className="mt-4 space-y-3">
            {similar.length === 0 && (
              <p className="text-sm text-[color:var(--muted)]">Nenhuma notícia similar encontrada.</p>
            )}
            {similar.map((item) => (
              <Link
                key={item.id}
                href={`/news/${encodeURIComponent(item.id)}`}
                className="block rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"
              >
                <p className="text-xs text-[color:var(--muted)]">{item.source}</p>
                <p className="mt-1 text-sm font-medium leading-6 text-[color:var(--foreground)]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">{item.time}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
