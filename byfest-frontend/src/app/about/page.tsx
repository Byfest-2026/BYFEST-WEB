import "@/byfest/About/about.css";
import Hero from "@/byfest/About/Hero";
import Navbar from "@/byfest/Navbar/Navbar";
import Footer from "@/byfest/Footer/Footer";
import AfterMovie from "@/byfest/About/AfterMovie";
import Vision from "@/byfest/About/Vision";
import Leads from "@/byfest/About/Leads";
import AwardsDoc from "@/byfest/About/AwardsDoc";

export default function AboutPage() {
    return (
        <div className="byfest-about-container">
            <Navbar />

            <main className="byfest-about-main">
                <Hero />
                <Vision />
                <Leads />
                <AwardsDoc />
            </main>

            <Footer />
        </div>
    );
}
