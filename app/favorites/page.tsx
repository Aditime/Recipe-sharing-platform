import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RecipeListCard } from "@/components/recipes/RecipeListCard";
import type { Recipe } from "@/types/db.types";
import { getFavoriteRecipeIdSet } from "@/lib/favorites/get-favorite-ids";

export const metadata = {
  title: "Favorites | OpenRecipe",
  description: "Recipes you have saved.",
};

interface FavoriteRow {
  recipe_id: string;
  recipes: Recipe | null;
}

export default async function FavoritesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("FavoritesPage: auth", userError);
  }

  if (!user) {
    redirect("/login?redirect=/favorites");
  }

  const { data: rows, error } = await supabase
    .from("favorites")
    .select("recipe_id, recipes (*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load favorites", error);
  }

  const favoriteRecipes = ((rows ?? []) as FavoriteRow[])
    .map((row) => row.recipes)
    .filter((r): r is Recipe => r !== null && typeof r === "object" && "id" in r);

  const favoriteIds = await getFavoriteRecipeIdSet(supabase, user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-white">
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8 lg:py-14">
        <Link
          href="/recipes"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Browse all recipes
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Your favorites
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Recipes you&apos;ve saved — tap the heart on any recipe to add or remove.
        </p>

        {error ? (
          <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Could not load favorites. Create the{" "}
            <code className="rounded bg-red-100 px-1">favorites</code> table in
            Supabase (see{" "}
            <code className="rounded bg-red-100 px-1">
              supabase/migrations/20260317000001_favorites.sql
            </code>
            ).
          </p>
        ) : favoriteRecipes.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-white/90 p-10 text-center">
            <p className="text-zinc-600">You haven&apos;t saved any recipes yet.</p>
            <Link
              href="/recipes"
              className="mt-4 inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Browse recipes →
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteRecipes.map((recipe) => (
              <RecipeListCard
                key={recipe.id}
                recipe={recipe}
                isAuthenticated
                favorited={favoriteIds.has(recipe.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
