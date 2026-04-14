/**
 * RADAR — useNews hook
 * Načítá articles z /data/news.json (generuje news agent)
 */

import { useState, useEffect } from "react";

export type NewsCategory =
  | "stocks"
  | "crypto"
  | "forex"
  | "real_estate"
  | "cars"
  | "markets";

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  source_name: string;
  category: NewsCategory;
  summary: string;
  relevance_score: number;
}

interface NewsData {
  generated_at: string;
  total: number;
  articles: NewsArticle[];
}

interface UseNewsReturn {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  generatedAt: string | null;
  /** Filtruj podle kategorie, undefined = všechny */
  byCategory: (cat?: NewsCategory) => NewsArticle[];
}

export function useNews(): UseNewsReturn {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/news.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: NewsData) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const byCategory = (cat?: NewsCategory) => {
    if (!data) return [];
    if (!cat) return data.articles;
    return data.articles.filter((a) => a.category === cat);
  };

  return {
    articles: data?.articles ?? [],
    loading,
    error,
    generatedAt: data?.generated_at ?? null,
    byCategory,
  };
}
