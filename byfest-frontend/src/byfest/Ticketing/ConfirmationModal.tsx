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
}

export default function ConfirmationModal({
  selectedTickets,
  totalAmount,
  onDone,
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
          Payment received! We&apos;ll verify it shortly.
        </p>

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
          Done
        </button>
      </div>
    </div>
  );
}