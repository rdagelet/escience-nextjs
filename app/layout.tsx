'use client';

import { Montserrat } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navigation from "@/components/Navigation";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>eScience - Transforming the AI-Driven Enterprise</title>
        <meta name="description" content="AI-driven enterprise transformation powered by real-time data and intelligent automation. Enterprise mobile solutions since 2000." />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <SessionProvider>
          <Navigation />
          {children}
        </SessionProvider>
      </body>
    </html >
  );
}
