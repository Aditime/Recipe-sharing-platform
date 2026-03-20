"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/favorites/actions";

interface FavoriteButtonProps {
  recipeId: string;
  initialFavorited: boolean;
  isAuthenticated: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function FavoriteButton({
  recipeId,
  initialFavorited,
  isAuthenticated,
  size = "sm",
  className = "",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;

  const btnSize =
    size === "md" ? "h-10 w-10 rounded-xl" : "h-8 w-8 rounded-lg";
  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4";

  const baseClass = `inline-flex items-center justify-center border shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 ${btnSize} ${className}`;

  if (!isAuthenticated) {
    return (
      <Link
        href={loginHref}
        className={`${baseClass} border-zinc-200 bg-white/95 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700`}
        title="Sign in to save favorites"
        aria-label="Sign in to save favorites"
      >
        <HeartIcon className={iconClass} filled={false} />
      </Link>
    );
  }

  function handleClick() {
    startTransition(async () => {
      const result = await toggleFavorite(recipeId);
      if (!result.ok) {
        if (result.error === "auth") {
          router.push(loginHref);
          return;
        }
        console.error(result.message ?? "Favorite toggle failed");
        return;
      }
      setFavorited(result.favorited);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`${baseClass} ${
        favorited
          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-zinc-200 bg-white/95 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
      }`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorited}
    >
      <HeartIcon className={iconClass} filled={favorited} />
    </button>
  );
}

function HeartIcon({
  className,
  filled,
}: {
  className?: string;
  filled: boolean;
}) {
  if (filled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.003-.002.001h-.002z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}
