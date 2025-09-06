import { useEffect, useState } from "react";
import { useLanguage } from "@/store/language";
import { t } from "@/lib/i18n";

const THEME_KEY = "hn.theme";

export default function ThemeToggle() {
  const { language } = useLanguage();
  const [theme, setTheme] = useState<"light"|"dark">(
    (localStorage.getItem(THEME_KEY) as "light"|"dark") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-muted hover:bg-muted/80 transition"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
      <span className="text-sm">{theme === "dark" ? t(language, "theme_light") : t(language, "theme_dark")}</span>
    </button>
  );
}