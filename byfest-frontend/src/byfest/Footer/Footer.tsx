"use client";
import "./footer.css";

import Image from "next/image";

// Icon Lokasi
const LocationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 10" fill="none" className="w-2.5 h-3 shrink-0">
    <path d="M4 4.75C3.62112 4.75 3.25776 4.6183 2.98985 4.38388C2.72194 4.14946 2.57143 3.83152 2.57143 3.5C2.57143 3.16848 2.72194 2.85054 2.98985 2.61612C3.25776 2.3817 3.62112 2.25 4 2.25C4.37888 2.25 4.74224 2.3817 5.01015 2.61612C5.27806 2.85054 5.42857 3.16848 5.42857 3.5C5.42857 3.66415 5.39162 3.8267 5.31983 3.97835C5.24804 4.13001 5.14281 4.26781 5.01015 4.38388C4.8775 4.49996 4.72001 4.59203 4.54669 4.65485C4.37337 4.71767 4.1876 4.75 4 4.75ZM4 0C2.93913 0 1.92172 0.368749 1.17157 1.02513C0.421427 1.6815 0 2.57174 0 3.5C0 6.125 4 10 4 10C4 10 8 6.125 8 3.5C8 2.57174 7.57857 1.6815 6.82843 1.02513C6.07828 0.368749 5.06087 0 4 0Z" fill="white"/>
  </svg>
);

// Icon Email
const MailIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8" fill="none" className="w-3 h-2.5 shrink-0">
    <path d="M9 0H1C0.45 0 0.005 0.45 0.005 1L0 7C0 7.55 0.45 8 1 8H9C9.55 8 10 7.55 10 7V1C10 0.45 9.55 0 9 0ZM9 2L5 4.5L1 2V1L5 3.5L9 1V2Z" fill="white"/>
  </svg>
);

// Icon Social Media (Instagram, TikTok, X, Youtube, LinkedIn)
const InstagramIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 md:w-4 md:h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="black"/>
  </svg>
);

const TikTokIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 md:w-4 md:h-4">
    <path d="M12.525 0h3.08c.27 1.838 1.201 3.28 2.87 4.225 1.102.624 2.333.918 3.525.96V8.29c-1.802 0-3.45-.515-4.87-1.498v8.667c0 4.388-3.562 7.95-7.95 7.95C4.79 23.409 1.228 19.847 1.228 15.46c0-4.388 3.562-7.95 7.952-7.95.44 0 .872.036 1.29.105v3.187c-.418-.124-.858-.192-1.29-.192-2.629 0-4.762 2.133-4.762 4.762 0 2.628 2.133 4.761 4.762 4.761 2.629 0 4.762-2.133 4.762-4.761V0z" fill="black"/>
  </svg>
);

const XIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 md:w-4 md:h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="black"/>
  </svg>
);

const YouTubeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 md:w-4 md:h-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="black"/>
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 md:w-4 md:h-4">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="black"/>
  </svg>
);

const ByfestLogo: React.FC = () => (
  <img 
    src="/images/Logo Byfest 2027.svg" 
    alt="Logo Byfest 2026" 
    className="w-[35px] h-[30px] md:w-[45px] md:h-[38px] object-contain shrink-0" 
  />
);

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content-wrapper">
        
        {/* Sub-frame 1: Logo */}
        <div className="footer-logo-frame">
          <ByfestLogo />
          <div className="footer-logo-text-group">
            <span className="footer-title">Brawijaya Film Festival 2026</span>
            <span className="footer-subtitle">Ejawantah</span>
          </div>
        </div>

        {/* Sub-frame 2: Kontak */}
        <div className="footer-kontak-frame">
          <span className="footer-kontak-title">Visit and contact us</span>
          <div className="footer-kontak-content">
            <div className="footer-kontak-icons">
              <LocationIcon />
              <MailIcon />
            </div>
            <div className="footer-kontak-text-group">
              <span className="footer-kontak-address">
                Gedung UKM Lantai 2, Universitas Brawijaya, Malang
              </span>
              <a
                href="mailto:brawijayamovieday.ub@gmail.com"
                className="footer-kontak-email"
              >
                brawijayamovieday.ub@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Sub-frame 3: Social Selection */}
        <div className="footer-social-frame">
          <span className="footer-social-title">Follow us</span>
          <div className="footer-social-row">
            <a href="#" className="footer-social-circle" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="footer-social-circle" aria-label="TikTok">
              <TikTokIcon />
            </a>
            <a href="#" className="footer-social-circle" aria-label="X">
              <XIcon />
            </a>
            <a href="#" className="footer-social-circle" aria-label="YouTube">
              <YouTubeIcon />
            </a>
            <a href="#" className="footer-social-circle" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
        </div>

      </div>

      {/* Sub-frame 4: Bottom */}
      <div className="footer-bottom-frame">
        <span>Powered by Zahwan • Raya • Uja • Farhan</span>
        <span>© 2026 Brawijaya Film Festival. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;