import { Button } from "@nextui-org/react";
import { Theme, useTheme } from "../utils/theme-provider.jsx";
import React from "react";

export function DarkModeButton() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  }, []);
  
  return <Button size="sm" onClick={toggleTheme}>
    {theme === 'dark' ? 'Light' : 'Dark'} Mode
  </Button>
}