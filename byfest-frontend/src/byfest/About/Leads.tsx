'use client';

import React, { useState, useEffect } from 'react';

// URL dasar API dan Host Backend untuk gambar
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface LeadItem {
    id: number;
    name: string;
    division?: string; // ⬅️ Disesuaikan dengan model Lead.js backend
    role?: string;
    faculty?: string;
    photo_url?: string; // ⬅️ Disesuaikan dengan model Lead.js backend
    image?: string;
    photo?: string;
}

export default function Leads() {
    const [leads, setLeads] = useState<LeadItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchBackendLeads() {
            try {
                // 1. Memanggil endpoint /about (atau /about/leads jika kamu buatkan route khusus)
                const res = await fetch(`${API_BASE_URL}/about`);
                if (res.ok) {
                    const result = await res.json();
                    
                    // 2. Mengambil array leads dari result.data.leads
                    const data = result.data?.leads || (Array.isArray(result) ? result : []);
                    setLeads(data);
                }
            } catch (error) {
                console.error("Gagal mengambil data leads dari backend:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBackendLeads();
    }, []);

    // Helper untuk menangani URL gambar agar mengarah ke server Express
    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        
        // Memastikan ada tanda '/' di awal path
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    };

    return (
        <section className="byfest-leads">
            <div className="byfest-section-heading">
                <span className="byfest-leads-subtitle">PIC BYFEST 2026</span>
                <h2 className="byfest-leads-title">MEET THE LEADS</h2>
            </div>

            <div className="byfest-leads-scroll">
                {loading ? (
                    <p className="text-gray-400 text-sm py-8 text-center w-full">
                        Memuat data leads...
                    </p>
                ) : leads.length === 0 ? (
                    <p className="text-gray-400 text-sm py-8 text-center w-full">
                        Belum ada data leads saat ini.
                    </p>
                ) : (
                    leads.map((lead) => {
                        // 3. Fallback pencarian field divisi/role & photo_url
                        const leadRole = lead.division || lead.role || "Lead";
                        const imgPath = lead.photo_url || lead.image || lead.photo;
                        const imageUrl = getImageUrl(imgPath);

                        return (
                            <article key={lead.id} className="byfest-leads-card">
                                <div className="byfest-leads-img overflow-hidden">
                                    {imageUrl ? (
                                        <img 
                                            src={imageUrl} 
                                            alt={lead.name} 
                                            className="h-full w-full object-cover" 
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-[#D9D9D9]" />
                                    )}
                                </div>

                                <div className="byfest-leads-content">
                                    <span className="byfest-leads-tag">{leadRole}</span>
                                    <h3 className="byfest-leads-name">{lead.name}</h3>
                                    <p className="byfest-leads-faculty">{lead.faculty || '-'}</p>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}