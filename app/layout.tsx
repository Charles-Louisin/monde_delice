import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
