import React from 'react';
import "./program.css";

interface FilmCardProps {
  title: string;
  director: string;
  dop?: string;
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
  dop = "Name",
  time = "Time",
  genre = "Genre",
  age = "Age",
  duration = "Duration",
  description = "Please add your content here. Keep it short and simple. And smile :)",
  posterImage,
}: FilmCardProps) {
  return (
    <div className="film-card-container">

      {/* AREA COVER / TRAILER - nempel di tepi atas card */}
      <div
        className="film-card-cover"
        style={{ backgroundImage: posterImage ? `url(${posterImage})` : undefined }}
      />

      {/* BODY: title, credits, divider, badges, deskripsi */}
      <div className="film-card-body">

        {/* TITLE & CREDITS */}
        <div className="film-card-header">
          <h4 className="film-card-title">
            {title}
          </h4>
          <p className="film-card-credits">
            Director: <strong className="film-card-credits-bold">{director}</strong>
            <span className="film-card-credits-divider">|</span>
            DOP: <strong className="film-card-credits-bold">{dop}</strong>
          </p>
        </div>

        {/* DIVIDER */}
        <div className="film-card-divider-line" />

        {/* TAGS BADGES */}
        <div className="film-card-tags-container">
          <span className="film-badge-time">{time}</span>
          <span className="film-badge-genre">{genre}</span>
          <span className="film-badge-age">{age}</span>
          <span className="film-badge-duration">{duration}</span>
        </div>

        {/* DESKRIPSI FILM */}
        {description && (
          <p className="film-card-desc">
            {description}
          </p>
        )}
      </div>

    </div>
  );
}