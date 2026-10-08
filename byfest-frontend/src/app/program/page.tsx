'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "@/byfest/Navbar/Navbar";
import Footer from "@/byfest/Footer/Footer";
import ProgramFilter from "@/byfest/Program/ProgramFilter";
import ProgramCard from "@/byfest/Program/ProgramCard";
import FilmCard from "@/byfest/Program/FIlmCard";
import { API_BASE_URL, formatImageUrl } from "@/config/api";

export default function AllProgramPage() {
  const [activeFilter, setActiveFilter] = useState("All Programs");
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderSuccessBanner, setOrderSuccessBanner] = useState<boolean>(false);

  // DETEKSI REDIRECT SETELAH PEMBAYARAN TIKET
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("order_success") === "true") {
        setOrderSuccessBanner(true);
        window.history.replaceState({}, "", "/program");
      }
    }
  }, []);

  // FETCH DATA PROGRAM DARI BACKEND
  useEffect(() => {
    async function fetchBackendPrograms() {
      try {
        const res = await fetch(`${API_BASE_URL}/programs`);
        if (res.ok) {
          const result = await res.json();
          const data = Array.isArray(result) ? result : result.data || [];
          setPrograms(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data program dari backend:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBackendPrograms();
  }, []);
  

  // PERBAIKAN LOGIKA: Penentuan selectedProgram yang toleran terhadap Nama, ID, dan Indeks
  let selectedProgram: any = null;

  if (activeFilter === "All Programs") {
    // Saat "All Programs", selectedProgram harus null agar menampilkan semua card program
    selectedProgram = null;
  } else if (activeFilter.startsWith("Program ")) {
    const rawValue = activeFilter.replace("Program ", "").trim();
    const targetNumber = parseInt(rawValue, 10);

    // 1. Cari berdasarkan ID asli dari database terlebih dahulu (diubah ke String agar aman)
    const foundById = programs.find((p) => String(p.id) === String(rawValue));

    if (foundById) {
      selectedProgram = foundById;
    } else if (!isNaN(targetNumber)) {
      // 2. Jika ID tidak cocok, baru gunakan indeks array (1-based)
      const index = targetNumber - 1;
      if (programs[index]) {
        selectedProgram = programs[index];
      }
    }
  } else {
    // 3. Jika nilai activeFilter adalah Nama Program langsung (misal: "Main Competition")
    selectedProgram = programs.find(
      (p) => (p.name || p.title || "").toLowerCase() === activeFilter.toLowerCase()
    ) || null;
  }
  // Ambil daftar film (Mendukung alias 'films' huruf kecil maupun 'Films' huruf besar)
  const filmList = selectedProgram?.films || selectedProgram?.Films || [];

  // Helper menghitung total runtime program secara akurat dari DB atau selisih jam / durasi film
  const getProgramRuntime = (p: any, films: any[] = []) => {
    if (p?.runtime && p.runtime !== "-") return p.runtime;
    if (p?.total_time && p.total_time !== "-") return p.total_time;
    if (p?.duration && p.duration !== "-") return `${p.duration} Min`;
    if (p?.start_time && p.end_time) {
      const [sh, sm] = p.start_time.split(":").map(Number);
      const [eh, em] = p.end_time.split(":").map(Number);
      if (!isNaN(sh) && !isNaN(sm) && !isNaN(eh) && !isNaN(em)) {
        const diff = (eh * 60 + em) - (sh * 60 + sm);
        if (diff > 0) return `${diff} Min`;
      }
    }
    if (films && films.length > 0) {
      const sum = films.reduce((acc: number, f: any) => acc + (Number(f.duration) || 0), 0);
      if (sum > 0) return `${sum} Min`;
    }
    return "";
  };

  return (
    <main className="schedule-main">
      <Navbar />

      <div className="schedule-container">

        {/* Header Title */}
        <div className="schedule-header-wrapper">
          <img
            src="/images/Frame 41.svg"
            alt="Schedule Header"
            className="schedule-header-img"
          />
        </div>

        {/* NOTIFIKASI SUKSES PEMBAYARAN TIKET */}
        {orderSuccessBanner && (
          <div className="w-full max-w-3xl mx-auto my-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-2xl border border-emerald-300/40 flex items-start justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5 text-left">
                <h4 className="font-sans font-bold text-sm md:text-base text-white m-0">
                  Pembayaran Berhasil Dikonfirmasi!
                </h4>
                <p className="font-sans text-xs md:text-sm text-emerald-100 m-0 leading-relaxed">
                  Bukti pembayaran Anda sedang diverifikasi oleh panitia. 
                  <strong> Tiket resmi dan QR code akan otomatis dikirimkan melalui email Anda.</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOrderSuccessBanner(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              aria-label="Tutup notifikasi"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Filter Navigation */}
        <div className="program-filter-container">
          <ProgramFilter
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
          />
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Memuat data program...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Belum ada program yang tersedia saat ini.</p>
          </div>
        ) : (
          <>
            {/* CONDITION 1: ALL PROGRAMS */}
            {activeFilter === "All Programs" ? (
              <div className="cards-grid">
                {programs.map((prog, index) => {
                  const currentFilms = prog.films || prog.Films || [];

                  return (
                    <ProgramCard
                      key={prog.id}
                      id={prog.id}
                      title={prog.name || prog.title || ""}
                      description={prog.description || prog.desc || ""}
                      date={prog.date || ""}
                      time={prog.start_time ? `${prog.start_time} - ${prog.end_time}` : (prog.time || "")}
                      location={"Movie Room FIB A, Universitas Brawijaya"}
                      ageRating={prog.age_rating || prog.ageRating || ""}
                      totalFilms={
                        currentFilms.length > 0
                          ? `${currentFilms.length} Films`
                          : (prog.totalFilms ? `${prog.totalFilms} Films` : "-")
                      }
                      runtime={getProgramRuntime(prog, currentFilms)}
                      image={formatImageUrl(prog.image, "/images/poster-sample.jpg")}
                      isDetail={false}
                      onViewDetail={() => setActiveFilter(`Program ${index + 1}`)}
                    />
                  );
                })}
              </div>
            ) : (

              /* CONDITION 2: DETAIL PROGRAM & FILM CARDS */
              selectedProgram ? (
                <div className="detail-section">

                  <div className="detail-program-header">
                    <ProgramCard
                      id={selectedProgram.id}
                      title={selectedProgram.name || selectedProgram.title || ""}
                      description={selectedProgram.description || selectedProgram.desc || ""}
                      date={selectedProgram.date || ""}
                      time={
                        selectedProgram.start_time
                          ? `${selectedProgram.start_time} - ${selectedProgram.end_time || ""}`
                          : selectedProgram.time || ""
                      }
                      location={"Movie Room FIB A"}
                      ageRating={selectedProgram.ageRating || selectedProgram.age_rating || ""}
                      totalFilms={filmList.length}
                      runtime={getProgramRuntime(selectedProgram, filmList)}
                      image={formatImageUrl(selectedProgram.image, "/images/poster-sample.jpg")}
                      isDetail={true}
                    />
                  </div>

                  <div className="program-films-container">
                    <div className="film-divider">
                      <div className="film-divider-line"></div>
                      <span className="film-divider-text">
                        FILMS SCREENED IN {(selectedProgram.name || selectedProgram.title || "").toUpperCase()} ({filmList.length} FILMS)
                      </span>
                      <div className="film-divider-line"></div>
                    </div>

                    <div className="cards-grid detail-films-grid">
                      {filmList.length > 0 ? (
                        filmList.map((film: any) => {
                          const posterPath = film.poster_url || film.poster_image || film.posterImage || film.image;

                          return (
                            <FilmCard
                              key={film.id}
                              title={film.title}
                              director={film.director}
                              time={
                                film.time ||
                                (film.start_time
                                  ? `${film.start_time}${film.end_time ? ' - ' + film.end_time : ''}`
                                  : "")
                              }
                              genre={film.genre || ""}
                              age={film.age_rating || film.age || ""}
                              duration={film.duration ? `${film.duration} Min` : ""}
                              description={film.synopsis || film.description}
                              posterImage={formatImageUrl(posterPath, "/images/poster-sample.jpg")}
                            />
                          );
                        })
                      ) : (
                        <p className="text-gray-400 text-sm text-center col-span-full py-4">
                          Belum ada film terdaftar di program ini.
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                /* PERBAIKAN TAMPILAN JIKA PROGRAM BELUM ADA DI DATABASE */
                <div className="text-center py-16">
                  <p className="text-gray-400 text-base">Data untuk program ini belum tersedia di database.</p>
                </div>
              )
            )}
          </>
        )}

      </div>

      <Footer />
    </main>
  );
}
