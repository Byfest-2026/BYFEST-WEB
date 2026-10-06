import React from "react";

// PENTING: pakai shortcode reel ASLI yang sekarang sudah dipakai di project Anda
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

      {/* Satu kartu untuk mobile & desktop */}
      <aside className="bf-hero-media">
        <p className="bf-hero-media-label">
          After Movie <strong>BYFEST 2025</strong>
        </p>

        <div className="bf-hero-video">
          <iframe
            src={REEL_EMBED_URL}
            title="After Movie BYFEST 2025"
            loading="lazy"
            scrolling="no"
            allow="encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>

        <div className="bf-hero-theme">
          <h2>Theme</h2>
          <p>Deskripsi tema film festival...</p>
        </div>
      </aside>
    </section>
  );
}
