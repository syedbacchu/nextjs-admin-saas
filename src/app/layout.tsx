import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'sonner';
import AuthHydrator from "@/components/AuthHydrator";
import {GoogleAnalytics} from "@next/third-parties/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  // 1. CRITICAL FIX: This allows Next.js to find your images/icons
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://car.bmhbd.org'),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  title: {
    default: 'Admin',
    template: '%s | Admin',
  },
  description: 'Keep track of your games with ease, anytime, anywhere.',
  openGraph: {
    title: 'Admin',
    description: 'A comprehensive cricket scoring platform for live matches, tournaments, auctions and player stats.',
    url: 'https://Admin.com',
    siteName: 'Admin',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'Admin – Live Cricket Scoring',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admin',
    description: 'Track live cricket matches, tournaments and player stats.',
    images: ['/og/default.png'],
  },
};

export default function RootLayout({
   children,
 }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AuthHydrator />
      {children}
      <Toaster position="top-right" richColors />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "G-4TRSG32LSP"} />
      </html>
  );
}