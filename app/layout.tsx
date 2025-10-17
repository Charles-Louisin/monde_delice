import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monde Délice - Gâteaux et Événements",
  description: "Découvrez nos créations de gâteaux artisanaux et nos services d'événements. Monde Délice vous accompagne pour vos moments spéciaux.",
  keywords: "gâteaux, événements, pâtisserie, artisan, créations, anniversaire, mariage",
  authors: [{ name: "Monde Délice" }],
  openGraph: {
    title: "Monde Délice - Gâteaux et Événements",
    description: "Découvrez nos créations de gâteaux artisanaux et nos services d'événements.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
