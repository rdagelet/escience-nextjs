'use client';

import { Montserrat } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

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
        <title>eScience - Architects of Innovation</title>
        <meta name="description" content="Providing mobile solutions, CRM tools, inventory management, and custom software since 2000." />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html >
  );
}
