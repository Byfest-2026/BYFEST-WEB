"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "@/byfest/Ticketing/Ticketing.css";
import Navbar from "@/byfest/Navbar/Navbar";
import Footer from "@/byfest/Footer/Footer";
import HeroHeaderSection from "@/byfest/Ticketing/HeroHeaderSection";
import TicketTypesSection, {
  TICKETS,
} from "@/byfest/Ticketing/TicketTypesSection";
import BuyerInfoSection from "@/byfest/Ticketing/BuyerInfoSection";
import OrderSummarySection from "@/byfest/Ticketing/OrderSummarySection";
import QrisPaymentSection from "@/byfest/Ticketing/QrisPaymentSection";
import UploadProofSection from "@/byfest/Ticketing/UploadProofSection";
import ConfirmPaymentSection from "@/byfest/Ticketing/ConfirmPaymentSectionProps";
import ConfirmationModal from "@/byfest/Ticketing/ConfirmationModal";
import ScrollToTop from "@/byfest/ScrollToTop/ScrollToTop";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (batas body Vercel Serverless ~4.5MB)
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
const MAX_QTY_PER_ITEM = 10; // samakan dengan MAX_QTY_PER_ITEM di backend
const REQUEST_TIMEOUT_MS = 45000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{9,15}$/;

// Base URL backend (tanpa "/api" dan tanpa "/" di akhir).
// Prioritas: env variable Vercel, cadangan: URL backend produksi.
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://byfest-backend.vercel.app"
)
  .replace(/\/+$/, "") // buang "/" di akhir
  .replace(/\/api$/, ""); // buang "/api" kalau terlanjur ada

type CheckoutResponse = {
  success?: boolean;
  message?: string;
};

function TicketingContent() {
  const searchParams = useSearchParams();

  const [ticketQty, setTicketQty] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  // SIMPAN OBJECT FILE UNTUK DIKIRIM VIA FORMDATA
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  // Guard double-submit (state saja bisa lolos kalau tap dua kali sangat cepat)
  const submittingRef = useRef(false);

  // Kalau datang dari tombol "Book Your Spot" di halaman Program (/ticketing?program=7)
  useEffect(() => {
    const programParam = searchParams.get("program");
    if (!programParam) return;

    const match = TICKETS.find((t) => t.id === programParam);
    if (match) {
      setTicketQty((prev) =>
        prev[programParam] ? prev : { ...prev, [programParam]: 1 }
      );
    }
  }, [searchParams]);

  const handleQtyChange = (id: string, qty: number) => {
    setTicketQty((prev) => ({
      ...prev,
      [id]: Math.min(MAX_QTY_PER_ITEM, Math.max(0, qty)),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateAndSetFile = (file: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError("Format file harus JPG, JPEG, PNG, atau PDF.");
      setFileName("");
      setPaymentProofFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Ukuran file maksimal 4MB.");
      setFileName("");
      setPaymentProofFile(null);
      return;
    }
    setFileError("");
    setFileName(file.name);
    setPaymentProofFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (file: File) => {
    validateAndSetFile(file);
  };

  const selectedTickets = TICKETS.filter((t) => (ticketQty[t.id] || 0) > 0).map((t) => ({
    ...t,
    qty: ticketQty[t.id],
  }));
  const selectedCount = selectedTickets.reduce((sum, t) => sum + t.qty, 0);
  // Total ini hanya untuk tampilan. Total yang dipakai tetap dihitung server.
  const totalAmount = selectedTickets.reduce((sum, t) => sum + t.qty * t.price, 0);

  const normalizedPhone = formData.phoneNumber.replace(/[\s\-()]/g, "");

  const isFormValid =
    selectedCount > 0 &&
    formData.fullName.trim() !== "" &&
    PHONE_RE.test(normalizedPhone) &&
    EMAIL_RE.test(formData.email.trim()) &&
    paymentProofFile !== null;

  const handleSubmit = async () => {
    if (!isFormValid || submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const payload = new FormData();
      payload.append("buyer_name", formData.fullName.trim());
      payload.append("phone", normalizedPhone);
      payload.append("email", formData.email.trim());
      // Hanya id & qty yang dikirim. Harga dan total dihitung di server.
      payload.append(
        "items",
        JSON.stringify(selectedTickets.map(({ id, qty }) => ({ id, qty })))
      );

      if (paymentProofFile) {
        // Harus 'payment_proof' sesuai Multer di backend
        payload.append("payment_proof", paymentProofFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/ticketing/checkout`, {
        method: "POST",
        body: payload,
        signal: controller.signal,
      });

      // Backend bisa membalas non-JSON (misalnya halaman error Vercel),
      // jadi parse dengan aman.
      let data: CheckoutResponse = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.success) {
        setShowModal(true); // Tampilkan ConfirmationModal
        return;
      }

      if (res.status === 413) {
        setSubmitError("File terlalu besar. Maksimal 4MB.");
      } else if (res.status >= 500 && !data.message) {
        setSubmitError(`Server sedang bermasalah (status ${res.status}). Coba lagi sebentar.`);
      } else {
        setSubmitError(data.message || "Terjadi kesalahan saat memesan tiket.");
      }
    } catch (err) {
      console.error("Gagal mengirim pesanan:", err, "URL:", API_BASE_URL);
      if (err instanceof DOMException && err.name === "AbortError") {
        setSubmitError(
          "Server terlalu lama merespons. Cek koneksi internet, lalu coba lagi."
        );
      } else {
        setSubmitError(
          "Tidak dapat menghubungi server. Periksa koneksi internet, lalu coba lagi."
        );
      }
    } finally {
      clearTimeout(timeoutId);
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setShowModal(false);
    setTicketQty({});
    setFormData({ fullName: "", phoneNumber: "", email: "" });
    setFileName("");
    setFileError("");
    setSubmitError("");
    setPaymentProofFile(null);
  };

  return (
    <div className="ticket-page-wrapper">
      <Navbar />

      <main className="ticket-container">
        <HeroHeaderSection />

        <TicketTypesSection quantities={ticketQty} onQtyChange={handleQtyChange} />

        <BuyerInfoSection formData={formData} onChange={handleInputChange} />

        <OrderSummarySection selectedTickets={selectedTickets} totalAmount={totalAmount} />

        <QrisPaymentSection />

        <UploadProofSection
          fileName={fileName}
          fileError={fileError}
          onFileChange={handleFileChange}
          onFileDrop={handleFileDrop}
        />

        {submitError && (
          <p
            role="alert"
            style={{
              color: "#ff6b6b",
              textAlign: "center",
              margin: "12px 0",
              fontSize: "14px",
            }}
          >
            {submitError}
          </p>
        )}

        <ConfirmPaymentSection
          disabled={!isFormValid || isSubmitting}
          onConfirm={handleSubmit}
        />

        <ScrollToTop />
      </main>

      <Footer />

      {showModal && (
        <ConfirmationModal
          selectedTickets={selectedTickets}
          totalAmount={totalAmount}
          onDone={handleDone}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Loading...</div>}>
      <TicketingContent />
    </Suspense>
  );
}
