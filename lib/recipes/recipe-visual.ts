/**
 * Placeholder visuals when a recipe has no cover image yet.
 * Gradients stay in the zinc/slate family for a neutral look.
 */
const RECIPE_ACCENT_GRADIENTS = [
  "bg-gradient-to-br from-zinc-300 via-zinc-200 to-slate-300",
  "bg-gradient-to-br from-slate-300 via-zinc-200 to-zinc-300",
  "bg-gradient-to-br from-stone-300 via-zinc-100 to-zinc-300",
  "bg-gradient-to-br from-neutral-300 via-zinc-200 to-slate-200",
  "bg-gradient-to-br from-zinc-400/50 via-zinc-200 to-slate-300",
  "bg-gradient-to-br from-slate-400/45 via-zinc-200 to-zinc-300",
] as const;

function hashRecipeId(recipeId: string): number {
  let h = 0;
  for (let i = 0; i < recipeId.length; i += 1) {
    h = (h + recipeId.charCodeAt(i) * (i + 1)) % 2_147_483_647;
  }
  return h;
}

export function recipeAccentGradientClass(recipeId: string): string {
  const idx = hashRecipeId(recipeId) % RECIPE_ACCENT_GRADIENTS.length;
  return RECIPE_ACCENT_GRADIENTS[idx] ?? RECIPE_ACCENT_GRADIENTS[0];
}

export function recipeTitleInitial(title: string): string {
  const t = title.trim();
  if (!t) return "?";
  const first = Array.from(t)[0];
  if (!first) return "?";
  return first.toLocaleUpperCase();
}
