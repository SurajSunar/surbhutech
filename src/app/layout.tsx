import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SurbhuTech",
  description:
    "We architect intelligent systems that think, learn, and evolve. Transform your business with autonomous AI agents and cutting-edge technology.",
  keywords: [
    "SurbhuTech",
    "AI Firm Bhutan",
    "IT Company Bhutan",
    "Digital Platform for Innovative solution",
    "Best IT firm in Bhutan",
  ],
  authors: [{ name: "Surbhutech Team" }],
  icons: {
    icon: "https://surbhutech.vercel.app/sutbhutech_logo.png",
  },
  openGraph: {
    title: "SurbhuTech",
    description:
      "We architect intelligent systems that think, learn, and evolve. Transform your business with autonomous AI agents and cutting-edge technology.",
    url: "https://surbhutech.vercel.app",
    siteName: "surbhutech.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SurbhuTech",
    description: "IT firm based in Bhutan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
