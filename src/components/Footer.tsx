import * as React from "react";
import useLocalStorage from "use-local-storage";

export interface FooterProps {
  disabled: boolean;
  setIsIntroOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Footer({ disabled, setIsIntroOpen }: FooterProps) {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );
  document.documentElement.setAttribute("data-theme", theme);

  function switchTheme() {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      setTheme("light");
    }
  }
  return (
    <footer>
      <button
        title="Click to view intro tour!"
        className="info-button"
        onClick={() => setIsIntroOpen(true)}
        disabled={disabled}
      >
        <i className="icon-info-sign" /> how it works
      </button>
      <button>
        <a
          href="https://github.com/ugurkiymetli/sun-position"
          target="_blank"
          rel="noreferrer"
        >
          <i className="icon-github-sign" /> repo
        </a>
      </button>
      <button>
        <a
          href="https://linkedin.com/in/ugurkiymetli"
          target="_blank"
          rel="noreferrer"
        >
          <i className="icon-linkedin-sign" /> uğur
        </a>
      </button>
      <button id="change-theme-button" onClick={switchTheme}>
        {theme === "light" ? (
          <i className="icon-sun" />
        ) : (
          <i className="icon-moon" />
        )}{" "}
        {theme === "dark" ? "dark" : "light"}
      </button>
    </footer>
  );
}
