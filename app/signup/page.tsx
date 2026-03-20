import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-md ring-1 ring-zinc-200 sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Join the community
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Create your OpenRecipe account
          </h1>
          <p className="text-xs text-zinc-500">
            Share your favorite dishes and save recipes you love.
          </p>
        </div>

        <AuthForm mode="signup" />

        <p className="mt-4 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-zinc-600 hover:text-zinc-900"
          >
            Sign in
          </a>
          .
        </p>
      </div>
    </main>
  );
}

