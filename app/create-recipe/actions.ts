"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateRecipeState = {
  error?: string;
};

export async function createRecipe(
  _prevState: CreateRecipeState | null,
  formData: FormData
): Promise<CreateRecipeState> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?redirect=/create-recipe");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const ingredients = formData.get("ingredients") as string;
  const instructions = formData.get("instructions") as string;
  const cookingTimeStr = formData.get("cooking_time") as string;
  const difficulty = formData.get("difficulty") as string;
  const category = formData.get("category") as string;
  const tagsRaw = formData.get("tags") as string;
  const tagsFromCheckboxes = formData.getAll("tag").map(String);

  const cookingTime = Number.parseInt(cookingTimeStr, 10);
  const ingredientLines = ingredients
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const instructionLines = instructions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const tagTokens = [
    ...tagsFromCheckboxes,
    ...(tagsRaw ?? "").split(/[\n,]+/).map((t) => t.trim()).filter(Boolean),
  ];
  const seen = new Set<string>();
  const tagList: string[] = [];
  for (const raw of tagTokens) {
    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tagList.push(raw);
  }

  if (
    !title?.trim() ||
    !description?.trim() ||
    ingredientLines.length === 0 ||
    instructionLines.length === 0 ||
    Number.isNaN(cookingTime) ||
    cookingTime < 1 ||
    !difficulty?.trim() ||
    !category?.trim()
  ) {
    return { error: "Please fill in all required fields." };
  }

  const insert = {
    user_id: user.id,
    title: title.trim(),
    description: description.trim(),
    ingredients: ingredientLines,
    instructions: instructionLines,
    cooking_time: cookingTime,
    difficulty: difficulty.trim(),
    category: category.trim(),
    tags: tagList,
  };

  const { error } = await supabase.from("recipes").insert(insert);

  if (error) {
    console.error("Failed to create recipe", error);
    if (error.code === "23514") {
      return {
        error: `Invalid value for your database rules: ${error.message}`,
      };
    }
    if (error.code === "42501" || error.message.toLowerCase().includes("row-level security")) {
      return {
        error:
          "Not allowed to save (Row Level Security). In Supabase, add a policy allowing authenticated users to INSERT into recipes.",
      };
    }
    return { error: "Failed to save recipe. Please try again." };
  }

  redirect("/");
}
