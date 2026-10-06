"use client";
import "./Homepage.css";
import React from "react";
import Image from "next/image";

interface TrailerProps {
  instagramEmbedUrl?: string;
}

export default function Trailer({ 
  instagramEmbedUrl = "https://www.instagram.com/reel/DQdZtMdEZgw/embed" 
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
            src="/images/Vector 2.svg" 
            alt="Mountain Left" 
            fill 
            className="trailer-img-fill" 
          />
        </div>

        {/* Gunung Kanan (172px x 268px) */}
        <div className="trailer-mountain-right">
          <Image 
            src="/images/Vector 1.svg" 
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
            {instagramEmbedUrl && (
              <iframe
                src={instagramEmbedUrl}
                title="BYFEST 2026 Instagram Reel"
                className="trailer-iframe"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                scrolling="no"
                frameBorder="0"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
