"use client";

import { useActionState } from "react";
import { createRecipe, type CreateRecipeState } from "@/app/create-recipe/actions";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Beverage",
  "Soup",
  "Salad",
  "Appetizer",
  "Main Course",
  "Side Dish",
  "Other",
];

/** Values must match your Supabase `recipes_difficulty_check` (often lowercase). */
const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const inputClassName =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-500/0 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200";

const labelClassName = "block text-sm font-medium text-zinc-800";

const SUGGESTED_TAGS = [
  "Comfort food",
  "Vegan",
  "Vegetarian",
  "Gluten-free",
  "Quick",
  "Meal prep",
  "Low carb",
  "Kid-friendly",
];

export function RecipeForm() {
  const [state, formAction, isPending] = useActionState<
    CreateRecipeState | null,
    FormData
  >(createRecipe, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className={labelClassName}>
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className={inputClassName}
          placeholder="e.g. Creamy Garlic Pasta"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className={labelClassName}>
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          className={`${inputClassName} resize-y`}
          placeholder="A brief overview of the dish..."
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="category" className={labelClassName}>
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            className={inputClassName}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty" className={labelClassName}>
            Difficulty *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            required
            className={inputClassName}
          >
            <option value="">Select difficulty</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className={labelClassName}>Tags (optional)</legend>
        <p className="text-xs text-zinc-500">
          Pick common labels and/or add your own below (comma or new line).
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.map((tag) => (
            <label
              key={tag}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-800 has-[:checked]:border-zinc-400 has-[:checked]:bg-zinc-200"
            >
              <input
                type="checkbox"
                name="tag"
                value={tag}
                className="size-3.5 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500"
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
        <textarea
          id="tags"
          name="tags"
          rows={2}
          className={`${inputClassName} resize-y text-sm`}
          placeholder="e.g. dairy-free, one-pot, Italian"
        />
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="cooking_time" className={labelClassName}>
          Cooking time (minutes) *
        </label>
        <input
          id="cooking_time"
          name="cooking_time"
          type="number"
          min={1}
          max={999}
          required
          className={inputClassName}
          placeholder="e.g. 30"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="ingredients" className={labelClassName}>
          Ingredients *
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          rows={6}
          className={`${inputClassName} resize-y font-mono text-sm`}
          placeholder={`One ingredient per line, e.g.\n2 cups flour\n1 tsp salt\n3 eggs`}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="instructions" className={labelClassName}>
          Instructions *
        </label>
        <textarea
          id="instructions"
          name="instructions"
          required
          rows={8}
          className={`${inputClassName} resize-y`}
          placeholder="Step-by-step instructions..."
        />
      </div>

      {state?.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-full bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[180px]"
      >
        {isPending ? "Saving..." : "Publish recipe"}
      </button>
    </form>
  );
}
