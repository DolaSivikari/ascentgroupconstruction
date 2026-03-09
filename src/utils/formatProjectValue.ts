/**
 * Safely parses project_value (stored as text in DB) and formats it for display.
 * 
 * Stored formats observed:
 * - Empty string "" (most projects)
 * - Comma-separated whole dollars like "40,000,000"
 * - Possibly raw numbers like "5000000"
 * 
 * Returns null if the value is empty, invalid, or NaN — callers should hide the element.
 */
export function formatProjectValue(
  value: unknown,
  mode: 'compact' | 'full' = 'compact'
): string | null {
  if (value === null || value === undefined) return null;

  // Convert to string and strip $, commas, whitespace
  const raw = String(value).replace(/[$,\s]/g, '').trim();
  if (!raw || raw === '0') return null;

  const num = parseFloat(raw);
  if (isNaN(num) || num <= 0) return null;

  if (mode === 'compact') {
    if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `$${Math.round(num / 1_000)}K`;
    }
    return `$${num.toLocaleString('en-US')}`;
  }

  // Full mode
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
