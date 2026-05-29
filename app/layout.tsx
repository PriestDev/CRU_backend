import type { Metadata } from "next";
import { Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";

const webFont = Plus_Jakarta_Sans({
  variable: "--font-webFont",
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
    <html lang="en" className={`${webFont.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0" /> */}
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /> */}
      </head>
      <body className=" font-sans min-h-screen flex flex-col">
        <div className="hidden sm:flex min-h-screen items-center justify-center">
          Please view on mobile
        </div>
        <div className="sm:hidden">{children}</div>
      </body>
    </html>
  );
}
