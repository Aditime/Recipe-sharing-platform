import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RecipeForm } from "@/components/recipes/RecipeForm";

export default async function CreateRecipePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Failed to load current user", userError);
  }

  if (!user) {
    redirect("/login?redirect=/create-recipe");
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Back to home
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-zinc-200 sm:p-8">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Share with the community
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Create a new recipe
            </h1>
            <p className="text-sm text-zinc-500">
              Add your favorite dish so others can discover and cook it.
            </p>
          </div>

          <RecipeForm />
        </div>
      </div>
    </main>
  );
}
