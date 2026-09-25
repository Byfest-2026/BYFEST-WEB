import React from 'react';
import Link from 'next/link';

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

// URL Host Server Backend Express
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper Function: Mengubah path relatif (uploads/...) menjadi URL lengkap ke port 5000
const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Mengubah backslash Windows (\) menjadi slash (/) dan merapikan prefix
  const cleanPath = imagePath.replace(/\\/g, '/');
  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  return `${BACKEND_URL}${formattedPath}`;
};

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
  return (
    <div className="program-card">
      {/* Gambar Poster / Cover Program */}
      <div className="program-card-img-box">
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={title}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
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
          {runtime && <span className="badge-pill badge-runtime">{runtime}</span>}
        </div>

        {/* Tombol Aksi */}
        {isDetail ? (
          <Link
            href={`/ticketing?program=${id}`}
            className="program-btn-detail"
          >
            <span className="w-full h-full flex items-center justify-center text-white no-underline">
              Book Your Spot
            </span>
          </Link>
        ) : (
          <button
            type="button"
            className="program-btn-detail"
            onClick={onViewDetail}
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
  );
}