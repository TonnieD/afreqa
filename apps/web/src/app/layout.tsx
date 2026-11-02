import type { Metadata, Viewport } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://afreqa.com";

export const viewport: Viewport = {
  themeColor: "#0B0504",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AFREQA — A Tomorrowland XP in Nairobi | Progressive EDM, Big Room, African Tech & Techno",
    template: "%s | AFREQA Nairobi",
  },
  description:
    "Official portal of AFREQA: A Tomorrowland XP in Nairobi. Dedicated to electronic festival culture: Progressive EDM, Big Room, African Tech, Techno, Hardstyle, Drum & Bass, and Dubstep. Discover official editions, lineups, HustleSasa tickets, and Spotify playlists.",
  keywords: [
    "AFREQA",
    "AFREQA Nairobi",
    "Tomorrowland XP Kenya",
    "Tomorrowland Experience Nairobi",
    "Progressive EDM Nairobi",
    "Big Room Kenya",
    "African Tech Nairobi",
    "Hard Techno Nairobi",
    "Hardstyle Kenya",
    "Drum and Bass Kenya",
    "Dubstep Kenya",
    "Nairobi Rave Culture",
    "HustleSasa Tickets AFREQA",
    "Tomorrowland Halloween XP",
    "Alloy Bar Lounge Nairobi",
    "Nairobi Railway Museum Rave",
  ],
  authors: [{ name: "Afreqa Nairobi" }],
  creator: "Afreqa",
  publisher: "Afreqa",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: baseUrl,
    siteName: "Afreqa Nairobi",
    title: "Afreqa — Kenya's Hub for Electronic Dance Music",
    description:
      "Official home for Afreqa EDM festivals, lineups, tickets, and after-movies in Nairobi, Kenya.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Afreqa Nairobi Festival Fantasy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Afreqa — Kenya's Hub for Electronic Dance Music",
    description:
      "Experience Kenya's premier EDM movement. Lineups, tickets, and after-movies.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/brand/logo.jpg",
    apple: "/brand/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased bg-afreqa-shadow text-afreqa-chrome-high">
        {children}
      </body>
    </html>
  );
}
