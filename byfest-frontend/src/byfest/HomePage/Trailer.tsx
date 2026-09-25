"use client";
import "./Homepage.css";
import React from "react";
import Image from "next/image";


interface TrailerProps {
  youtubeEmbedUrl?: string;
}

export default function Trailer({ 
  youtubeEmbedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ" 
}: TrailerProps) {
  return (
    <section className="trailer-section" id="trailer">
      {/* Background Grid */}
      <div className="trailer-grid-wrapper">
        <Image
          src="/images/Vector-Trailer.svg"
          alt="Grid Pattern"
          fill
          className="trailer-img-cover opacity-90"
          priority
        />
      </div>

      {/* Canvas Proposional 402x328 */}
      <div className="trailer-canvas">
        {/* Gunung Kiri (172px x 268px) */}
        <div className="trailer-mountain-left">
          <Image 
            src="/images/vector 2.svg" 
            alt="Mountain Left" 
            fill 
            className="trailer-img-fill" 
          />
        </div>

        {/* Gunung Kanan (172px x 268px) */}
        <div className="trailer-mountain-right">
          <Image 
            src="/images/vector 1.svg" 
            alt="Mountain Right" 
            fill 
            className="trailer-img-fill" 
          />
        </div>

        {/* Title BYFEST 2026 */}
        <div className="trailer-title-wrapper">
          <Image
            src="/images/Tittle-Trailer.svg"
            alt="BYFEST 2026 Official Trailer"
            fill
            className="trailer-img-contain"
            priority
          />
        </div>

        {/* Frame Video Player */}
        <div className="trailer-video-outer">
          <div className="trailer-video-box">
            {youtubeEmbedUrl && (
              <iframe
                src={`${youtubeEmbedUrl}?autoplay=0&rel=0`}
                title="BYFEST 2026 Official Trailer"
                className="trailer-iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}