import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gebeya — Ethiopia's Shopping & Savings Super App",
  description: "Shop millions of products, compare prices, save money with AI, and pay your way — Ethiopia's most advanced shopping platform. Built for every Ethiopian.",
  keywords: ["Ethiopia shopping", "Gebeya", "Addis Ababa", "Telebirr", "Ethiopian commerce", "online shopping Ethiopia", "AI shopping assistant"],
  authors: [{ name: "Gebeya" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gebeya",
  },
  openGraph: {
    title: "Gebeya — Ethiopia's Shopping & Savings Super App",
    description: "Shop smart, save more. The premium shopping experience built for Ethiopia.",
    siteName: "Gebeya",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1a14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
