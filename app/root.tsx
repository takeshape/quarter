import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData
} from "@remix-run/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, HeroUIProvider} from "@heroui/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { ThemeScript, ThemeProvider, Theme } from "./utils/theme-provider.jsx";
import { DarkModeButton } from "./components/dark-mode-button.jsx";
import { getThemeSession } from "./utils/theme.server.js";
import tailwindStyles from "~/styles/tailwind.css?url";
import { MainNavItem } from "./components/main-nav-item.jsx";
import markdownStyles from "~/styles/markdown.css?url";
import logo from "./images/logo.png";
import logoDark from "./images/logo-dark.png";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    },
  },
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: markdownStyles },
];

export type Config = {
  takeshapeApiEndpoint: string;
  takeshapeApiKey: string;
  takeshapeApiMutationName: string;
}

type LoaderData = {
  theme: Theme | null;
  config: Config
};

export const loadEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set`);
  }
  return value;
}

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const data: LoaderData = {
    theme: themeSession.getTheme(),
    config: {
      takeshapeApiEndpoint: loadEnv('PUBLIC_TAKESHAPE_API_ENDPOINT'),
      takeshapeApiKey: loadEnv('PUBLIC_TAKESHAPE_API_KEY'),
      takeshapeApiMutationName: loadEnv('PUBLIC_TAKESHAPE_API_MUTATION_NAME')
    }
  };

  return data;
};

export const ConfigContext = React.createContext<Config>(null);

export default function App() {
  const {theme, config} = useLoaderData<LoaderData>();

  return (
    <html className={`h-full text-foreground ${theme}`}>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
        <ThemeScript ssrTheme={Boolean(theme)}/>
      </head>
      <body >
        <ConfigContext.Provider value={config}>
          <HeroUIProvider>
            <ThemeProvider specifiedTheme={theme}>
              <QueryClientProvider client={queryClient}>
                <Navbar  className="bg-transparent">
                  <NavbarBrand>
                    <img src={theme === 'light' ? logo : logoDark} alt="Valvoline" className="h-16"/>
                  </NavbarBrand>
                  <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <MainNavItem text="Demo" to="/" />
                    <MainNavItem text="Settings" to="/settings" />
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
              </QueryClientProvider>
            </ThemeProvider>
          </HeroUIProvider>
        </ConfigContext.Provider>
      </body>
    </html>
  );
}
