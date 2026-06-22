import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition">
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
