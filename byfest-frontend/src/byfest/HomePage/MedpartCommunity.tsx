'use client';

import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000";

// 1. Ubah logo menjadi logo_url
interface PartnerItem {
  id: number;
  name: string;
  logo_url: string;
}

export const MedpartCommunity: React.FC = () => {
  const [medparts, setMedparts] = useState<PartnerItem[]>([]);
  const [communities, setCommunities] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await fetch(`${API_BASE_URL}/home`);
        if (res.ok) {
          const result = await res.json();
          const data = result.data || {};

          setMedparts(data.mediaPartners || []);
          setCommunities(data.communities || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data media partner & community:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  // 2. Perbaiki helper URL gambar
  const getLogoUrl = (logoPath: string) => {
    if (!logoPath) return "";
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) return logoPath;
    const cleanPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
    return `${BACKEND_BASE_URL}${cleanPath}`;
  };

  return (
    <section className="sponsor-container">
      <div className="partners-community-grid">
        {/* Kolom Media Partners */}
        <div className="partner-column">
          <div className="medpart-title-box">
            <img 
              src="/images/Media Partners.svg"
              alt="Media Partners Logo"
              className="medpart-title-img"
            />
          </div>
          <div className="circle-group-sm">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="circle-sm animate-pulse bg-gray-700" />
              ))
            ) : medparts.length > 0 ? (
              medparts.map((item) => (
                <div key={item.id} className="circle-sm overflow-hidden flex items-center justify-center" title={item.name}>
                  {/* 3. Gunakan item.logo_url */}
                  <img 
                    src={getLogoUrl(item.logo_url)} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-2">Belum ada Media Partner</p>
            )}
          </div>
        </div>

        {/* Kolom Community */}
        <div className="partner-column">
          <div className="community-title-box">
            <img
              src="/images/Community.svg"
              alt="Community Logo"
              className="community-title-img"
            />
          </div>
          <div className="circle-group-sm">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="circle-sm animate-pulse bg-gray-700" />
              ))
            ) : communities.length > 0 ? (
              communities.map((item) => (
                <div key={item.id} className="circle-sm overflow-hidden flex items-center justify-center" title={item.name}>
                  {/* 4. Gunakan item.logo_url */}
                  <img 
                    src={getLogoUrl(item.logo_url)} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-2">Belum ada Community</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedpartCommunity;