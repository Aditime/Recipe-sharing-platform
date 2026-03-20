import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RecipeListCard } from "@/components/recipes/RecipeListCard";
import { RecipeTags } from "@/components/recipes/RecipeTags";
import { recipesBrowseUrl } from "@/lib/recipes/filters";
import {
  recipeAccentGradientClass,
  recipeTitleInitial,
} from "@/lib/recipes/recipe-visual";
import { getFavoriteRecipeIdSet } from "@/lib/favorites/get-favorite-ids";
import type { Recipe } from "@/types/db.types";

const MOOD_TAG_CHIPS: { label: string; tag: string }[] = [
  { label: "Quick weeknight dinners", tag: "Quick" },
  { label: "Comfort food", tag: "Comfort food" },
  { label: "Vegetarian", tag: "Vegetarian" },
  { label: "Vegan", tag: "Vegan" },
  { label: "Gluten-free", tag: "Gluten-free" },
  { label: "Meal prep", tag: "Meal prep" },
];

const CATEGORY_CHIPS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Soup",
  "Salad",
];

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Failed to load current user", userError);
  }

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load recipes", error);
  }

  const latestRecipes = (recipes ?? []).slice(0, 6) as Recipe[];

  const favoriteIds = user
    ? await getFavoriteRecipeIdSet(supabase, user.id)
    : new Set<string>();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-white">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-12 md:px-10 lg:px-16 lg:py-16">
        {/* Hero section */}
        <section className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              Community-powered recipes for everyday cooks
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Share the recipes you love.
              <br />
              Discover new favorites every day.
            </h1>
            <p className="max-w-xl text-pretty text-base text-zinc-600 sm:text-lg">
              OpenRecipe is a simple, fast recipe sharing platform for home
              cooks and food lovers. Upload your own creations, browse
              community favorites, and save recipes you want to cook next.
            </p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <a
                  href="/create-recipe"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900"
                >
                  Share a recipe
                  <span aria-hidden>→</span>
                </a>
              ) : (
                <Link
                  href="/login?redirect=/create-recipe"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900"
                >
                  Sign in to share a recipe
                  <span aria-hidden>→</span>
                </Link>
              )}
              <Link
                href="/recipes"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
              >
                Browse recipes
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-zinc-600">
              <div>
                <p className="text-zinc-900">For home & beginner cooks</p>
                <p className="text-xs text-zinc-500">Step-by-step, practical recipes</p>
              </div>
              <div>
                <p className="text-zinc-900">Community-driven</p>
                <p className="text-xs text-zinc-500">
                  Save favorites and follow creators (soon)
                </p>
              </div>
            </div>
          </div>

          {/* Right side visual / featured preview */}
          <div className="relative h-[320px] overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-300 via-zinc-200 to-slate-300 p-1 shadow-xl md:h-[360px]">
            <div className="flex h-full w-full flex-col justify-between rounded-[1.35rem] bg-white/95 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Today&apos;s pick
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Fresh from the OpenRecipe community
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  New recipes
                </div>
              </div>
              <div className="space-y-3">
                {latestRecipes.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No recipes yet. Be the first to share your favorite dish.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {latestRecipes.slice(0, 3).map((recipe) => {
                      const accent = recipeAccentGradientClass(recipe.id);
                      const initial = recipeTitleInitial(recipe.title);
                      return (
                      <li
                        key={recipe.id}
                        className="group rounded-2xl bg-zinc-100/90 p-3 shadow-sm ring-1 ring-zinc-100/80 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-300/90 hover:shadow-md hover:ring-zinc-300/90"
                      >
                        <div className="flex gap-3">
                          <Link
                            href={`/recipes/${recipe.id}`}
                            className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${accent} text-sm font-semibold text-zinc-800 shadow-sm ring-1 ring-zinc-300/40 transition duration-200 group-hover:brightness-[0.96] group-hover:ring-zinc-400/60`}
                            aria-label={`View ${recipe.title}`}
                          >
                            <span aria-hidden className="select-none leading-none">
                              {initial}
                            </span>
                          </Link>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/recipes/${recipe.id}`}
                                className="min-w-0 space-y-1 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
                              >
                                <p className="text-sm font-semibold leading-snug text-zinc-900">
                                  {recipe.title}
                                </p>
                                <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600">
                                  {recipe.description}
                                </p>
                              </Link>
                              <div className="flex shrink-0 flex-col items-end gap-1 text-[10px] text-zinc-500">
                                <Link
                                  href={`/recipes?category=${encodeURIComponent(recipe.category)}`}
                                  className="rounded-full bg-white/90 px-2 py-0.5 font-medium text-zinc-700 ring-1 ring-zinc-200/80 transition hover:bg-white"
                                >
                                  {recipe.category}
                                </Link>
                                <span>{recipe.cooking_time} min</span>
                              </div>
                            </div>
                            <RecipeTags
                              recipe={recipe}
                              maxVisible={3}
                              className="pt-0.5"
                              linkable
                            />
                          </div>
                        </div>
                      </li>
                    );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category chips / quick filters */}
        <section
          id="categories"
          className="space-y-4 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-zinc-200"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Cook by mood or diet
              </h2>
              <p className="text-xs text-zinc-500">
                Browse recipes by category, tags, and dietary needs.
              </p>
            </div>
            <Link
              href="/recipes"
              className="hidden text-xs font-semibold text-zinc-600 hover:text-zinc-900 md:inline"
            >
              View all recipes →
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-medium text-zinc-600">By category</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {CATEGORY_CHIPS.map((cat) => (
                <Link
                  key={cat}
                  href={recipesBrowseUrl({ category: cat })}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-zinc-800 transition hover:bg-zinc-200"
                >
                  {cat}
                </Link>
              ))}
            </div>
            <p className="text-xs font-medium text-zinc-600">By tag</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {MOOD_TAG_CHIPS.map(({ label, tag }) => (
                <Link
                  key={label}
                  href={recipesBrowseUrl({ tag })}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-zinc-800 transition hover:bg-zinc-200"
                >
                  {label}
                </Link>
              ))}
              <Link
                href={recipesBrowseUrl({ maxCookMins: 30 })}
                className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-zinc-800 transition hover:bg-zinc-200"
              >
                30 minutes or less
              </Link>
            </div>
          </div>
        </section>

        {/* Browse preview grid */}
        <section id="browse" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Community recipes
              </h2>
              <p className="text-xs text-zinc-500">
                A taste of what home cooks are sharing on OpenRecipe.
              </p>
            </div>
            <Link
              href="/recipes"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900"
            >
              Browse all →
            </Link>
          </div>

          {error ? (
            <p className="text-sm text-red-600">
              Could not load recipes. Check the console for details.
            </p>
          ) : latestRecipes.length === 0 ? (
            <p className="text-sm text-zinc-600">
              No recipes yet. Once the community starts sharing, you&apos;ll see
              them here.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestRecipes.map((recipe) => (
                <RecipeListCard
                  key={recipe.id}
                  recipe={recipe}
                  isAuthenticated={!!user}
                  favorited={favoriteIds.has(recipe.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Community section placeholder */}
        <section
          id="community"
          className="mt-4 rounded-3xl bg-zinc-900 px-6 py-8 text-zinc-100 shadow-md md:px-8"
        >
          <div>
            <h2 className="text-base font-semibold">
              Built for the OpenRecipe community
            </h2>
            <p className="mt-1 text-xs text-zinc-300">
              Profiles, comments, and ratings are coming soon. Start sharing
              now and grow with the platform from day one.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
