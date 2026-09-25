'use client';

import { useState, useEffect } from 'react';
import Hero from "@/byfest/HomePage/Hero";
import Trailer from "@/byfest/HomePage/Trailer";
import ProgramCard from "@/byfest/Program/ProgramCard";
import Sponsors from "@/byfest/HomePage/Sponsors";
import Navbar from "@/byfest/Navbar/Navbar";
import ScrollToTop from "@/byfest/ScrollToTop/ScrollToTop";
import { useRouter } from 'next/navigation';
import Footer from "@/byfest/Footer/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Helper serba guna untuk merapikan URL gambar agar tidak terjadi double /uploads
function formatImageUrl(path?: string, defaultFallback: string = "/images/poster-sample.jpg"): string {
  if (!path) return defaultFallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Bersihkan slash ganda di awal jika ada
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  return `${BACKEND_BASE_URL}/${cleanPath}`;
}

export default function Home() {
  const router = useRouter();

  const [programs, setPrograms] = useState<any[]>([]);
  const [curators, setCurators] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState<boolean>(true);
  const [loadingCurators, setLoadingCurators] = useState<boolean>(true);

  useEffect(() => {
    // 1. Fetch Data Program
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
        setLoadingPrograms(false);
      }
    }

    // 2. Fetch Data Curators / Juri
    async function fetchBackendCurators() {
      try {
        const res = await fetch(`${API_BASE_URL}/home/curators`);
        if (res.ok) {
          const result = await res.json();
          const data = Array.isArray(result) ? result : result.data || [];
          setCurators(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data kurator dari backend:", error);
      } finally {
        setLoadingCurators(false);
      }
    }

    fetchBackendPrograms();
    fetchBackendCurators();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Trailer Section */}
      <Trailer />
      
      {/* 1. SECTION: PROGRAM */}
      <section className="program-section bg-[#1A051D]">
        <div className="program-container">
          <div className="program-header">
            <span className="program-subtitle">PROGRAM</span>
            <h2 className="program-title">DISCOVER OUR OFFICIAL PROGRAM</h2>
          </div>

          <div className="program-cards-scroll">
            {loadingPrograms ? (
              <p className="text-gray-400 text-sm py-8">Memuat data program...</p>
            ) : programs.length === 0 ? (
              <p className="text-gray-400 text-sm py-8">Belum ada program yang tersedia saat ini.</p>
            ) : (
              programs.map((prog) => {
                const currentFilms = prog.films || prog.Films || [];

                return (
                  <ProgramCard
                    key={prog.id}
                    id={prog.id}
                    title={prog.name || prog.title || ""}
                    description={prog.description || prog.desc || ""}
                    date={prog.date || ""}
                    time={prog.start_time ? `${prog.start_time} - ${prog.end_time}` : (prog.time || "")}
                    location={prog.location || "BYFEST Venue"}
                    ageRating={prog.age_rating || prog.ageRating || "13+"}
                    totalFilms={currentFilms.length > 0 ? currentFilms.length : (prog.totalFilms || "-")}
                    runtime={prog.runtime || "-"}
                    image={formatImageUrl(prog.image, "/images/poster-sample.jpg")}
                    isDetail={false}
                    onViewDetail={() => router.push(`/program`)}
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 2. SECTION: MEET THE CURATORS & JURI */}
      <section className="curator-section bg-[#090E14]">
        <h2 className="curator-title">MEET THE CURATORS & JURI</h2>
        <div className="curator-card-box">
          <div className="curator-grid">
            {loadingCurators ? (
              <p className="text-gray-400 text-sm py-8 col-span-full text-center">Memuat data kurator...</p>
            ) : curators.length === 0 ? (
              <p className="text-gray-400 text-sm py-8 col-span-full text-center">Belum ada data kurator saat ini.</p>
            ) : (
              curators.map((curator) => {
                // Utamakan atribut photo sesuai upload backend
                const avatarPath = curator.photo_url || curator.photo || curator.avatar || curator.image;

                return (
                  <div key={curator.id} className="curator-item">
                    <div className="curator-avatar-box">
                      <img 
                        src={formatImageUrl(avatarPath, "/images/default-avatar.png")} 
                        alt={curator.name || "Curator"} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="curator-name">{curator.name}</p>
                      {/* Tampilkan bio (fallback ke role/position jika bio kosong) */}
                      <p className="text-[10px] md:text-xs text-gray-300">
                        {curator.bio || curator.role || curator.position || "Curator"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 3. SECTION: SPONSORS & MEDIA PARTNER */}
      <div className="bg-[#090E14]">
        <Sponsors />
      </div>

      <ScrollToTop />
      <Footer />
    </main>
  );
}