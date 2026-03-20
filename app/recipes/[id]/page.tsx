import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, Recipe } from "@/types/db.types";
import {
  formatDifficultyLabel,
  normalizeStringArray,
} from "@/lib/recipes/format";
import {
  recipeAccentGradientClass,
  recipeTitleInitial,
} from "@/lib/recipes/recipe-visual";
import { RecipeTags } from "@/components/recipes/RecipeTags";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RecipeDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("recipes")
    .select("title")
    .eq("id", id)
    .maybeSingle();

  const row = data as { title: string } | null;
  if (!row?.title) {
    return { title: "Recipe not found | OpenRecipe" };
  }
  return { title: `${row.title} | OpenRecipe` };
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: recipeRow, error: recipeError } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (recipeError) {
    console.error("Failed to load recipe", recipeError);
    notFound();
  }

  if (!recipeRow) {
    notFound();
  }

  const recipe = recipeRow as Recipe;
  const ingredients = normalizeStringArray(recipe.ingredients);
  const instructions = normalizeStringArray(recipe.instructions);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let favorited = false;
  if (user) {
    const { data: favRow } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("recipe_id", recipe.id)
      .maybeSingle();
    favorited = !!favRow;
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", recipe.user_id)
    .maybeSingle();

  const profile = profileRow as Pick<Profile, "username" | "full_name"> | null;
  const authorLabel =
    profile?.full_name?.trim() ||
    profile?.username ||
    "Community member";

  const accent = recipeAccentGradientClass(recipe.id);
  const titleInitial = recipeTitleInitial(recipe.title);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-white">
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:py-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Back to home
        </Link>

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
          <div className="space-y-6 p-6 md:p-8">
            <header className="flex flex-col gap-5 sm:flex-row sm:gap-6">
              <div
                className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${accent} text-2xl font-semibold tracking-tight text-zinc-800 shadow-sm ring-1 ring-zinc-300/50 sm:size-20 sm:text-3xl`}
                aria-hidden
              >
                {titleInitial}
              </div>
              <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Link
                  href={`/recipes?category=${encodeURIComponent(recipe.category)}`}
                  className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-800 transition hover:bg-zinc-200"
                >
                  {recipe.category}
                </Link>
                <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
                  {formatDifficultyLabel(recipe.difficulty)}
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">
                  {recipe.cooking_time} min
                </span>
              </div>
              <RecipeTags recipe={recipe} className="text-xs" linkable />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
                  {recipe.title}
                </h1>
                <FavoriteButton
                  recipeId={recipe.id}
                  initialFavorited={favorited}
                  isAuthenticated={!!user}
                  size="md"
                  className="shrink-0"
                />
              </div>
              <p className="text-pretty text-base leading-relaxed text-zinc-600">
                {recipe.description}
              </p>
              <p className="text-sm text-zinc-500">
                By{" "}
                {profile?.username ? (
                  <Link
                    href={`/profile/${profile.username}`}
                    className="font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    {authorLabel}
                  </Link>
                ) : (
                  <span className="font-medium text-zinc-700">
                    {authorLabel}
                  </span>
                )}
                <span className="text-zinc-400">
                  {" "}
                  ·{" "}
                  {new Date(recipe.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
              </div>
            </header>

            <section className="border-t border-zinc-200 pt-6">
              <h2 className="mb-3 text-lg font-semibold text-zinc-900">
                Ingredients
              </h2>
              {ingredients.length === 0 ? (
                <p className="text-sm text-zinc-500">No ingredients listed.</p>
              ) : (
                <ul className="list-inside list-disc space-y-2 text-zinc-700">
                  {ingredients.map((item, index) => (
                    <li key={`${item}-${index}`} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="border-t border-zinc-200 pt-6">
              <h2 className="mb-3 text-lg font-semibold text-zinc-900">
                Instructions
              </h2>
              {instructions.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No instructions listed.
                </p>
              ) : (
                <ol className="list-inside list-decimal space-y-3 text-zinc-700">
                  {instructions.map((step, index) => (
                    <li key={`${step}-${index}`} className="pl-1 leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <footer className="border-t border-zinc-200 pt-6">
              <p className="text-xs text-zinc-400">
                Comments and ratings coming soon.
              </p>
            </footer>
          </div>
        </article>
      </main>
    </div>
  );
}
