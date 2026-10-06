"use client";

import React, { useEffect, useRef } from "react";

// Taruh file di folder /public/videos/ project Anda
const VIDEO_SRC = "/videos/aftermovie-byfest-2025.mp4";
const VIDEO_POSTER = "/videos/aftermovie-byfest-2025.jpg"; // opsional, hapus kalau tidak ada

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // React kadang tidak menulis atribut `muted` dengan benar, padahal browser
  // hanya mengizinkan autoplay kalau video muted. Dipaksa lewat ref.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      /* autoplay diblokir (mis. mode hemat daya), video tetap bisa di-tap */
    });
  }, []);

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

      <aside className="bf-hero-media">
        <p className="bf-hero-media-label">
          After Movie <strong>BYFEST 2025</strong>
        </p>

        <div className="bf-hero-video">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
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
