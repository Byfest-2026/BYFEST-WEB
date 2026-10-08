// src/byfest/Ticketing/components/QrisPaymentSection.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./Ticketing.css";

const QRIS_IMAGE_URL = "https://res.cloudinary.com/rcroqsd5/image/upload/v1791467477/WhatsApp_Image_2026-10-08_at_20.48.05.jpg";

export default function QrisPaymentSection() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(QRIS_IMAGE_URL);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "QRIS-BYFEST-2026.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(QRIS_IMAGE_URL, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="byfest-qris-section">
      <div className="byfest-qris-header-wrapper">
        <Image
          src="/images/Header Section4.svg"
          alt="QRIS Payment"
          width={354}
          height={32}
          priority
        />
      </div>

      <div className="byfest-qris-form-card">
        <div className="byfest-qris-image-wrapper">
          <Image
            src={QRIS_IMAGE_URL}
            alt="QRIS Code"
            width={160}
            height={160}
            className="byfest-qris-img"
          />
        </div>

        {/* Tombol Unduh QRIS */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="byfest-qris-download-btn"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>{downloading ? "Mengunduh..." : "Download QRIS"}</span>
        </button>

        <p className="byfest-qris-instruction">
          Scan with GoPay, OVO, DANA, ShopeePay, or Mobile Banking
        </p>
      </div>
    </section>
  );
}
