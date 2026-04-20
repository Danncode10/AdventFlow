import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { siteConfig } from "@/lib/config";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: `${siteConfig.name} — AI-Native Mission Hub for SDA`,
  description: "Secure hierarchy, financial transparency, and resource sharing for the Seventh-day Adventist Church. Built with Next.js and Supabase.",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — AI-Native Mission Hub for SDA`,
    description: "Secure hierarchy, financial transparency, and resource sharing for the Seventh-day Adventist Church.",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — AI-Native Mission Hub for SDA`,
    description: "Secure hierarchy, financial transparency, and resource sharing for the Seventh-day Adventist Church.",
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <QueryProvider>
          {children}
          <Toaster
            position="bottom-right"
            theme="system"
            richColors
            toastOptions={{
              className: "font-mono font-bold tracking-tight rounded-xl border border-border shadow-2xl",
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
