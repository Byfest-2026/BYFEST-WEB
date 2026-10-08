"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import "./program.css";

interface ProgramCardProps {
  id: string | number;
  title: string;
  description: string;
  curatorName?: string;
  date?: string;
  time?: string;
  location?: string;
  ageRating?: string;
  totalFilms?: string | number;
  runtime?: string;
  image?: string;
  isDetail?: boolean;
  onViewDetail?: () => void;
}

import { formatImageUrl } from "@/config/api";

const getImageUrl = (imagePath?: string) => formatImageUrl(imagePath, '');

export default function ProgramCard({
  id,
  title,
  description,
  curatorName,
  date,
  time,
  location,
  ageRating,
  totalFilms,
  runtime,
  image,
  isDetail = false,
  onViewDetail,
}: ProgramCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sinkronkan class body agar Navbar disembunyikan saat modal terbuka
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

  // Hitung displayRuntime secara cerdas jika belum ada atau bernilai '-'
  let displayRuntime = runtime && runtime !== "-" ? runtime : "";
  if (!displayRuntime && time) {
    const parts = time.split("-").map((t) => t.trim());
    if (parts.length === 2) {
      const parseMinutes = (tStr: string) => {
        const segs = tStr.split(":").map(Number);
        if (segs.length >= 2 && !isNaN(segs[0]) && !isNaN(segs[1])) {
          return segs[0] * 60 + segs[1];
        }
        return null;
      };
      const startMin = parseMinutes(parts[0]);
      const endMin = parseMinutes(parts[1]);
      if (startMin !== null && endMin !== null && endMin > startMin) {
        displayRuntime = `${endMin - startMin} Min`;
      }
    }
  }

  return (
    <>
      <div 
        className="program-card cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        {/* Gambar Poster / Cover Program */}
        <div className="program-card-img-box">
          {image ? (
            <img
              src={getImageUrl(image)}
              alt={title}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
              Program Cover
            </div>
          )}
        </div>

        {/* Detail Informasi Program */}
        <div className="program-card-body">
          <h3 className="program-card-name">{title}</h3>
          <p className="program-card-desc">{description}</p>
          <span className="program-card-readmore-hint">
            Lihat selengkapnya &rarr;
          </span>

          {/* List Tanggal, Jam, dan Lokasi */}
          <div className="program-info-list">
            {curatorName && (
              <div className="program-info-item pg-card-curator-box">
                <svg className="info-icon pg-card-curator-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Curator: {curatorName}</span>
              </div>
            )}
            {date && (
              <div className="program-info-item">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{date}</span>
              </div>
            )}
            {time && (
              <div className="program-info-item">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{time}</span>
              </div>
            )}
            {location && (
              <div className="program-info-item">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* Baris Badges */}
          <div className="program-badges-row">
            {ageRating && <span className="badge-pill badge-age">{ageRating}</span>}
            {totalFilms && <span className="badge-pill badge-films">{totalFilms}</span>}
            {displayRuntime && <span className="badge-pill badge-runtime">{displayRuntime}</span>}
          </div>

          {/* Tombol Aksi */}
          {isDetail ? (
            <Link
              href={`/ticketing?program=${id}`}
              className="program-btn-detail"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="w-full h-full flex items-center justify-center text-white no-underline">
                Book Your Spot
              </span>
            </Link>
          ) : (
            <button
              type="button"
              className="program-btn-detail"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail?.();
              }}
            >
              <span className="w-full h-full flex items-center justify-center text-white no-underline">
                View Detail &rarr;
              </span>
            </button>
          )}

          {/* Catatan Tiket */}
          <p className="program-ticket-note">
            ✓ 1 ticket covers all films in this program.
          </p>
        </div>
      </div>

      {/* POPUP MODAL KESELURUHAN DESKRIPSI PROGRAM */}
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

            {/* Gambar Banner Program */}
            <div className="byfest-card-modal-cover">
              {image ? (
                <img
                  src={getImageUrl(image)}
                  alt={title}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                  Program Cover
                </div>
              )}
            </div>

            {/* Isi Konten Lengkap */}
            <div className="byfest-card-modal-body">
              <h3 className="byfest-card-modal-title">{title}</h3>

              {/* Badges */}
              <div className="program-badges-row my-1">
                {ageRating && <span className="badge-pill badge-age">{ageRating}</span>}
                {totalFilms && <span className="badge-pill badge-films">{totalFilms}</span>}
                {displayRuntime && <span className="badge-pill badge-runtime">{displayRuntime}</span>}
              </div>

              {/* Info Jadwal & Lokasi */}
              <div className="program-info-list my-1">
                {curatorName && (
                  <div className="program-info-item">
                    <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Curator: <strong>{curatorName}</strong></span>
                  </div>
                )}
                {date && (
                  <div className="program-info-item">
                    <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{date}</span>
                  </div>
                )}
                {time && (
                  <div className="program-info-item">
                    <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{time}</span>
                  </div>
                )}
                {location && (
                  <div className="program-info-item">
                    <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{location}</span>
                  </div>
                )}
              </div>

              {/* Deskripsi Lengkap */}
              <div className="byfest-card-modal-desc-box">
                <div className="byfest-card-modal-desc-title">Deskripsi Lengkap Program</div>
                <p className="byfest-card-modal-desc-text">
                  {description}
                </p>
              </div>

              {/* Tombol Aksi di Modal */}
              <div className="flex flex-col gap-2 pt-2">
                {isDetail ? (
                  <Link
                    href={`/ticketing?program=${id}`}
                    className="program-btn-detail"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="w-full h-full flex items-center justify-center text-white no-underline font-bold">
                      Book Your Spot &rarr;
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="program-btn-detail"
                    onClick={() => {
                      setShowModal(false);
                      onViewDetail?.();
                    }}
                  >
                    <span className="w-full h-full flex items-center justify-center text-white no-underline font-bold">
                      Lihat Jadwal & Daftar Film &rarr;
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  className="byfest-card-modal-btn-done"
                  onClick={() => setShowModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}