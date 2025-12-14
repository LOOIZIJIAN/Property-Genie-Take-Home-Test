import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientThemeProvider from '@/components/ThemeProvider';
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
  title: "Property Search - Property Genie",
  description: "Find your perfect property with our advanced search and filtering system",
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
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
