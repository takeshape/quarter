// https://www.mattstobbs.com/remix-dark-mode/#2-initial-state-from-user-preferences

import { createCookieSessionStorage } from '@remix-run/node';
import 'dotenv/config';
import {Theme, isTheme } from './theme-provider.tsx';
import { DEFAULT_THEME } from './theme.ts';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'my_remix_theme',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : DEFAULT_THEME;
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };

