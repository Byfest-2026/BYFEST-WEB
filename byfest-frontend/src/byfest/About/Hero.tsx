import React from "react";

const REEL_URL = "https://www.instagram.com/reel/ISI_SHORTCODE_REEL/embed"; // ganti dengan shortcode asli

export default function HeroSection() {
  return (
    <section className="byfest-hero">
      <div className="byfest-hero-left">
        <div className="byfest-hero-badge">
          <span className="byfest-hero-badge-text">7 Years of Byfest Journey</span>
        </div>
        <h1 className="byfest-hero-title">
          BRAWIJAYA <br className="byfest-hero-title-break" />
          FILM <br className="byfest-hero-title-break" />
          FESTIVAL
        </h1>
        <p className="byfest-hero-desc">
          Brawijaya Film Festival adalah perwujudan kolektif dari semangat sineas muda untuk...
        </p>
        <button className="byfest-hero-btn">
          <span className="byfest-hero-btn-text">Get Tickets</span>
        </button>
      </div>

      {/* Desktop */}
      <div className="byfest-hero-right">
        <div className="byfest-hero-aftermovie-placeholder">
          <div className="byfest-hero-aftermovie-heading">
            <span>brawijayafilm...</span>
            <strong>Original audio</strong>
          </div>
          <div className="byfest-hero-aftermovie-video">
            <iframe
              src={REEL_URL}
              title="After Movie BYFEST"
              loading="lazy"
              scrolling="no"
              allow="encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
        <div className="byfest-hero-aftermovie-content">
          <h3 className="byfest-hero-theme-title">Theme</h3>
          <p className="byfest-hero-theme-desc">Deskripsi tema film festival...</p>
        </div>
      </div>

      {/* Mobile */}
      <div className="byfest-aftermovie-card">
        <div className="byfest-aftermovie-title">
          <span>brawijayafilm... </span>
          <strong>Original audio</strong>
        </div>
        <div className="byfest-aftermovie-video">
          <iframe
            src={REEL_URL}
            title="After Movie BYFEST Mobile"
            loading="lazy"
            scrolling="no"
            allow="encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
