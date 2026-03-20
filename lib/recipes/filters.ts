import type { SupabaseClient } from "@supabase/supabase-js";

export interface RecipeListFilters {
  category: string | null;
  tag: string | null;
  maxCookMins: number | null;
  /** Trimmed title search from `?q=` (may be empty after sanitization for ILIKE). */
  q: string | null;
}

/** Strip ILIKE wildcards so user input cannot broaden the pattern. */
export function sanitizeTitleSearchForIlike(raw: string): string {
  return raw.replace(/[%_\\]/g, "");
}

/** Non-null when `q` should filter rows (after trim + sanitize). */
export function effectiveTitleSearch(filters: RecipeListFilters): string | null {
  const trimmed = filters.q?.trim() ?? "";
  if (!trimmed) return null;
  const safe = sanitizeTitleSearchForIlike(trimmed);
  return safe.length > 0 ? safe : null;
}

export function parseRecipeListSearchParams(searchParams: {
  category?: string;
  tag?: string;
  maxCookMins?: string;
  q?: string;
}): RecipeListFilters {
  const category =
    typeof searchParams.category === "string" && searchParams.category.trim()
      ? searchParams.category.trim()
      : null;
  const tag =
    typeof searchParams.tag === "string" && searchParams.tag.trim()
      ? searchParams.tag.trim()
      : null;
  const maxRaw = searchParams.maxCookMins?.trim() ?? "";
  const maxParsed = maxRaw ? Number.parseInt(maxRaw, 10) : NaN;
  const maxCookMins =
    !Number.isNaN(maxParsed) && maxParsed > 0 ? maxParsed : null;
  const q =
    typeof searchParams.q === "string" && searchParams.q.trim()
      ? searchParams.q.trim()
      : null;

  return { category, tag, maxCookMins, q };
}

/**
 * Build a filtered recipes query. Requires `tags text[]` on `recipes` when filtering by tag.
 */
export function recipesFilteredQuery(
  supabase: SupabaseClient,
  filters: RecipeListFilters
) {
  let query = supabase.from("recipes").select("*");

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.tag) {
    query = query.contains("tags", [filters.tag]);
  }
  if (filters.maxCookMins !== null) {
    query = query.lte("cooking_time", filters.maxCookMins);
  }

  const titleQ = effectiveTitleSearch(filters);
  if (titleQ) {
    query = query.ilike("title", `%${titleQ}%`);
  }

  return query.order("created_at", { ascending: false });
}

/** Build `/recipes` URL with optional query params (omit a key to leave it out). */
export function recipesBrowseUrl(filters: {
  category?: string | null;
  tag?: string | null;
  maxCookMins?: number | null;
  q?: string | null;
}): string {
  const p = new URLSearchParams();
  if (filters.category) p.set("category", filters.category);
  if (filters.tag) p.set("tag", filters.tag);
  if (filters.maxCookMins != null && filters.maxCookMins > 0) {
    p.set("maxCookMins", String(filters.maxCookMins));
  }
  if (filters.q && filters.q.trim()) {
    p.set("q", filters.q.trim());
  }
  const qs = p.toString();
  return qs ? `/recipes?${qs}` : "/recipes";
}
