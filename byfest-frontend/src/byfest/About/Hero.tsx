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

                <button type="button" className="byfest-hero-btn">
                    <span className="byfest-hero-btn-text">Look Our Programs</span>
                </button>
            </div>

            <div className="byfest-hero-divider" aria-hidden="true" />

            <article className="byfest-hero-right">
                <div className="byfest-hero-aftermovie-placeholder">
                    <div className="byfest-hero-aftermovie-video">
                        <iframe
                            className="h-full w-full"
                            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                            title="After Movie Byfest 2025"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            loading="lazy"
                            allowFullScreen
                        />
                    </div>

                    <div className="byfest-hero-aftermovie-heading">
                        <span>After Movie</span>
                        <strong>Byfest 2025</strong>
                    </div>
                </div>

                <div className="byfest-hero-aftermovie-content">
                    <h2 className="byfest-hero-theme-title">Theme</h2>
                    <p className="byfest-hero-theme-desc">
                        DESCRIPTIONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN
                    </p>
                </div>
            </article>
        </section>
    );
}
