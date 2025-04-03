import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

// Initialize mapboxgl token
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

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
