import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useNavigation
} from "@remix-run/react";
import {CircularProgress, Navbar, NavbarBrand, NavbarContent, NavbarItem, NextUIProvider} from "@nextui-org/react"
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { ThemeScript, ThemeProvider, Theme, useTheme } from "./utils/theme-provider.jsx";
import { DarkModeButton } from "./components/dark-mode-button.jsx";
import { getThemeSession } from "./utils/theme.server.js";
// @ts-expect-error
import tailwindStyles from "~/styles/tailwind.css?url";
import { MainNavItem } from "./components/main-nav-item.jsx";
// @ts-expect-error
import markdownStyles from "~/styles/markdown.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: markdownStyles },
];

export type LoaderData = {
  theme: Theme | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const data: LoaderData = {
    theme: themeSession.getTheme(),
  };

  return data;
};

export default function App() {
  const {theme} = useLoaderData<LoaderData>();

  return (
    <html className={`h-full bg-gradient-to-b from-transparent via-background-secondary via-80% to-background-secondary bg-fixed text-foreground bg-background ${theme}`}>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
        <ThemeScript ssrTheme={Boolean(theme)}/>
      </head>
      <body>
        <NextUIProvider>
          <ThemeProvider specifiedTheme={theme}>
            <Navbar className="bg-transparent">
              <NavbarBrand>
                <p className="font-bold text-inherit">Quarter</p>
              </NavbarBrand>
              <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <MainNavItem text="Demo" to="/" />
                <MainNavItem text="How It Works" to="/about" />
              </NavbarContent>
              <NavbarContent justify="end">
                <NavbarItem>
                  <DarkModeButton />
                </NavbarItem>
              </NavbarContent>
            </Navbar>
            <div className="mt-4">
              <Outlet />
            </div>
            <Scripts />
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
