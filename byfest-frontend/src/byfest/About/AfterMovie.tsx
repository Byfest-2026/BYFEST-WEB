export default function AfterMovie() {
    return (
        <section className="byfest-aftermovie-card">
            <h2 className="byfest-aftermovie-title">
                After Movie <strong>BYFEST 2025</strong>
            </h2>

            <div className="byfest-aftermovie-video">
                <iframe
                    className="h-full w-full rounded-[7px]"
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                    title="After Movie Byfest 2025"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                    allowFullScreen
                />
            </div>
        </section>
    );
}
