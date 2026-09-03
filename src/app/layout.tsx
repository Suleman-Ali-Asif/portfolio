import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "./component/ThemeProvider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["500", "600", "700"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

const BASE_URL = "https://suleman.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Suleman Ali — Full-Stack Engineer",
    template: "%s · Suleman Ali",
  },
  description:
    "Full-stack software engineer specialising in backend systems, REST APIs, data pipelines, and payment integrations. 3+ years building production products at Jfreaks Software Solutions.",
  keywords: [
    "Suleman Ali",
    "Full-Stack Engineer",
    "Backend Engineer",
    "Node.js",
    "Go",
    "Next.js",
    "REST API",
    "Software Engineer Pakistan",
    "Lahore",
  ],
  authors: [{ name: "Suleman Ali", url: BASE_URL }],
  creator: "Suleman Ali",

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Suleman Ali",
    title: "Suleman Ali — Full-Stack Engineer",
    description:
      "Backend systems, REST APIs, data pipelines, and payment integrations. Building production products at Jfreaks Software Solutions.",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "Suleman Ali — Full-Stack Engineer",
    description:
      "Backend systems, REST APIs, data pipelines, and payment integrations. Building production products at Jfreaks Software Solutions.",
    creator: "@sulemanaliasiif",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
        className={`${bricolage.variable} ${instrument.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
