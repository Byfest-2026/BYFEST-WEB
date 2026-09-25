// src/byfest/Ticketing/components/BuyerInfoSection.tsx
"use client";

import React from "react";
import Image from "next/image";
import "./Ticketing.css";

export interface BuyerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface BuyerInfoSectionProps {
  formData: BuyerFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BuyerInfoSection({ formData, onChange }: BuyerInfoSectionProps) {
  return (
    <section className="byfest-buyer-info-section">
      <div className="byfest-buyer-header-wrapper">
        <Image
          src="/images/Header Section2.svg"
          alt="Buyer Information"
          width={354}
          height={32}
          priority
        />
      </div>

      <div className="byfest-buyer-form-card">
        <div className="byfest-buyer-field-group">
          <label className="byfest-buyer-label" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Name"
            value={formData.fullName}
            onChange={onChange}
            className="byfest-buyer-input"
            autoComplete="name"
          />
        </div>

        <div className="byfest-buyer-field-group">
          <label className="byfest-buyer-label" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            placeholder="08123456789"
            value={formData.phoneNumber}
            onChange={onChange}
            className="byfest-buyer-input"
            autoComplete="tel"
          />
        </div>

        <div className="byfest-buyer-field-group">
          <label className="byfest-buyer-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={onChange}
            className="byfest-buyer-input"
            autoComplete="email"
          />
        </div>

        <p className="byfest-buyer-privacy-note">
          *We value your privacy. Your details are encrypted, securely stored, and
          will only be used for ticketing purposes.
        </p>
      </div>
    </section>
  );
}