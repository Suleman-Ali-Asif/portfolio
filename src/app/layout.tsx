import type { Metadata } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google";
import CursorOrb from "./component/CursorOrb";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Suleman Ali — Full-Stack Engineer",
  description:
    "Full-stack software engineer specialising in APIs, data platforms, and scalable web systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <CursorOrb />

        {children}
      </body>
    </html>
  );
}
