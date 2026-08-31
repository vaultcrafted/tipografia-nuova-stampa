import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "dark";
    setTheme(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Attiva tema chiaro" : "Attiva tema scuro"}
      title={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white lg:h-9 lg:w-9"
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-5 w-5 lg:h-4 lg:w-4" />
      ) : (
        <Moon className="h-5 w-5 lg:h-4 lg:w-4" />
      )}
    </button>
  );
}
