import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

// Initialize mapboxgl token
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = "pk.eyJ1IjoiZGthcm1haDEiLCJhIjoiY205MDhpMDNpMGp3MzJuc2k5aWdtb2RzaCJ9.ogW0y2fJwQxSPozD4eu-9Q";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Savannah Intel - Intelligence Platform",
  description: "Advanced intelligence platform for analysis and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 min-h-screen text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
