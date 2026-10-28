import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Afreqa — Kenya's Hub for Electronic Dance Music",
  description: "Official home for Afreqa EDM festivals, lineups, tickets, and after-movies in Nairobi, Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0B0504] text-[#EDECEC] selection:bg-[#7B2FF7] selection:text-white">
        {children}
      </body>
    </html>
  );
}

