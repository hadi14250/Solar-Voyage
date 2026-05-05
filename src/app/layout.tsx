import type { Metadata, Viewport } from "next";
import { Reem_Kufi, Cairo } from "next/font/google";
import "./globals.css";

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solar Voyage | رحلة المجموعة الشمسية",
  description:
    "An interactive 3D solar system explorer featuring the UAE Hope Probe (مسبار الأمل). Journey through the planets in English and Arabic.",
  applicationName: "Solar Voyage",
  authors: [{ name: "Hadi Kaddoura" }],
  keywords: [
    "Solar System",
    "Three.js",
    "WebGL",
    "Hope Probe",
    "UAE",
    "Mars",
    "Education",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0F0F23",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${reemKufi.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
