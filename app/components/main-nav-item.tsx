import { NavbarItem } from "@heroui/react";
import React from "react";
import { Link, useMatches } from "@remix-run/react";

const linkClassName = '!text-header-link no-underline rounded';

export function MainNavItem({text, to}: {text: string, to: string}) {
  const matches = useMatches();

  const isActive = React.useMemo(() => {
    return matches[1].pathname === to;
  }, [matches]);
  
  return <NavbarItem isActive={isActive}>
    <Link to={to} className={isActive ? `${linkClassName} border-2 border-header-link p-1`: linkClassName}>
      {text}
    </Link>
  </NavbarItem>
}