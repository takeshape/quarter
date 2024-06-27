// https://www.mattstobbs.com/remix-dark-mode/#2-initial-state-from-user-preferences

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { DEFAULT_THEME, Theme } from './theme.ts';
import { useFetcher } from '@remix-run/react';

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children, specifiedTheme }: { children: ReactNode, specifiedTheme: Theme | null }) {
  const [theme, setTheme] = useState<Theme | null>(() => {

    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) {
        return specifiedTheme;
      } else {
        return null;
      }
    }
  });

  const persistTheme = useFetcher();

  // TODO: remove this when persistTheme is memoized properly
  const persistThemeRef = useRef(persistTheme);
  useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  const mountRun = useRef(false);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!theme) {
      return;
    }

    persistThemeRef.current.submit({ theme }, { action: 'set-theme', method: 'post' });
  }, [theme]);

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

const clientThemeCode = `
(() => {
  const theme = window.matchMedia('(prefers-color-scheme: ${DEFAULT_THEME})').matches ? 'dark' : 'light';
  document.documentElement.classList.add(theme);
})();
`;


function ThemeScript({ ssrTheme }: { ssrTheme: boolean }) {
  return <>{ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}</>;
}

const themes: Array<Theme> = Object.values(Theme);

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme);
}

export { ThemeScript, Theme as Theme, ThemeProvider, useTheme, isTheme };

