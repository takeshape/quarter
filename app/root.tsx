import React from "react";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NextUIProvider} from "@nextui-org/react"
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { ThemeScript, ThemeProvider, Theme, useTheme } from "./utils/theme-provider";
import { DarkModeButton } from "./components/dark-mode-button";
import { getThemeSession } from "./utils/theme.server";
// @ts-expect-error
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
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

  const matches = useMatches();

  const isActive = (to) => {
    return matches.some(match => match.pathname === to);
  };
  
  return (
    <html className={`text-foreground bg-background ${theme}`}>
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
            <Navbar>
              <NavbarBrand>
                <p className="font-bold text-inherit">Quarter</p>
              </NavbarBrand>
              <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={isActive('/')}>
                  <Link to="/">
                    Demo
                  </Link>
                </NavbarItem>
                <NavbarItem isActive={isActive('/about')}>
                  <Link to="/about" color=" ">
                    How It Works
                  </Link>
                </NavbarItem>
              </NavbarContent>
              <NavbarContent justify="end">
                <NavbarItem>
                  <DarkModeButton />
                </NavbarItem>
              </NavbarContent>
            </Navbar>
            <div className="container mx-auto px-4">
              <Outlet />
            </div>
            <Scripts />
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
