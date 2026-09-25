'use client';

import React, { useState, useEffect } from 'react';
import "./Homepage.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000";

// 1. Sesuaikan property key dengan model backend (logo_url)
interface PartnerItem {
  id: number;
  name: string;
  logo_url: string;
}

export const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<PartnerItem[]>([]);
  const [medparts, setMedparts] = useState<PartnerItem[]>([]);
  const [communities, setCommunities] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        // 2. Hubungkan ke endpoint gabungan GET /api/home
        const res = await fetch(`${API_BASE_URL}/home`);
        if (res.ok) {
          const result = await res.json();
          const data = result.data || {};

          // Ambil langsung dari object response
          setSponsors(data.sponsorships || []);
          setMedparts(data.mediaPartners || []);
          setCommunities(data.communities || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data sponsor & partner:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  // 3. Perbaiki Helper URL agar tidak terjadi bentrok double slash
  const getLogoUrl = (logoPath: string) => {
    if (!logoPath) return "";
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) return logoPath;
    const cleanPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
    return `${BACKEND_BASE_URL}${cleanPath}`;
  };

  // Duplikasi array jika sponsor sedikit (< 5) agar marquee tidak kosong di tengah
  const displaySponsors = sponsors.length > 0 && sponsors.length < 5
    ? Array(4).fill(sponsors).flat()
    : sponsors;

  return (
    <section className="sponsors-container">
      {/* Header Utama */}
      <div className="sponsors-header">
        <span className="supported-by">SUPPORTED BY</span>
        <h2 className="sponsors-title">SPONSORS</h2>
      </div>

      {/* Barisan Logo Sponsor Utama (Marquee Infinite Scroll) */}
      <div className="logo-marquee">
        <div className="marquee-track">
          {/* Kelompok Pertama */}
          <div className="marquee-group">
            {!loading && displaySponsors.length > 0 ? (
              displaySponsors.map((item, index) => (
                <div key={`${item.id}-${index}`} className="circle-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src={getLogoUrl(item.logo_url)} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))
            ) : (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="circle-lg" />)
            )}
          </div>

          {/* Duplikasi set untuk loop tanpa jeda */}
          <div className="marquee-group">
            {!loading && displaySponsors.length > 0 ? (
              displaySponsors.map((item, index) => (
                <div key={`dup-${item.id}-${index}`} className="circle-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src={getLogoUrl(item.logo_url)} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))
            ) : (
              Array.from({ length: 5 }).map((_, i) => <div key={`dup-${i}`} className="circle-lg" />)
            )}
          </div>
        </div>
      </div>

      {/* Bagian Media Partners & Community */}
      <div className="partners-community-grid">
        {/* Kolom Media Partners */}
        <div className="partner-column">
          <span className="partner-title">Media Partners</span>
          <div className="circle-group-sm">
            {medparts.length > 0 ? (
              medparts.map((item) => (
                <div key={item.id} className="circle-sm overflow-hidden" title={item.name}>
                  <img 
                    src={getLogoUrl(item.logo_url)} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="circle-sm" />)
            )}
          </div>
        </div>

        {/* Kolom Community */}
        <div className="partner-column">
          <span className="partner-title">Community</span>
          <div className="circle-group-sm">
            {communities.length > 0 ? (
              communities.map((item) => (
                <div key={item.id} className="circle-sm overflow-hidden" title={item.name}>
                  <img 
                    src={getLogoUrl(item.logo_url)} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="circle-sm" />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;