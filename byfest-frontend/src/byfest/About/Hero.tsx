"use client";

import React from "react";

interface HeroProps {
  instagramEmbedUrl?: string;
}

export default function HeroSection({
  instagramEmbedUrl = "https://www.instagram.com/reel/Dd8Txh6S93d/embed",
}: HeroProps) {
  return (
    <section className="bf-hero">
      <div className="bf-hero-text">
        <div className="bf-hero-badge">7 Years of Byfest Journey</div>

        <h1 className="bf-hero-title">
          BRAWIJAYA <br />
          FILM <br />
          FESTIVAL
        </h1>

        <p className="bf-hero-desc">
          Brawijaya Film Festival adalah perwujudan kolektif dari semangat sineas
          muda untuk...
        </p>

        <button type="button" className="bf-hero-btn">
          Get Tickets
        </button>
      </div>

      {/* Pembungkus device (rasio potret). Header & footer Instagram dipotong,
          hanya videonya yang terlihat. */}
      <div className="bf-hero-device">
        <div className="bf-hero-screen">
          {instagramEmbedUrl && (
            <iframe
              src={instagramEmbedUrl}
              title="BYFEST 2026 Instagram Reel"
              className="bf-hero-iframe"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
            />
          )}
        </div>
      </div>
    </section>
  );
}
