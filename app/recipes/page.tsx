import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RecipeListCard } from "@/components/recipes/RecipeListCard";
import type { Recipe } from "@/types/db.types";
import {
  effectiveTitleSearch,
  parseRecipeListSearchParams,
  recipesBrowseUrl,
  recipesFilteredQuery,
  type RecipeListFilters,
} from "@/lib/recipes/filters";
import { getFavoriteRecipeIdSet } from "@/lib/favorites/get-favorite-ids";

interface RecipesBrowsePageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    maxCookMins?: string;
    q?: string;
  }>;
}

function filterSummary(filters: RecipeListFilters): string {
  const parts: string[] = [];
  const titleQ = effectiveTitleSearch(filters);
  if (titleQ && filters.q?.trim()) {
    parts.push(`title “${filters.q.trim()}”`);
  }
  if (filters.category) parts.push(filters.category);
  if (filters.tag) parts.push(`#${filters.tag}`);
  if (filters.maxCookMins !== null) {
    parts.push(`${filters.maxCookMins} min or less`);
  }
  return parts.join(" · ");
}

function hasActiveFilters(filters: RecipeListFilters): boolean {
  return (
    effectiveTitleSearch(filters) !== null ||
    filters.category !== null ||
    filters.tag !== null ||
    filters.maxCookMins !== null
  );
}

export async function generateMetadata({ searchParams }: RecipesBrowsePageProps) {
  const params = await searchParams;
  const filters = parseRecipeListSearchParams(params);
  if (!hasActiveFilters(filters)) {
    return {
      title: "Browse recipes | OpenRecipe",
      description: "Discover recipes shared by the OpenRecipe community.",
    };
  }
  return {
    title: `${filterSummary(filters)} | Recipes | OpenRecipe`,
    description: `OpenRecipe recipes filtered by ${filterSummary(filters)}.`,
  };
}

export default async function RecipesBrowsePage({
  searchParams,
}: RecipesBrowsePageProps) {
  const params = await searchParams;
  const filters = parseRecipeListSearchParams(params);
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const favoriteIds = user
    ? await getFavoriteRecipeIdSet(supabase, user.id)
    : new Set<string>();

  const { data: recipes, error } = await recipesFilteredQuery(
    supabase,
    filters
  );

  if (error) {
    console.error("Failed to load recipes", error);
  }

  const allRecipes = (recipes ?? []) as Recipe[];
  const active = hasActiveFilters(filters);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-white">
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              ← Back to home
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              {active ? "Filtered recipes" : "All recipes"}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {active ? (
                <>
                  Showing recipes for{" "}
                  <span className="font-medium text-zinc-800">
                    {filterSummary(filters)}
                  </span>
                  .{" "}
                  <Link
                    href="/recipes"
                    className="font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    Clear filters
                  </Link>
                </>
              ) : (
                "Explore every dish shared on OpenRecipe — no sign-in required."
              )}
            </p>
          </div>
          <p className="text-sm text-zinc-500">
            {allRecipes.length === 0
              ? "No matches"
              : `${allRecipes.length} recipe${allRecipes.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <form
          action="/recipes"
          method="get"
          role="search"
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          {filters.category ? (
            <input type="hidden" name="category" value={filters.category} />
          ) : null}
          {filters.tag ? <input type="hidden" name="tag" value={filters.tag} /> : null}
          {filters.maxCookMins !== null ? (
            <input
              type="hidden"
              name="maxCookMins"
              value={String(filters.maxCookMins)}
            />
          ) : null}
          <div className="flex w-full min-w-0 flex-1 flex-col gap-1.5 sm:max-w-md">
            <label htmlFor="recipes-q" className="sr-only">
              Search recipes by title
            </label>
            <div className="flex gap-2">
              <input
                id="recipes-q"
                name="q"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search by title…"
                defaultValue={filters.q ?? ""}
                className="min-w-0 flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-900"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Matches titles that contain your text (not case-sensitive).
            </p>
          </div>
        </form>

        {active ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {effectiveTitleSearch(filters) && filters.q?.trim() ? (
              <Link
                href={recipesBrowseUrl({
                  category: filters.category,
                  tag: filters.tag,
                  maxCookMins: filters.maxCookMins,
                })}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-800 ring-1 ring-zinc-300 hover:bg-zinc-100"
              >
                Title: {filters.q.trim()} ✕
              </Link>
            ) : null}
            {filters.category ? (
              <Link
                href={recipesBrowseUrl({
                  tag: filters.tag,
                  maxCookMins: filters.maxCookMins,
                  q: filters.q,
                })}
                className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-800 ring-1 ring-zinc-300 hover:bg-zinc-300"
              >
                Category: {filters.category} ✕
              </Link>
            ) : null}
            {filters.tag ? (
              <Link
                href={recipesBrowseUrl({
                  category: filters.category,
                  maxCookMins: filters.maxCookMins,
                  q: filters.q,
                })}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 ring-1 ring-zinc-200 hover:bg-zinc-200"
              >
                Tag: {filters.tag} ✕
              </Link>
            ) : null}
            {filters.maxCookMins !== null ? (
              <Link
                href={recipesBrowseUrl({
                  category: filters.category,
                  tag: filters.tag,
                  q: filters.q,
                })}
                className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-800 ring-1 ring-zinc-300 hover:bg-zinc-300"
              >
                ≤{filters.maxCookMins} min ✕
              </Link>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Could not load recipes. If you filtered by tag, ensure the{" "}
            <code className="rounded bg-red-100 px-1">tags</code> column exists on{" "}
            <code className="rounded bg-red-100 px-1">recipes</code> in Supabase.
          </p>
        ) : allRecipes.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/90 p-10 text-center">
            <p className="text-zinc-600">
              {active
                ? "No recipes match these filters yet."
                : "No recipes have been shared yet."}
            </p>
            {active ? (
              <Link
                href="/recipes"
                className="mt-4 inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                View all recipes →
              </Link>
            ) : (
              <Link
                href="/login?redirect=/create-recipe"
                className="mt-4 inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Sign in to share the first one →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allRecipes.map((recipe) => (
              <RecipeListCard
                key={recipe.id}
                recipe={recipe}
                isAuthenticated={!!user}
                favorited={favoriteIds.has(recipe.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
