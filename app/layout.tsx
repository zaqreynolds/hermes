import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import FlightSearchProviderWrapper from "@/context/FlightSearchProviderWrapper";
import { ThemeProvider } from "./ThemeProvider";
import { Header } from "@/components/Header";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex flex-col items-center sm:items-start h-screen bg-opacity-90 overflow-hidden">
            <Header />
            <FlightSearchProviderWrapper>
              {children}
            </FlightSearchProviderWrapper>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
