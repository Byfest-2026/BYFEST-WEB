  import Image from "next/image";


  export default function Hero() {
    return (
      <section className="hero-outer-wrapper">
        
        {/* Container Utama Poster */}
        <div className="hero-aspect-box">
          
          {/* 1a. Background Image Mobile (< 768px) */}
          <div className="hero-bg-wrapper block md:hidden">
            <Image
              src="/images/Background-Mobile.png"
              alt="Hero Background Mobile"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="hero-img-cover"
              priority
            />
          </div>

          {/* 1b. Background Image Desktop (>= 768px) */}
          <div className="hero-bg-wrapper hidden md:block">
            <Image
              src="/images/Background-Dekstop.png"
              alt="Hero Background Desktop"
              fill
              className="hero-img-cover"
              priority
            />
          </div>

          {/* 2. Title SVG */}
          <div className="hero-title-wrapper">
            <Image
              src="/images/Tittle.svg"
              alt="Brawijaya Film Festival 2026"
              fill
              className="hero-img-contain"
              priority
            />
          </div>

          {/* 3. Ribbon Tanggal Pink (Hapus/Komentari jika sudah ada di gambar background) */}
          <div className="hero-bubble-wrapper">
            <Image
              src="/images/Ribbon.svg"
              alt="30-31 OKT 1 NOV 2026 MALANG"
              fill
              className="hero-img-contain"
            />
          </div>

          {/* 4. Button Reserve Ticket */}
          <a href="/ticketing" className="hero-btn-reserve">
            Reserve your ticket now
          </a>

        </div>

        {/* 5. Strip Kuning Bawah */}
        <div className="hero-strip">
          + Scroll To Explore +
        </div>

      </section>
    );
  }