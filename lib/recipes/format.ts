/**
 * Supabase may return text[] as string[]; legacy rows might be a single string.
 */
export function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
}

export function formatDifficultyLabel(difficulty: string): string {
  if (!difficulty) return "";
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
}
