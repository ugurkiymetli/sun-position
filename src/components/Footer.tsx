import * as React from "react";

export interface FooterProps {
  disabled: boolean;
  setIsIntroOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Footer({ disabled, setIsIntroOpen }: FooterProps) {
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
    </footer>
  );
}
