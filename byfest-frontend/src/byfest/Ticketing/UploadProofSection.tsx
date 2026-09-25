// src/byfest/Ticketing/components/UploadProofSection.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./Ticketing.css";

interface UploadProofSectionProps {
  fileName: string;
  fileError?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (file: File) => void;
}

export default function UploadProofSection({
  fileName,
  fileError,
  onFileChange,
  onFileDrop,
}: UploadProofSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <section className="byfest-upload-section">
      <div className="byfest-upload-header-wrapper">
        <Image
          src="/images/Header Section5.svg"
          alt="Upload Payment Proof"
          width={354}
          height={32}
          priority
        />
      </div>

      <div className="byfest-upload-form-card">
        <label
          className={`byfest-upload-dropzone ${isDragOver ? "is-drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={onFileChange}
            className="byfest-file-input-hidden"
          />
          <div className="byfest-upload-content-inner">
            <svg
              className="byfest-upload-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="byfest-upload-prompt-text">
              Click to upload or drag & drop your file here
            </span>
          </div>
        </label>

        <span className="byfest-upload-filename">{fileName || "No File Selected"}</span>

        {fileError && <p className="byfest-upload-error">{fileError}</p>}

        <p className="byfest-upload-formats">
          Accepted formats: JPG, JPEG, PNG, PDF · Maks. 5MB
        </p>
      </div>
    </section>
  );
}