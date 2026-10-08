import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppDataProvider } from "@/lib/app-data";
import { LocaleProvider } from "@/lib/i18n/locale";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intro QR",
  description:
    "Share interest-first intros via QR — offline-friendly, with Japanese and English UI.",
  appleWebApp: {
    capable: true,
    title: "Intro QR",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f7f7fb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          <LocaleProvider>
            <AppDataProvider>
              <AppShell>{children}</AppShell>
            </AppDataProvider>
          </LocaleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
