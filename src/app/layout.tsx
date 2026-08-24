import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import CartSidebar from "../components/CartSidebar";
import SmoothScroll from "../components/SmoothScroll";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "HERITAGE SENTINELS | Evidence-Aware Preservation Intelligence",
  description: "Flagship interactive dashboard for Smart India Hackathon 2026. Heritage Sentinel connects fragmented historical records, smartphone photogrammetry, and AI analysis to give India's monuments a digital memory.",
  keywords: [
    "Heritage Sentinel",
    "Smart India Hackathon 2026",
    "SIH 2026",
    "Heritage Preservation",
    "3D Reconstruction",
    "Computer Vision Cracks",
    "ASI Preservation",
    "Heritage Sentinels"
  ],
  openGraph: {
    title: "HERITAGE SENTINELS | Evidence-Aware Preservation Intelligence",
    description: "Flagship interactive dashboard for Smart India Hackathon 2026. Heritage Sentinel connects fragmented records and AI scans to prioritize conservation.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-sentinel-obsidian text-white selection:bg-sentinel-gold selection:text-black overflow-x-hidden relative">
        {/* Ambient Noise for premium museum-grade grain texture */}
        <div className="fixed inset-0 noise-overlay z-50 pointer-events-none" />
        
        <CartProvider>
          <SmoothScroll />
          <Navbar />
          <CartSidebar />
          <main className="flex-1 flex flex-col">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
