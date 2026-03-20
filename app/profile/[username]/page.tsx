import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, Recipe } from "@/types/db.types";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage(props: ProfilePageProps) {
  const { username } = await props.params;
  const supabase = await createSupabaseServerClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle<Profile>();

  if (profileError) {
    console.error("Failed to load profile", profileError);
  }

  if (!profile) {
    notFound();
  }

  const { data: recipes, error: recipesError } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  if (recipesError) {
    console.error("Failed to load user recipes", recipesError);
  }

  const userRecipes = (recipes ?? []) as Recipe[];

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                {profile.username}
              </h1>
              {profile.full_name ? (
                <p className="text-sm text-zinc-600">{profile.full_name}</p>
              ) : null}
              <p className="mt-2 text-xs text-zinc-500">
                Community member since{" "}
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Recipes by {profile.username}
              </h2>
              <p className="text-xs text-zinc-500">
                {userRecipes.length === 0
                  ? "This cook hasn't shared any recipes yet."
                  : "All recipes shared by this community member."}
              </p>
            </div>
          </div>

          {userRecipes.length === 0 ? (
            <p className="text-sm text-zinc-600">
              No recipes to show yet. Check back soon.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {userRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-28 w-full bg-gradient-to-br from-zinc-200 via-zinc-100 to-slate-200" />
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-zinc-600">
                      {recipe.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-zinc-600">
                      {recipe.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-zinc-500">
                      <span>{recipe.category}</span>
                      <span>{recipe.cooking_time} min</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

