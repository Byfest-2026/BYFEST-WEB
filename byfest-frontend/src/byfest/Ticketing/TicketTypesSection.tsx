// src/byfest/Ticketing/components/TicketTypesSection.tsx
"use client";

import React from "react";
import Image from "next/image";
import "./Ticketing.css";

export interface TicketOption {
  id: string;
  name: string;
  /** Harga dalam angka murni (Rupiah), biar gampang dihitung total-nya */
  price: number;
}

// Sumber data tunggal untuk semua tiket + harganya.
// Diimpor juga oleh page.tsx (buat hitung total & pre-select dari query param)
// dan OrderSummarySection (buat format angka).
export const TICKETS: TicketOption[] = [
  { id: "all-day", name: "All Day Pass", price: 120000 },
  { id: "2", name: "Program 1", price: 35000 },
  { id: "3", name: "Program 2", price: 35000 },
  { id: "4", name: "Program 3", price: 0 },
  { id: "prog-4", name: "Program 4", price: 35000 },
  { id: "prog-5", name: "Program 5", price: 35000 },
  { id: "prog-6", name: "Program 6", price: 35000 },
];

export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
    .trim();

interface TicketTypesSectionProps {
  /** qty per ticket id, contoh: { "all-day": 1, "prog-2": 2 } */
  quantities: Record<string, number>;
  onQtyChange: (id: string, qty: number) => void;
}

export default function TicketTypesSection({
  quantities,
  onQtyChange,
}: TicketTypesSectionProps) {
  const handleToggleCheckbox = (id: string, currentQty: number) => {
    // Klik checkbox/nama tiket: toggle antara 0 (tidak dipilih) dan 1
    onQtyChange(id, currentQty > 0 ? 0 : 1);
  };

  const handleDecrement = (id: string, currentQty: number) => {
    onQtyChange(id, Math.max(0, currentQty - 1));
  };

  const handleIncrement = (id: string, currentQty: number) => {
    onQtyChange(id, currentQty + 1);
  };

  return (
    <section className="byfest-ticket-types-section">
      <div className="byfest-ticket-header-wrapper">
        <Image
          src="/images/Header Section.svg"
          alt="Types of Tickets"
          width={354}
          height={32}
          priority
        />
      </div>

      <div className="byfest-ticket-list">
        {TICKETS.map((ticket) => {
          const qty = quantities[ticket.id] || 0;
          const isSelected = qty > 0;

          return (
            <div
              key={ticket.id}
              className={`byfest-ticket-card ${isSelected ? "selected" : ""}`}
            >
              <button
                type="button"
                className="byfest-ticket-content-left"
                onClick={() => handleToggleCheckbox(ticket.id, qty)}
              >
                <span className="byfest-ticket-checkbox">
                  {isSelected && <span className="byfest-ticket-checkbox-inner" />}
                </span>
                <span className="byfest-ticket-name">{ticket.name}</span>
              </button>

              <div className="byfest-ticket-right">
                <span className="byfest-ticket-price">
                  {isSelected ? formatRupiah(ticket.price) : "Rp"}
                </span>

                <div className="byfest-ticket-counter-wrapper">
                  <button
                    type="button"
                    className="byfest-order-count-btn"
                    onClick={() => handleDecrement(ticket.id, qty)}
                    aria-label={`Kurangi jumlah ${ticket.name}`}
                  >
                    <span>-</span>
                  </button>
                  <span className="byfest-order-count-value">{qty}</span>
                  <button
                    type="button"
                    className="byfest-order-count-btn"
                    onClick={() => handleIncrement(ticket.id, qty)}
                    aria-label={`Tambah jumlah ${ticket.name}`}
                  >
                    <span>+</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}