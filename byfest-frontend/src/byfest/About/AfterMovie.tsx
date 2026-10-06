export default function AfterMovie() {
    return (
        <section className="byfest-aftermovie-card overflow-hidden">
            <div className="byfest-aftermovie-video relative w-full h-[320px] sm:h-[400px] overflow-hidden rounded-[12px]">
                <iframe
                    className="w-full h-full border-0 rounded-[12px] object-cover"
                    src="https://www.instagram.com/reel/DQdZtMdEZgw/embed"
                    title="After Movie Byfest 2025"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    scrolling="no"
                    frameBorder="0"
                    loading="lazy"
                    allowFullScreen
                />
            </div>

            <div className="p-4">
                <h2 className="byfest-aftermovie-title">
                    After Movie <strong>BYFEST 2025</strong>
                </h2>
            </div>
        </section>
    );
}
