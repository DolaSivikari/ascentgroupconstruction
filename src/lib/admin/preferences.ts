export type AdminTheme = "light" | "dark";
export const ADMIN_IDLE_TIMEOUT = 30 * 60_000;
export const ADMIN_IDLE_WARNING = 60_000;
export function readAdminPreference(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
export function writeAdminPreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences remain usable in memory. */
  }
}
