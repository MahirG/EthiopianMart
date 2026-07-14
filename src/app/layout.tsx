import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollProgress } from "@/components/scroll-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gulit.shop — Africa's Trusted Online Shopping Destination",
  description: "Shop millions of products with confidence. Fast delivery, secure payments, and the best prices. Gulit.shop makes online shopping simple, trusted, fast, and enjoyable for everyone.",
  keywords: ["Gulit.shop", "online shopping", "Africa shopping", "Ethiopia shopping", "Addis Ababa", "Telebirr", "e-commerce Africa", "AI shopping assistant"],
  authors: [{ name: "Gulit.shop" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gulit.shop",
  },
  openGraph: {
    title: "Gulit.shop — Africa's Trusted Online Shopping Destination",
    description: "Shop smart, save more. Simple, trusted, fast online shopping for everyone.",
    siteName: "Gulit.shop",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
  // Do NOT set maximumScale or user-scalable=false — iOS Safari ignores it
  // and Android Chrome mishandles it, causing the "bad zoom" effect on inputs.
  // Allow native pinch-zoom for accessibility (WCAG 1.4.4).
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ThemeProvider>
          <ScrollProgress />
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors toastOptions={{
            style: {
              borderRadius: "var(--radius-lg)",
              backdropFilter: "blur(20px)",
            },
          }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
