import Link from "next/link";
import { normalizeStringArray } from "@/lib/recipes/format";
import type { Recipe } from "@/types/db.types";

interface RecipeTagsProps {
  recipe: Recipe;
  className?: string;
  maxVisible?: number;
  /** When true, each tag links to `/recipes?tag=...` (use outside a parent `<Link>`). */
  linkable?: boolean;
}

const tagPillClass =
  "rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700";
const tagLinkClass = `${tagPillClass} transition hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400`;

export function RecipeTags({
  recipe,
  className = "",
  maxVisible,
  linkable = false,
}: RecipeTagsProps) {
  const tags = normalizeStringArray(recipe.tags);
  if (tags.length === 0) return null;

  const visible =
    maxVisible !== undefined ? tags.slice(0, maxVisible) : tags;
  const extra =
    maxVisible !== undefined ? Math.max(0, tags.length - maxVisible) : 0;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visible.map((tag) =>
        linkable ? (
          <Link
            key={tag}
            href={`/recipes?tag=${encodeURIComponent(tag)}`}
            className={tagLinkClass}
          >
            {tag}
          </Link>
        ) : (
          <span key={tag} className={tagPillClass}>
            {tag}
          </span>
        )
      )}
      {extra > 0 ? (
        <span className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-500">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
