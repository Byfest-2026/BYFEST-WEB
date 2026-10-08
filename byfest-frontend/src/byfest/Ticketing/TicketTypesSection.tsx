import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./Ticketing.css";
import { API_BASE_URL, formatImageUrl } from "@/config/api";

export interface TicketOption {
  id: string;
  name: string;
  /** Harga dalam angka murni (Rupiah), biar gampang dihitung total-nya */
  price: number;
}

// Sumber data tunggal untuk semua tiket + harganya.
export const TICKETS: TicketOption[] = [
  { id: "all-day", name: "All Day Pass", price: 100000 },
  { id: "program1", name: "Program 1", price: 35000 },
  { id: "program2", name: "Program 2", price: 35000 },
  { id: "program3", name: "Program 3", price: 35000 },
  { id: "program4", name: "Program 4", price: 35000 },
  { id: "program5", name: "Program 5", price: 35000 },
  { id: "program6", name: "Program 6", price: 0 },
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
  const [programMap, setProgramMap] = useState<Record<string, { image?: string; name?: string }>>({});

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await fetch(`${API_BASE_URL}/programs`);
        if (res.ok) {
          const result = await res.json();
          const list = Array.isArray(result) ? result : result.data || [];
          const mapping: Record<string, { image?: string; name?: string }> = {};
          list.forEach((p: any, idx: number) => {
            const numKey = `program${idx + 1}`;
            const idKey = `program${p.id}`;
            const item = { image: p.image, name: p.name || p.title };
            mapping[numKey] = item;
            mapping[idKey] = item;
          });
          setProgramMap(mapping);
        }
      } catch (err) {
        console.error("Gagal mengambil gambar program untuk tiket:", err);
      }
    }
    loadPrograms();
  }, []);

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
          const prog = programMap[ticket.id] || programMap[`program${ticket.id}`];
          const posterUrl = prog?.image
            ? formatImageUrl(prog.image)
            : ticket.id === "all-day"
            ? "/images/Logo Byfest 2026.svg"
            : null;
          const displayName = prog?.name ? `${ticket.name} (${prog.name})` : ticket.name;

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

                {/* Poster Thumbnail Program */}
                {posterUrl && (
                  <div className="w-[32px] h-[32px] rounded-[5px] overflow-hidden bg-black/40 border border-white/20 shrink-0 flex items-center justify-center">
                    <img
                      src={posterUrl}
                      alt={ticket.name}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className={`w-full h-full ${ticket.id === 'all-day' ? 'object-contain p-0.5' : 'object-cover'}`}
                    />
                  </div>
                )}

                <span className="byfest-ticket-name" title={displayName}>
                  {displayName}
                </span>
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
