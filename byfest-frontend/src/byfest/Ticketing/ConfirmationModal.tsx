// src/byfest/Ticketing/components/ConfirmationModal.tsx
"use client";

import React from "react";
import "./Ticketing.css";
import { formatRupiah, type TicketOption } from "./TicketTypesSection";

interface SelectedTicket extends TicketOption {
  qty: number;
}

interface ConfirmationModalProps {
  selectedTickets: SelectedTicket[];
  totalAmount: number;
  onDone: () => void;
  buyerEmail?: string;
}

export default function ConfirmationModal({
  selectedTickets,
  totalAmount,
  onDone,
  buyerEmail,
}: ConfirmationModalProps) {
  // "ALL DAY PASS x1, PROGRAM 2 x1"
  const ticketTypeLabel = selectedTickets
    .map((t) => `${t.name.toUpperCase()} x${t.qty}`)
    .join(", ");

  return (
    <div className="byfest-modal-overlay" role="dialog" aria-modal="true">
      <div className="byfest-modal-card">
        <div className="byfest-modal-check-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 className="byfest-modal-title">Payment Submitted!</h3>
        <p className="byfest-modal-subtitle">
          Pembayaran Anda telah kami terima dan sedang diverifikasi.
        </p>

        {/* Keterangan Pengiriman Tiket Melalui Email */}
        <div className="byfest-modal-email-box">
          <div className="byfest-modal-email-header">
            <svg
              className="w-4 h-4 text-[#6024A9] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="byfest-modal-email-title">
              Tiket Dikirim via Email
            </span>
          </div>
          <p className="byfest-modal-email-desc">
            Tiket resmi dan bukti pemesanan akan otomatis dikirimkan ke{" "}
            <strong>{buyerEmail || "email Anda"}</strong> setelah verifikasi selesai.
          </p>
        </div>

        <div className="byfest-modal-details">
          <div className="byfest-modal-detail-row">
            <span className="byfest-modal-detail-label">Ticket Type</span>
            <span className="byfest-modal-detail-value">{ticketTypeLabel}</span>
          </div>
          <div className="byfest-modal-detail-row">
            <span className="byfest-modal-detail-label">Status</span>
            <span className="byfest-modal-detail-value byfest-modal-status">
              Verification in Progress
            </span>
          </div>
          <div className="byfest-modal-detail-row">
            <span className="byfest-modal-detail-label">Payment Method</span>
            <span className="byfest-modal-detail-value">QRIS</span>
          </div>
          <div className="byfest-modal-detail-row">
            <span className="byfest-modal-detail-label">Total Paid</span>
            <span className="byfest-modal-detail-value byfest-modal-amount">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>

        <button type="button" className="byfest-modal-done-btn" onClick={onDone}>
          Selesai & Ke Halaman Program &rarr;
        </button>
      </div>
    </div>
  );
}