"use client";

import React, { useState, useEffect, Suspense } from "react";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  const [showModal, setShowModal] = useState(false);

  // Kalau datang dari tombol "Book Your Spot" di halaman Program (/ticketing?program=2)
  useEffect(() => {
    const programParam = searchParams.get("program");
    if (!programParam) return;

    const ticketId = `prog-${programParam}`;
    const match = TICKETS.find((t) => t.id === ticketId);
    if (match) {
      setTicketQty((prev) => (prev[ticketId] ? prev : { ...prev, [ticketId]: 1 }));
    }
  }, [searchParams]);

  const handleQtyChange = (id: string, qty: number) => {
    setTicketQty((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
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
      setFileError("Ukuran file maksimal 5MB.");
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
  const totalAmount = selectedTickets.reduce((sum, t) => sum + t.qty * t.price, 0);

  const isFormValid =
    selectedCount > 0 &&
    formData.fullName.trim() !== "" &&
    formData.phoneNumber.trim() !== "" &&
    formData.email.trim() !== "" &&
    paymentProofFile !== null;

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      // SESUAIKAN DENGAN FIELD DI CONTROLLER EXPRESS
      payload.append("buyer_name", formData.fullName);
      payload.append("phone", formData.phoneNumber);
      payload.append("email", formData.email);
      payload.append("items", JSON.stringify(selectedTickets));
      payload.append("total_amount", totalAmount.toString());

      if (paymentProofFile) {
        // Harus 'payment_proof' sesuai Multer di backend
        payload.append("payment_proof", paymentProofFile);
      }

      // Gunakan URL API Ticketing Checkout
      // Ubah konstanta API_BASE_URL (baris 21)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Di dalam fungsi handleSubmit, pastikan panggilannya seperti ini:
      const res = await fetch(`${API_BASE_URL}/api/ticketing/checkout`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setShowModal(true); // Tampilkan ConfirmationModal.tsx
      } else {
        alert(`Gagal memesan tiket: ${data.message || "Terjadi kesalahan"}`);
      }
    } catch (err) {
      console.error("Gagal mengirim pesanan:", err);
      alert("Gagal terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setShowModal(false);
    setTicketQty({});
    setFormData({ fullName: "", phoneNumber: "", email: "" });
    setFileName("");
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