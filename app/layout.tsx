import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AmadeusProvider } from "./AmadeusContext";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AmadeusProvider>
          <main className="flex flex-col items-center sm:items-start h-screen">
            {children}
          </main>
        </AmadeusProvider>
      </body>
    </html>
  );
}
