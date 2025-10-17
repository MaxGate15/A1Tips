import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "A1Tips - Premium Sports Betting Tips & Predictions",
  description: "Get the best sports betting tips and predictions with A1Tips. Join our VIP community for exclusive insights, winning strategies, and high-accuracy match predictions.",
  keywords: ["sports betting tips", "football predictions", "betting strategies", "VIP betting tips", "match predictions", "sports analysis"],
  authors: [{ name: "A1Tips" }],
  creator: "A1Tips",
  publisher: "A1Tips",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://a1-tips.vercel.app',
    title: 'A1Tips - Premium Sports Betting Tips & Predictions',
    description: 'Get the best sports betting tips and predictions with A1Tips. Join our VIP community for exclusive insights and winning strategies.',
    siteName: 'A1Tips',
    images: [
      {
        url: 'https://a1-tips.vercel.app/A1%20Tips%20hero.png',
        width: 1200,
        height: 630,
        alt: 'A1Tips - Premium Sports Betting Tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A1Tips - Premium Sports Betting Tips',
    description: 'Get the best sports betting tips and predictions with A1Tips. Join our VIP community for exclusive insights and winning strategies.',
    images: ['https://a1-tips.vercel.app/A1%20Tips%20hero.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
