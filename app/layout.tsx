import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const zentry = localFont({
  src: "./fonts/zentry-regular.woff2",
  variable: "--font-zentry-next",
});

const general = localFont({
  src: "./fonts/general.woff2",
  variable: "--font-general-next",
});

const circularweb = localFont({
  src: "./fonts/circularweb-book.woff2",
  variable: "--font-circularweb-next",
});

const robert = localFont({
  src: [
    {
      path: "./fonts/robert-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/robert-medium.woff2",
      weight: "500",
      style: "normal",
    }
  ],
  variable: "--font-robert-next",
});

export const metadata: Metadata = {
  title: "Zentry - Recreated",
  description: "A frontend portfolio project recreating a high-motion gaming experience with Next.js, TypeScript, Tailwind CSS, GSAP animations, responsive layouts, and interactive media.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${zentry.variable} ${general.variable} ${circularweb.variable} ${robert.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
