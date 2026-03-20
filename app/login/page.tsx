import { AuthForm } from "@/components/auth/AuthForm";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-md ring-1 ring-zinc-200 sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Welcome back
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Sign in to OpenRecipe
          </h1>
          <p className="text-xs text-zinc-500">
            Access your saved recipes and share your latest creations.
          </p>
        </div>

        <AuthForm mode="login" redirectTo={redirect} />

        <p className="mt-4 text-center text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-zinc-600 hover:text-zinc-900"
          >
            Create one
          </a>
          .
        </p>
      </div>
    </main>
  );
}

