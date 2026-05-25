"use client";

import { motion } from "framer-motion";
import { ArrowRight, Moon, Search, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryChip } from "@/components/category-chip";
import { NewsCard } from "@/components/news-card";
import type { ElyraStory } from "@/lib/elyra-data";

type Locale = "pt" | "en";
type Theme = "dark" | "light";

const fallbackStories: ElyraStory[] = [];

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [locale, setLocale] = useState<Locale>("pt");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stories, setStories] = useState<ElyraStory[]>(fallbackStories);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("--:--");
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("elyra-theme") as Theme | null;
    const savedLocale = window.localStorage.getItem("elyra-locale") as Locale | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(savedTheme ?? (prefersDark ? "dark" : "light"));
    setLocale(savedLocale ?? "pt");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("elyra-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("elyra-locale", locale);
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLiveNews() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/live-news?limit=12", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as { stories?: ElyraStory[] };
        const list = payload.stories ?? [];
        setStories(list);
        setLastUpdated(
          new Date().toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
        setLoadError(null);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setLoadError(locale === "pt" ? "Falha ao carregar noticias reais." : "Failed to load real news.");
          setStories([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchLiveNews();
    return () => controller.abort();
  }, [locale]);

  useEffect(() => {
    setVisibleCount(4);
  }, [selectedCategory, searchQuery, stories.length]);

  const isPt = locale === "pt";

  const copy = {
    navTrending: "Trending",
    navFeed: "Feed",
    all: isPt ? "Todos" : "All",
    searchPlaceholder: isPt ? "Buscar" : "Search",
    subscribe: isPt ? "Assinar" : "Subscribe",
    openFeed: isPt ? "Abrir feed ao vivo" : "Open live feed",
    heroTitle: isPt ? "Noticias reais de tecnologia, em tempo real." : "Real technology news, in real time.",
    heroDesc: isPt
      ? "Entenda o amanha antes de todo mundo."
      : "Understand tomorrow before everyone else.",
    loading: isPt ? "Carregando noticias reais..." : "Loading real news...",
    noStories: isPt ? "Nenhuma noticia encontrada para este filtro." : "No stories found for this filter.",
    liveNow: isPt ? "ao vivo" : "live",
    bySources: isPt ? "fontes monitoradas" : "sources monitored",
    matchedStories: isPt ? "noticias encontradas" : "stories found",
    featuredNow: isPt ? "Destaques do momento" : "Current highlights",
  };

  const categories = useMemo(() => {
    const set = new Set(stories.map((story) => story.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [stories]);

  const filteredStories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return stories.filter((story) => {
      const categoryMatch = selectedCategory === "all" || story.category === selectedCategory;
      const queryMatch =
        query.length === 0 ||
        story.title.toLowerCase().includes(query) ||
        story.summary.toLowerCase().includes(query) ||
        story.source.toLowerCase().includes(query) ||
        story.tag.toLowerCase().includes(query);

      return categoryMatch && queryMatch;
    });
  }, [stories, selectedCategory, searchQuery]);

  const highlightedStories = filteredStories.slice(0, 3);
  const visibleStories = filteredStories.slice(0, visibleCount);
  const canLoadMore = filteredStories.length > visibleCount;

  const categoryLabel = (category: string) => (category === "all" ? copy.all : category);

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-6 pb-20 lg:px-8">
        <header className="sticky top-4 z-20 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <img src="/screen.png" alt="ELYRA" className="elyra-logo-dark h-10 w-[220px] -translate-y-2 object-cover object-top drop-shadow-[0_0_8px_rgba(129,140,248,0.42)]" />
              <img src="/ELYRADARK.png" alt="ELYRA" className="elyra-logo-light h-10 w-[220px] -translate-y-2 object-cover object-top" />
            </div>

            {/* Nav links */}
            <div className="flex items-center gap-4 text-sm text-[color:var(--muted)]">
              <a className="transition hover:text-[color:var(--foreground)]" href="#trending">
                {copy.navTrending}
              </a>
              <a className="transition hover:text-[color:var(--foreground)]" href="#feed">
                {copy.navFeed}
              </a>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right-side controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-white/50 px-3 py-2 text-xs text-[color:var(--foreground)] transition hover:-translate-y-0.5"
                onClick={() => setLocale((prev) => (prev === "pt" ? "en" : "pt"))}
                type="button"
              >
                {locale === "pt" ? "PT-BR" : "EN"}
              </button>

              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-white/50 px-3 py-2 text-xs text-[color:var(--foreground)] transition hover:-translate-y-0.5"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                type="button"
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>

              <label className="hidden items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/50 px-3 py-2 text-sm text-[color:var(--muted)] shadow-sm backdrop-blur md:flex">
                <Search className="h-4 w-4 text-[color:var(--foreground)]/70" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="w-40 bg-transparent text-[color:var(--foreground)] placeholder:text-[color:var(--muted)] focus:outline-none"
                />
              </label>

              <button
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 ${
                  theme === "dark" ? "bg-white text-slate-950" : "bg-slate-950 text-white"
                }`}
                type="button"
              >
                {copy.subscribe}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <label className="mt-3 inline-flex w-full items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/50 px-3 py-2 text-sm text-[color:var(--muted)] md:hidden">
            <Search className="h-4 w-4 text-[color:var(--foreground)]/70" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full bg-transparent text-[color:var(--foreground)] placeholder:text-[color:var(--muted)] focus:outline-none"
            />
          </label>
        </header>

        <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[0_30px_120px_rgba(2,6,23,0.12)] backdrop-blur-2xl sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_36%)]" />
          <div className="relative flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
                {copy.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">{copy.heroDesc}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[color:var(--border)] bg-white/45 p-4">
                <div className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{stories.length}</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">{copy.bySources}</div>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-white/45 p-4">
                <div className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{filteredStories.length}</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">{copy.matchedStories}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#feed"
                className="elyra-feed-cta inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5"
              >
                {copy.openFeed}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 pb-5 pt-5 backdrop-blur-2xl">
            <div className="mt-1 flex items-center gap-2 overflow-x-auto overflow-y-visible pb-3 pr-1">
              {categories.map((category) => (
                <CategoryChip
                  key={category}
                  label={categoryLabel(category)}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="trending" className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Trending</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">{copy.featuredNow}</h2>
          </div>
          {isLoading ? (
            <p className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--muted)]">
              {copy.loading}
            </p>
          ) : loadError ? (
            <p className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--muted)]">
              {loadError}
            </p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {highlightedStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
                >
                  <NewsCard story={story} featured={index === 0} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section id="feed" className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-2">
            {visibleStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              >
                <NewsCard story={story} featured={index === 0} />
              </motion.div>
            ))}
          </div>

          {canLoadMore ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev * 2)}
                className="elyra-feed-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5"
              >
                Ler mais
              </button>
            </div>
          ) : null}

          {!isLoading && filteredStories.length === 0 ? (
            <p className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--muted)] backdrop-blur-xl">
              {copy.noStories}
            </p>
          ) : null}
        </section>

        <footer className="border-t border-[color:var(--border)] pt-6 text-center text-sm text-[color:var(--muted)]">
          <span>Credito de Lucas Leuck </span>
          <a
            href="https://www.linkedin.com/in/lucasleuck/"
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--foreground)] transition hover:text-[color:var(--accent)]"
          >
            LinkedIn
          </a>
        </footer>
      </div>
    </main>
  );
}
