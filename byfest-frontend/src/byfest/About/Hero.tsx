import React from "react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="byfest-hero">
            <div className="byfest-hero-left">
                <div className="byfest-hero-badge">
                    <span className="byfest-hero-badge-text">
                        • 7 Years of Byfest Journey
                    </span>
                </div>

                <h1 className="byfest-hero-title">
                    BRAWIJAYA
                    <br />
                    FILM
                    <br className="byfest-hero-title-break" />{" "}
                    FESTIVAL
                </h1>

                <p className="byfest-hero-desc">
                    Brawijaya Film Festival adalah Perwujudan Kolektif dari semangat
                    sineas muda untuk mendobrak batas-batas konvensional yang lahir dari
                    sebuah manifestasi perubahan.
                </p>

                <Link href="/program" className="byfest-hero-btn">
                    <span className="byfest-hero-btn-text">Look Our Programs</span>
                </Link>
            </div>

            <article className="byfest-hero-right">
                <section className="byfest-aftermovie-card">
                    <div className="byfest-aftermovie-video">
                        <iframe
                            className="h-full w-full rounded-[7px]"
                            style={{
                                transform: "scale(1.15)",
                                transformOrigin: "center"
                            }}
                            src="https://www.instagram.com/reel/DQdZtMdEZgw/embed"
                            title="After Movie Byfest 2025"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            scrolling="no"
                            frameBorder="0"
                            loading="lazy"
                            allowFullScreen
                        />
                    </div>

                    <h2 className="byfest-aftermovie-title">
                        After Movie <strong>BYFEST 2025</strong>
                    </h2>
                </section>

                <div className="byfest-hero-aftermovie-content">
                    <h2 className="byfest-hero-theme-title">Theme</h2>
                    <p className="byfest-hero-theme-desc">
                        {/* Deskripsi tema */}
                    </p>
                </div>
            </article>
        </section>
    );
}
