import type { Metadata } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { StylieProvider } from "@/context/StylieContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["800"], // ExtraBold as requested
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600"], // SemiBold as requested for prices
  display: "swap",
});

export const metadata: Metadata = {
  title: "STYLIE — Wear Confidence | Premium Luxury Fashion",
  description: "Discover fashion that feels premium, comfortable, and made for everyone. Explore our curated collections of luxury apparel.",
  keywords: "fashion, luxury, ecommerce, style, stylie, premium clothing, designer wear",
  openGraph: {
    title: "STYLIE — Wear Confidence",
    description: "Discover fashion that feels premium, comfortable, and made for everyone.",
    url: "https://stylie-atelier.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-white text-brand-dark selection:bg-brand-orange selection:text-brand-white">
        <StylieProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </StylieProvider>
      </body>
    </html>
  );
}
