import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {

  const { darkMode, setDarkMode } = useTheme();

  return (

    <nav
      style={{
        background: "var(--navbar)",
        borderBottom: "1px solid var(--border-soft)"
      }}
      className="
        glass
        sticky
        top-0
        z-50
        px-8
        py-5
        flex
        items-center
        justify-between
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-black
            tracking-tight
          "
        >
          MedSearch-RL
        </h1>

        <p
          style={{
            color: "var(--muted)"
          }}
          className="text-sm"
        >
          Multi-Domain Medical RL Platform
        </p>

      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)"
        }}
        className="
          w-12
          h-12
          rounded-xl
          flex
          items-center
          justify-center
          transition
          hover:scale-105
        "
      >

        {darkMode ? <Sun size={20} /> : <Moon size={20} />}

      </button>

    </nav>

  );

}