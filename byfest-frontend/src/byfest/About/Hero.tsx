import React from "react";

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

      {/* Sisi kanan khusus desktop (divider sudah dihapus) */}
      <div className="byfest-hero-right">
        <div className="byfest-hero-aftermovie-placeholder">
          <div className="byfest-hero-aftermovie-heading">
            <span>brawijayafilm...</span>
            <strong>Original audio</strong>
          </div>
          <div className="byfest-hero-aftermovie-video">
            <iframe
              src="https://www.instagram.com/reel/EXAMPLE/embed"
              title="After Movie BYFEST"
            />
          </div>
        </div>
        <div className="byfest-hero-aftermovie-content">
          <h3 className="byfest-hero-theme-title">Theme</h3>
          <p className="byfest-hero-theme-desc">Deskripsi tema film festival...</p>
        </div>
      </div>

      {/* Kartu khusus versi mobile */}
      <div className="byfest-aftermovie-card block lg:hidden">
        <div className="byfest-aftermovie-title">
          <span>brawijayafilm... </span>
          <strong>Original audio</strong>
        </div>
        <div className="byfest-aftermovie-video">
          <iframe
            src="https://www.instagram.com/reel/EXAMPLE/embed"
            title="After Movie BYFEST Mobile"
          />
        </div>
      </div>
    </section>
  );
}
