import { NavbarItem } from "@nextui-org/react";
import React from "react";
import { Link, useMatches } from "@remix-run/react";

export function MainNavItem({text, to}: {text: string, to: string}) {
  const matches = useMatches();

  const isActive = React.useMemo(() => {
    return matches[1].pathname === to;
  }, [matches]);
  
  return <NavbarItem isActive={isActive}>
    <Link to={to} className={isActive ? 'border-2 border-neutral-600 dark:border-neutral-300 rounded p-1' : ''}>
      {text}
    </Link>
  </NavbarItem>
}