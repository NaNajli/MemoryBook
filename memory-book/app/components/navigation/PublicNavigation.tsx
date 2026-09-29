"use client";

import Link from "next/link";
import { useState } from "react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export default function PublicNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <nav className="site-nav page-shell" aria-label="Main navigation">
        <Link className="brand" href="/" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M7 5.5h13.5A4.5 4.5 0 0 1 25 10v16.5H11.5A4.5 4.5 0 0 1 7 22V5.5Z" />
              <path d="M11 9.5h7M11 13h10M11 16.5h7" />
              <path d="M7 22c0-2.2 1.8-4 4-4h14" />
            </svg>
          </span>
          <span>Memory Book</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="public-navigation-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true" className={isOpen ? "menu-icon is-open" : "menu-icon"}>
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className={isOpen ? "nav-menu is-open" : "nav-menu"} id="public-navigation-menu">
          <div className="nav-links">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu}>{link.label}</Link>
            ))}
          </div>
          <div className="nav-actions">
            <Link className="nav-login" href="/login" onClick={closeMenu}>Log In</Link>
            <Link className="button button-small" href="/register" onClick={closeMenu}>Get Started</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
