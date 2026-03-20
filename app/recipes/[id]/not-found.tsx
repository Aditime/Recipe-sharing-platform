import Link from "next/link";

export default function RecipeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4">
      <h1 className="text-xl font-semibold text-zinc-900">Recipe not found</h1>
      <p className="mt-2 text-sm text-zinc-600">
        It may have been removed or the link is invalid.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        ← Back to home
      </Link>
    </div>
  );
}
