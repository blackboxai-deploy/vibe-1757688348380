import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mining Earnings App - USD",
  description: "Interactive mining app that shows real-time earnings in US Dollars for every digit mined",
  keywords: ["mining", "earnings", "USD", "dollars", "interactive", "game"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`}>
        {children}
      </body>
    </html>
  );
}