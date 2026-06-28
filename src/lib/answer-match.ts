// Shared answer-comparison helpers used by every experience (classic quiz,
// math drill, …). Keep all "is this answer correct?" logic here so the rules
// stay consistent across the app.

/** Lowercase + strip accents for forgiving text comparison. */
export function normalizeString(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Try to interpret a string as a number, tolerating es-AR formatting:
 * "." as thousands separator, "," as decimal, plus currency symbols/spaces.
 * Returns null when the value isn't purely numeric.
 */
export function parseNumeric(str: string | null | undefined): number | null {
  if (!str) return null;
  const cleaned = str.replace(/[\s$]/g, '');
  // Require at least one digit so bare separators (".", ",") aren't read as 0.
  if (!/^[-+]?[\d.,]+$/.test(cleaned) || !/\d/.test(cleaned)) return null;
  const normalized = cleaned.replace(/\./g, '').replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/**
 * Compare a user answer to the correct one: numeric when both parse as numbers
 * (so "2500" === "2.500"), otherwise accent/case-insensitive string match.
 */
export function answersMatch(
  user: string | null | undefined,
  correct: string | null | undefined,
): boolean {
  const un = parseNumeric(user);
  const cn = parseNumeric(correct);
  if (un !== null && cn !== null) return un === cn;
  return normalizeString((user ?? '').trim()) === normalizeString((correct ?? '').trim());
}
