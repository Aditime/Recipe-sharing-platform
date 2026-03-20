"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const buttonClass =
  "text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 cursor-pointer bg-transparent p-0 font-sans disabled:cursor-not-allowed disabled:opacity-50";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSignOut() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Sign out failed", error);
          setErrorMessage(error.message);
          return;
        }
        router.push("/");
        router.refresh();
      } catch (e) {
        console.error("Sign out failed", e);
        setErrorMessage(
          e instanceof Error ? e.message : "Could not sign out. Try again."
        );
      }
    });
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        className={buttonClass}
        onClick={handleSignOut}
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? "Signing out…" : "Sign out"}
      </button>
      {errorMessage ? (
        <span className="max-w-[200px] text-right text-xs text-red-600">
          {errorMessage}
        </span>
      ) : null}
    </span>
  );
}
