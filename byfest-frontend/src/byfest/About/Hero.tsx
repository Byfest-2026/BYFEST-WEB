import React from "react";

const REEL_EMBED_URL = "https://www.instagram.com/reel/DaP45KKPP6Q/embed";

export default function HeroSection() {
  return (
    <section className="bf-hero">
      <div className="bf-hero-text">
        <div className="bf-hero-badge">7 Years of Byfest Journey</div>

        <h1 className="bf-hero-title">
          BRAWIJAYA <br className="bf-hero-br" />
          FILM <br className="bf-hero-br" />
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

      {/* Video langsung rasio 16:9, tanpa pembungkus kartu */}
      <div className="bf-hero-video">
        <iframe
          src={REEL_EMBED_URL}
          title="After Movie BYFEST 2025"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          scrolling="no"
        />
      </div>
    </section>
  );
}
