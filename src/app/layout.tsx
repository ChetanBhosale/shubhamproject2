import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tozumlo Test — Emotional wellness companion",
    template: "%s · Tozumlo Test",
  },
  description:
    "Emotional wellness companion for everyday mental health. Journal, breathe, track your mood, and find calm.",
  applicationName: "Tozumlo Test",
  keywords: [
    "mental health",
    "wellness",
    "journal",
    "meditation",
    "mood tracking",
    "mindfulness",
    "Tozumlo Test",
  ],
  authors: [{ name: "Tozumlo Test" }],
  openGraph: {
    title: "Tozumlo Test — Emotional wellness companion",
    description:
      "Journal, breathe, track your mood, and find calm. A premium mental wellness companion.",
    type: "website",
    siteName: "Tozumlo Test",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tozumlo Test — Emotional wellness companion",
    description:
      "Journal, breathe, track your mood, and find calm.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F3EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0F2A38" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
