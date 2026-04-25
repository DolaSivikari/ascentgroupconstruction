import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with light/dark theme management.
 * - `attribute="class"` → toggles `<html class="dark">`
 * - `defaultTheme="light"` → matches the brand's enterprise feel
 * - `enableSystem` → respects OS preference if user hasn't chosen
 * - Persistence to localStorage is automatic (key: `theme`)
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);
