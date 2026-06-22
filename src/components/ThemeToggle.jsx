import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-ocean-800/80 border border-gray-200 dark:border-ocean-700 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 group"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={`w-5 h-5 text-amber-500 transition-all duration-500 absolute ${
          dark ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`w-5 h-5 text-blossom-400 transition-all duration-500 absolute ${
          dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"
        }`}
      />
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-gray-900 dark:bg-ocean-800 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
