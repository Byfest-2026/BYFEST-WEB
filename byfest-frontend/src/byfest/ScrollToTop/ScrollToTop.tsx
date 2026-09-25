// src/byfest/ScrollToTop/ScrollToTop.tsx
"use client";

import React, { useState, useEffect } from "react";
import "./ScrollToTop.css"; // Impor CSS dari folder yang sama

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="byfest-scroll-top-btn"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}