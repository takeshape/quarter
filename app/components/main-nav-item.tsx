import { Button, NavbarItem } from "@nextui-org/react";
import { Theme, useTheme } from "../utils/theme-provider";
import React from "react";
import { Link, useMatches } from "@remix-run/react";

export function MainNavItem({text, to}: {text: string, to: string}) {
  const matches = useMatches();

  const isActive = React.useMemo(() => {
    return matches[1].pathname === to;
  }, [matches]);
  
  return <NavbarItem isActive={isActive}>
    <Link to={to} className={isActive ? 'text-primary' : ''}>
      {text}
    </Link>
  </NavbarItem>
}