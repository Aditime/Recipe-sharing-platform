"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ToggleFavoriteResult =
  | { ok: true; favorited: boolean }
  | { ok: false; error: "auth" | "db"; message?: string };

export async function toggleFavorite(
  recipeId: string
): Promise<ToggleFavoriteResult> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "auth" };
  }

  const { data: existing, error: findError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .maybeSingle();

  if (findError) {
    console.error("toggleFavorite lookup", findError);
    return { ok: false, error: "db", message: findError.message };
  }

  if (existing) {
    const { error: delError } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId);

    if (delError) {
      console.error("toggleFavorite delete", delError);
      return { ok: false, error: "db", message: delError.message };
    }
    return { ok: true, favorited: false };
  }

  const { error: insError } = await supabase.from("favorites").insert({
    user_id: user.id,
    recipe_id: recipeId,
  });

  if (insError) {
    console.error("toggleFavorite insert", insError);
    return { ok: false, error: "db", message: insError.message };
  }

  return { ok: true, favorited: true };
}
