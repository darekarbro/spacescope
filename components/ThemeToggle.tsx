"use client"

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
        setTheme('dark');
        return;
      }
      if (saved === 'light') {
        document.documentElement.classList.remove('dark');
        setTheme('light');
        return;
      }

      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setTheme('dark');
      } else {
        document.documentElement.classList.remove('dark');
        setTheme('light');
      }
    } catch (e) {
      setTheme('light');
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // ignore
    }
    setTheme(next);
  };

  if (theme === null) return null;

  return (
    <Button size="sm" variant="ghost" onClick={toggle} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
