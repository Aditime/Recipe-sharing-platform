import type { SupabaseClient } from "@supabase/supabase-js";

export async function getFavoriteRecipeIdSet(
  supabase: SupabaseClient,
  userId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to load favorite ids", error);
    return new Set();
  }

  return new Set((data ?? []).map((row) => String(row.recipe_id)));
}
