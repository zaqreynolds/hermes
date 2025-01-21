import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import FlightSearchProviderWrapper from "@/context/FlightSearchProviderWrapper";
import Link from "next/link";

config.autoAddCss = false;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hermes",
  description: "Flight price tacking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // className="dark"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="flex flex-col items-center sm:items-start h-screen bg-opacity-90 overflow-hidden">
          <h1 className="flex flex-shrink-0 w-full h-20 text-left text-3xl font-bold px-4 mb-2 bg-background-alt shadow-sm items-center">
            Hermes
          </h1>
          <FlightSearchProviderWrapper> {children}</FlightSearchProviderWrapper>
        </main>
      </body>
    </html>
  );
}
