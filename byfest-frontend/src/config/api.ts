/**
 * Konfigurasi Terpusat API & Media Assets Backend BYFEST
 *
 * File ini menstandarkan semua pemanggilan API dari frontend ke backend Express,
 * serta memastikan kompatibilitas format URL baik di localhost maupun Vercel production.
 */

// 1. Dapatkan base URL mentah dari env atau fallback ke localhost:5000
const rawUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "");

// 2. BACKEND_BASE_URL: Selalu berupa domain root tanpa akhiran "/api"
// Contoh: "https://byfest-backend.vercel.app" atau "http://localhost:5000"
export const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_ASSETS_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  rawUrl.replace(/\/api$/, "")
)
  .trim()
  .replace(/\/+$/, "");

// 3. API_BASE_URL: Selalu memiliki akhiran "/api"
// Contoh: "https://byfest-backend.vercel.app/api" atau "http://localhost:5000/api"
export const API_BASE_URL = `${rawUrl.replace(/\/api$/, "")}/api`;

/**
 * Helper untuk memformat URL gambar/media yang berasal dari database:
 * - Menangani URL eksternal (Cloudinary, http/https)
 * - Menangani path relatif lokal (uploads/...)
 * - Membersihkan backslash Windows (\) dan duplicate slash (//)
 */
export function formatImageUrl(
  imagePath?: string,
  fallback: string = "/images/poster-sample.jpg"
): string {
  if (!imagePath) return fallback;

  // Jika sudah merupakan URL absolut (misal dari Cloudinary)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Bersihkan path
  const cleanPath = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BACKEND_BASE_URL}/${cleanPath}`;
}
