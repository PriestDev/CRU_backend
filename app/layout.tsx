import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Ride",
  description:
    "Seamless ride booking, package delivery, and carpooling for uniport campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className=" font-sans min-h-screen flex flex-col">
        <div className="hidden sm:flex min-h-screen items-center justify-center">Please view on mobile</div>
        <div className="sm:hidden">{children}</div>
      </body>
    </html>
  );
}
