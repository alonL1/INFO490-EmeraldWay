import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text, Nunito } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["700", "900"],
  display: "swap",
});

const libreCaslonText = Libre_Caslon_Text({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Concept Validation MVP",
  description: "Next.js implementation of the Concept Validation MVP landing page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable} ${libreCaslonText.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

