'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from "@/byfest/Navbar/Navbar";
import Footer from "@/byfest/Footer/Footer";

const TEASER_ITEMS = [
  {
    name: "Official Festival T-Shirt",
    category: "Apparel",
    desc: "Heavyweight Cotton 24s dengan sablon artwork resmi Brawijaya Film Festival 2026.",
    icon: (
      <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    name: "Heavy Canvas Tote Bag",
    category: "Bags & Accessories",
    desc: "Tas jinjing kanvas tebal dengan kantong dalam untuk membawa perlengkapan festival Anda.",
    icon: (
      <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    name: "Enamel Pin & Keychain Set",
    category: "Collectibles",
    desc: "Koleksi pin logam enamel berdetail halus dan gantungan kunci edisi terbatas Byfest 2026.",
    icon: (
      <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    name: "Festival Lanyard & Stickers Pack",
    category: "Souvenirs",
    desc: "Tali id card anyam premium bertekstur lembut plus 1 set stiker vinyl laminasi tahan air.",
    icon: (
      <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.386a4.896 4.896 0 001.378-1.272l3.486-4.532a2.25 2.25 0 00-.28-2.92L11.16 3.659A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
];

export default function MerchPage() {
  return (
    <main className="min-h-screen bg-[#070B10] text-white flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <Navbar />

      <div className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-24 flex-1 flex flex-col items-center justify-center">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-rose-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Badge & Heading */}
        <div className="text-center z-10 max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs md:text-sm font-semibold tracking-wider uppercase mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            Official Merchandise Store
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase mb-4 font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
            COMING SOON
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Koleksi merchandise resmi <strong>Brawijaya Film Festival 2026</strong> sedang dalam tahap produksi dan kurasi desain akhir. Segera hadir untuk melengkapi pengalaman festival film Anda!
          </p>
        </div>

        {/* Teaser Catalog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full z-10 mb-14">
          {TEASER_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02]"
            >
              <div>
                <div className="w-16 h-16 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-md bg-white/10 text-[10px] uppercase tracking-wider font-semibold text-gray-300 mb-2">
                  {item.category}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Status</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 text-[11px]">
                  Segera Hadir
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner & Back Buttons */}
        <div className="w-full max-w-2xl text-center z-10 p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 backdrop-blur-md">
          <p className="text-sm md:text-base text-gray-200 mb-6 font-medium">
            Ingin memesan lebih awal atau menjadi yang pertama tahu saat pre-order dibuka?
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/program"
              className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs md:text-sm hover:bg-gray-200 transition-all shadow-lg active:scale-95"
            >
              Jelajahi Jadwal Program &rarr;
            </Link>
            <Link
              href="/ticketing"
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs md:text-sm border border-white/20 transition-all active:scale-95"
            >
              Beli Tiket Nonton
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
