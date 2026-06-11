import { createContext, use, useEffect, useMemo, useState } from "react";
import { FunctionOnce } from "./function-once";

export type ResolvedTheme = "dark" | "light";
export type Theme = ResolvedTheme | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const isBrowser = typeof window !== "undefined";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "karura-trails.theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (isBrowser ? (localStorage.getItem(storageKey) as Theme) : defaultTheme) || defaultTheme,
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(systemTheme);
        root.classList.add(systemTheme);
        root.setAttribute("data-theme", systemTheme);
        return;
      }

      setResolvedTheme(theme as ResolvedTheme);
      root.classList.add(theme);
      root.setAttribute("data-theme", theme);
    }

    mediaQuery.addEventListener("change", applyTheme);
    applyTheme();

    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      },
    }),
    [theme, resolvedTheme, storageKey],
  );

  return (
    <ThemeProviderContext value={value}>
      <FunctionOnce param={storageKey}>
        {(key) => {
          const stored: string | null = localStorage.getItem(key as string);
          const isDark =
            stored === "dark" ||
            ((stored === null || stored === "system") &&
              window.matchMedia("(prefers-color-scheme: dark)").matches);
          const resolved = isDark ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", resolved);
          document.documentElement.classList.add(resolved);
        }}
      </FunctionOnce>
      {children}
    </ThemeProviderContext>
  );
}

export function useThemeContext() {
  const context = use(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
