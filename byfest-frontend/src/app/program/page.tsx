'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "@/byfest/Navbar/Navbar";
import Footer from "@/byfest/Footer/Footer";
import ProgramFilter from "@/byfest/Program/ProgramFilter";
import ProgramCard from "@/byfest/Program/ProgramCard";
import FilmCard from "@/byfest/Program/FIlmCard";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

// Helper serba guna untuk merapikan URL gambar agar tidak terjadi double /uploads
function formatImageUrl(path?: string, defaultFallback: string = "/images/poster-sample.jpg"): string {
  if (!path) return defaultFallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Bersihkan slash ganda di awal jika ada
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  return `${BACKEND_BASE_URL}/${cleanPath}`;
}

export default function AllProgramPage() {
  const [activeFilter, setActiveFilter] = useState("All Programs");
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
                      time={prog.start_time ? `\({prog.start_time} -\){prog.end_time} || ""}` : (prog.time || "")}
                      location={"Movie Room FIB A, Universitas Brawijaya"}
                      ageRating={prog.age_rating || prog.ageRating || ""}
                      totalFilms={
                        currentFilms.length > 0
                          ? `${currentFilms.length} Films`
                          : (prog.totalFilms ? `${prog.totalFilms} Films` : "-")
                      }
                      runtime={prog.runtime || "-"}
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
                          ? `\({selectedProgram.start_time} -\){selectedProgram.end_time || ""}`
                          : selectedProgram.time || ""
                      }
                      location={"Movie Room FIB A"}
                      ageRating={selectedProgram.ageRating || selectedProgram.age_rating || ""}
                      totalFilms={filmList.length}
                      runtime={selectedProgram.runtime || "-"}
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
                              dop={film.dop || "-"}
                              time={film.start_time || film.time || "13:00"}
                              genre={film.genre || "Fiksi"}
                              age={film.age_rating || film.age || "-"}
                              duration={film.duration ? `${film.duration} Min` : "-"}
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
