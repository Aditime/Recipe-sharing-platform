import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const navTextClass = "text-sm font-medium text-zinc-700";
const navLinkClass = `${navTextClass} transition-colors hover:text-zinc-900`;

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("SiteHeader: failed to load user", userError);
  }

  return (
    <header className="border-b border-zinc-200/90 bg-zinc-50/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-white shadow-sm">
            <span className="text-lg font-semibold">OR</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            OpenRecipe
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-4 md:gap-6">
          <Link href="/recipes" className={navLinkClass}>
            Browse
          </Link>
          <Link
            href={user ? "/favorites" : "/login?redirect=/favorites"}
            className={navLinkClass}
          >
            Favorites
          </Link>
          {user ? (
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <Link href="/create-recipe" className={navLinkClass}>
                Share recipe
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/login" className={navLinkClass}>
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
