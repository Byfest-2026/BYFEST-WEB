// src/byfest/Ticketing/components/QrisPaymentSection.tsx
"use client";

import React from "react";
import Image from "next/image";
import "./Ticketing.css";
export default function QrisPaymentSection() {
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
            src="https://res.cloudinary.com/rcroqsd5/image/upload/v1791467477/WhatsApp_Image_2026-10-08_at_20.48.05.jpg"
            alt="QRIS Code"
            width={160}
            height={160}
            className="byfest-qris-img"
          />
        </div>
        <p className="byfest-qris-instruction">
          Scan with GoPay, OVO, DANA, ShopeePay, or Mobile Banking
        </p>
      </div>
    </section>
  );
}
