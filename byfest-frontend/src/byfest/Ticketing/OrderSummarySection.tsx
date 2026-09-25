// src/byfest/Ticketing/components/OrderSummarySection.tsx
"use client";

import React from "react";
import Image from "next/image";
import "./Ticketing.css";
import { formatRupiah, type TicketOption } from "./TicketTypesSection";

interface SelectedTicket extends TicketOption {
  qty: number;
}

interface OrderSummarySectionProps {
  selectedTickets: SelectedTicket[];
  totalAmount: number;
}

export default function OrderSummarySection({
  selectedTickets,
  totalAmount,
}: OrderSummarySectionProps) {
  return (
    <section className="byfest-order-summary-section">
      <div className="byfest-order-header-wrapper">
        <Image
          src="/images/Header Section3.svg"
          alt="Order Summary"
          width={354}
          height={32}
          priority
        />
      </div>

      <div className="byfest-order-form-card">
        {selectedTickets.length === 0 ? (
          <div className="byfest-order-row">
            <span className="byfest-order-label text-white/60">
              No ticket selected yet
            </span>
          </div>
        ) : (
          selectedTickets.map((ticket) => (
            <div className="byfest-order-row" key={ticket.id}>
              <span className="byfest-order-label">
                {ticket.name} (x{ticket.qty})
              </span>
              <span className="byfest-order-label">
                {formatRupiah(ticket.price * ticket.qty)}
              </span>
            </div>
          ))
        )}

        <div className="byfest-order-divider" />

        <div className="byfest-order-row">
          <span className="byfest-order-label">Total Amount</span>
          <span className="byfest-order-total-value">{formatRupiah(totalAmount)}</span>
        </div>
      </div>
    </section>
  );
}