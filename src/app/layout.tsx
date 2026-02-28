import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast"; 
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
  title: "AURIUM | UM Tagum College",
  description: "The Official Yearbook Portal of University of Mindanao Tagum College",
  icons: {
    icon: "/images/aurium-logo.png",
  },
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
        {/* Removed SmoothScroll wrapper for 100% instant response */}
        {children}
        
        {/* Gi-add ang Toaster dire para mogana ang pop-up bisan asa nga page */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}