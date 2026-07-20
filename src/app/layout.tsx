import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "@fontsource/noto-sans-ethiopic/400.css";
import "@fontsource/noto-sans-ethiopic/700.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollProgress } from "@/components/scroll-progress";
import { Providers } from "@/components/providers";

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
  title: "EthiopianMart — From Ethiopia, With Pride",
  description: "A trusted marketplace for Ethiopian products, independent sellers, and everyday shopping with secure checkout and nationwide delivery.",
  keywords: ["EthiopianMart", "Ethiopia marketplace", "Ethiopian products", "Addis Ababa shopping", "Telebirr", "local sellers"],
  authors: [{ name: "EthiopianMart" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EthiopianMart",
  },
  openGraph: {
    title: "EthiopianMart — From Ethiopia, With Pride",
    description: "Trusted Ethiopian products and everyday essentials from verified sellers.",
    siteName: "EthiopianMart",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F6EF" },
    { media: "(prefers-color-scheme: dark)", color: "#10271D" },
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground overflow-x-hidden"
      >
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ThemeProvider>
          <Providers>
            <ScrollProgress />
            {children}
            <Toaster />
            <SonnerToaster position="top-center" richColors toastOptions={{
              style: {
                borderRadius: "var(--radius-lg)",
                backdropFilter: "blur(20px)",
              },
            }} />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
