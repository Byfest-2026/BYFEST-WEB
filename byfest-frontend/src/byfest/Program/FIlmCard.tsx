"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import "./program.css";

interface FilmCardProps {
  title: string;
  director: string;
  time?: string;
  genre?: string;
  age?: string;
  duration?: string;
  description?: string;
  posterImage?: string;
  trailerUrl?: string;
}

export default function FilmCard({
  title,
  director,
  time = "",
  genre = "",
  age = "",
  duration = "",
  description = "Please add your content here. Keep it short and simple. And smile :)",
  posterImage,
}: FilmCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sembunyikan Navbar saat modal dibuka
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("byfest-modal-active");
    } else {
      document.body.classList.remove("byfest-modal-active");
    }
    return () => {
      document.body.classList.remove("byfest-modal-active");
    };
  }, [showModal]);

  // Tutup modal ketika tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  return (
    <>
      <div 
        className="film-card-container cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        {/* AREA COVER / TRAILER - nempel di tepi atas card */}
        <div
          className="film-card-cover transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: posterImage ? `url(${posterImage})` : undefined }}
        />

        {/* BODY: title, credits, divider, badges, deskripsi */}
        <div className="film-card-body">
          {/* TITLE & CREDITS (DOP DIHAPUS) */}
          <div className="film-card-header">
            <h4 className="film-card-title">
              {title}
            </h4>
            <p className="film-card-credits">
              Director: <strong className="film-card-credits-bold">{director}</strong>
            </p>
          </div>

          {/* DIVIDER */}
          <div className="film-card-divider-line" />

          {/* TAGS BADGES (Hanya tampil jika ada isi dan bukan '-') */}
          <div className="film-card-tags-container">
            {time && time !== "-" && <span className="film-badge-time">{time}</span>}
            {genre && genre !== "-" && <span className="film-badge-genre">{genre}</span>}
            {age && age !== "-" && <span className="film-badge-age">{age}</span>}
            {duration && duration !== "-" && <span className="film-badge-duration">{duration}</span>}
          </div>

          {/* DESKRIPSI FILM (STATE ASLI TETAP line-clamp-2) */}
          {description && (
            <p className="film-card-desc">
              {description}
            </p>
          )}

          <span className="film-card-readmore-hint">
            Lihat sinopsis lengkap &rarr;
          </span>
        </div>
      </div>

      {/* POPUP MODAL KESELURUHAN SINOPSIS FILM */}
      {showModal && mounted && createPortal(
        <div 
          className="byfest-card-modal-backdrop" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div 
            className="byfest-card-modal-container" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup (X) */}
            <button
              type="button"
              className="byfest-card-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Tutup modal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Poster Film di Modal */}
            <div 
              className="byfest-card-modal-cover"
              style={{ backgroundImage: posterImage ? `url(${posterImage})` : undefined }}
            />

            {/* Konten Lengkap Film */}
            <div className="byfest-card-modal-body">
              <h3 className="byfest-card-modal-title">{title}</h3>
              
              <p className="byfest-card-modal-credits">
                Director: <strong className="text-white">{director}</strong>
              </p>

              <div className="film-card-divider-line my-1" />

              <div className="film-card-tags-container mb-1">
                {time && time !== "-" && <span className="film-badge-time">{time}</span>}
                {genre && genre !== "-" && <span className="film-badge-genre">{genre}</span>}
                {age && age !== "-" && <span className="film-badge-age">{age}</span>}
                {duration && duration !== "-" && <span className="film-badge-duration">{duration}</span>}
              </div>

              {/* Sinopsis Lengkap */}
              <div className="byfest-card-modal-desc-box">
                <div className="byfest-card-modal-desc-title">Sinopsis Lengkap</div>
                <p className="byfest-card-modal-desc-text">
                  {description}
                </p>
              </div>

              <button
                type="button"
                className="byfest-card-modal-btn-done"
                onClick={() => setShowModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}