// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button, Switch } from "@heroui/react";
import { SunIcon } from "./icons/SunIcon";
import { MoonIcon } from "./icons/MoonIcon";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(theme === "light");

  useEffect(() => {
    setMounted(true);
    setEnabled(theme === "light");
  }, []);

  if (!mounted) return null;

  const useSwitch = (value: boolean) => {
    setEnabled(value);
    if (value) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <>
      <Switch
        isSelected={enabled}
        onValueChange={useSwitch}
        color="success"
        endContent={<MoonIcon />}
        size="lg"
        startContent={<SunIcon />}
      >
      </Switch>
    </>
  );
}