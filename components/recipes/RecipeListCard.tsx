import Link from "next/link";
import type { Recipe } from "@/types/db.types";
import { RecipeTags } from "@/components/recipes/RecipeTags";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { formatDifficultyLabel } from "@/lib/recipes/format";
import {
  recipeAccentGradientClass,
  recipeTitleInitial,
} from "@/lib/recipes/recipe-visual";

interface RecipeListCardProps {
  recipe: Recipe;
  isAuthenticated?: boolean;
  favorited?: boolean;
}

export function RecipeListCard({
  recipe,
  isAuthenticated = false,
  favorited = false,
}: RecipeListCardProps) {
  const detailHref = `/recipes/${recipe.id}`;
  const categoryHref = `/recipes?category=${encodeURIComponent(recipe.category)}`;
  const accent = recipeAccentGradientClass(recipe.id);
  const initial = recipeTitleInitial(recipe.title);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100/80 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-300/90 hover:shadow-md hover:ring-zinc-300/90">
      <div className="flex gap-3 p-4">
        <Link
          href={detailHref}
          className={`relative flex size-14 shrink-0 items-center justify-center rounded-xl ${accent} font-semibold tracking-tight text-zinc-800 shadow-sm ring-1 ring-zinc-300/40 transition duration-200 group-hover:brightness-[0.96] group-hover:ring-zinc-400/60`}
          aria-label={`View ${recipe.title}`}
        >
          <span aria-hidden className="select-none text-lg leading-none">
            {initial}
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <Link
                href={categoryHref}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-800 ring-1 ring-zinc-200/80 transition hover:bg-zinc-200"
              >
                {recipe.category}
              </Link>
              <span className="rounded-full bg-zinc-900/85 px-2 py-0.5 text-[10px] font-medium text-white">
                {recipe.cooking_time} min
              </span>
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-zinc-700 ring-1 ring-zinc-200/80">
                {formatDifficultyLabel(recipe.difficulty)}
              </span>
            </div>
            <FavoriteButton
              recipeId={recipe.id}
              initialFavorited={favorited}
              isAuthenticated={isAuthenticated}
              className="shrink-0"
            />
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
            <Link
              href={detailHref}
              className="transition hover:text-zinc-600 focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              {recipe.title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600">
            {recipe.description}
          </p>
          <RecipeTags recipe={recipe} maxVisible={3} className="pt-0.5" linkable />
        </div>
      </div>
    </article>
  );
}
