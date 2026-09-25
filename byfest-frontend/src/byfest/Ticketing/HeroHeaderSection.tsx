// src/byfest/Ticketing/components/HeroHeaderSection.tsx
import React from "react";
import Image from "next/image";
import "./Ticketing.css";

export default function HeroHeaderSection() {
  return (
    <section className="byfest-ticket-hero text-center pt-24 pb-8 px-4 text-white">
      {/* Judul utama menggunakan aset SVG atau teks bergaya khusus */}
      <div className="flex flex-col items-center justify-center w-full mb-4">
        <div className="byfest-hero-svg-wrapper px-2 flex justify-center">
          <Image
            src="/images/Header.svg"
            alt="Hi, Tuan & Nona Book Your Spot!"
            width={900}
            height={320}
            priority
            className="drop-shadow-full"
          />
        </div>
      </div>

      {/* Subtitle / Judul Festival */}
      <div className="flex justify-center items-center w-full mb-4">
        <div className="byfest-sub-svg-wrapper px-2 flex justify-center">
          <Image
            src="/images/BRAWIJAYA FILM FESTIVAL 2026 - EJAWANTAH.svg"
            alt="Brawijaya Film Festival 2026 - Ejawantah"
            width={800}
            height={160}
            className="drop-shadow-xl"
          />
        </div>
      </div>

      <p className="byfest-ticket-subtitle text-gray-100">
        Complete your registration in 5 simple steps below
      </p>
    </section>
  );
}