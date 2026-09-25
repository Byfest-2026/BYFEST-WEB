'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const UPLOADS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000/uploads";

interface WinnerItem {
    id: number | string;
    category: string;
    film: string;
    person?: string;
    instansi?: string;
    image?: string;
    photo?: string;
}

interface GalleryItem {
    id: number | string;
    media_url?: string;
}

export default function AwardsDoc() {
    const [winners, setWinners] = useState<WinnerItem[]>([]);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchBackendData() {
            try {
                const res = await fetch(`${API_BASE_URL}/about`, {
                    signal: controller.signal
                }); 
                
                if (res.ok) {
                    const result = await res.json();
                    
                    const winnersData = result.data?.winners || [];
                    setWinners(winnersData);

                    const galleryData = result.data?.gallery || [];
                    setGallery(galleryData);
                }
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error("Gagal mengambil data dari backend:", error);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchBackendData();

        return () => {
            controller.abort();
        };
    }, []);

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;

        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        
        if (cleanPath.startsWith('uploads/')) {
            const hostUrl = UPLOADS_BASE_URL.replace(/\/uploads\/?$/, '');
            return `${hostUrl}/${cleanPath}`;
        }

        return `${UPLOADS_BASE_URL}/${cleanPath}`;
    };

    return (
        <section className="byfest-awards">
            <div className="byfest-section-heading">
                <span className="byfest-awards-subtitle">
                    AWARDS &amp; DOCUMENTATION
                </span>
                <h2 className="byfest-awards-title">
                    WINNER LIST &amp; DOCUMENTATION
                </h2>
            </div>

            <div className="byfest-awards-content">
                {/* BAGIAN 1: DAFTAR PEMENANG (WINNERS) */}
                <div className="byfest-awards-list">
                    {loading ? (
                        <p className="text-gray-400 text-sm py-8 text-center">
                            Memuat daftar pemenang...
                        </p>
                    ) : winners.length === 0 ? (
                        <p className="text-gray-400 text-sm py-8 text-center">
                            Belum ada data pemenang saat ini.
                        </p>
                    ) : (
                        winners.map((winner, index) => {
                            const imgPath = winner.image || winner.photo;
                            const imageUrl = getImageUrl(imgPath);

                            return (
                                <article key={winner.id || index} className="byfest-winner-card">
                                    <div className="byfest-winner-img relative overflow-hidden bg-[#D9D9D9]">
                                        {imageUrl ? (
                                            <Image 
                                                src={imageUrl} 
                                                alt={winner.film || 'Poster Film'} 
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover" 
                                                unoptimized={process.env.NODE_ENV === 'development'}
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="byfest-winner-content">
                                        <div className="byfest-winner-headline">
                                            <span className="byfest-winner-category">
                                                {winner.category}
                                            </span>
                                            <h3 className="byfest-winner-film">{winner.film}</h3>
                                        </div>

                                        <div className="byfest-winner-divider" />

                                        <div className="byfest-winner-details">
                                            <p className="byfest-winner-person">{winner.person || '-'}</p>
                                            <p className="byfest-winner-instansi">{winner.instansi || '-'}</p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>

                <div className="byfest-awards-divider" aria-hidden="true" />

{/* BAGIAN 2: DOKUMENTASI GALERI (3 Baris Vertikal, Tanpa Stroke/Border) */}
<article className="byfest-doc-card w-full">
    <h3 className="byfest-doc-heading font-bold text-lg mb-4">
        BYFEST Documentation
    </h3>

    {/* Container tanpa border/stroke */}
    <div className="w-full flex flex-col gap-3">
        {loading ? (
            <p className="text-gray-400 text-sm py-8 text-center">Memuat galeri...</p>
        ) : gallery.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">Belum ada dokumentasi galeri.</p>
        ) : (
            gallery.slice(0, 3).map((docItem, index) => {
                const docImageUrl = getImageUrl(docItem.media_url);

                return (
                    <div 
                        key={docItem.id || index} 
                        /* px-3 memberikan jarak sedikit di sebelah kiri dan kanan */
                        className="w-full px-3"
                    >
                        <div className="relative w-full h-36 md:h-44 overflow-hidden rounded-lg bg-gray-200">
                            {docImageUrl ? (
                                <Image 
                                    src={docImageUrl} 
                                    alt="Dokumentasi BYFEST" 
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                    unoptimized={process.env.NODE_ENV === 'development'}
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>
                );
            })
        )}
    </div>
</article>
            </div>
        </section>
    );
}