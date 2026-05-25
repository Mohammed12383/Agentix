import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const heading = Playfair_Display({ variable: "--font-heading", subsets: ["latin"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kingdom Architect",
  description: "Premium subscription SaaS platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
