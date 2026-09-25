/* src/byfest/Navbar/Navbar.tsx */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./Navbar.css";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Byfest", href: "/about" },
  { label: "Program", href: "/program" },
  { label: "Get Tickets", href: "/ticketing" },
  { label: "Merch Byfest", href: "/merch" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="byfest-navbar">
      <div className="byfest-navbar-container">
        {/* Logo & Title */}
        <div className="byfest-brand-group">
          <Image
            src="/images/Logo Byfest 2026.svg"
            alt="Logo Byfest 2026"
            width={35}
            height={35}
            priority
          />
          <div className="byfest-brand-text">
            <span className="byfest-title">Brawijaya Film Festival 2026</span>
            <span className="byfest-subtitle">Ejawantah</span>
          </div>
        </div>

        {/* Hamburger Button */}
        <button
          type="button"
          className={`byfest-hamburger ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span className="byfest-hamburger-line line-1"></span>
          <span className="byfest-hamburger-line line-2"></span>
          <span className="byfest-hamburger-line line-3"></span>
        </button>

        {/* Navigation Menu (Desktop & Mobile Handler) */}
        <nav className={`byfest-dropdown ${isOpen ? "mobile-open" : ""}`}>
          <ul className="byfest-menu-list">
            {MENU_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="byfest-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}