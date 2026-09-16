import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "./component/ThemeProvider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: "variable",
  axes: ["opsz"],
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

const BASE_URL = "https://sulemanaliasif.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Suleman Ali, Full-Stack Engineer",
    template: "%s · Suleman Ali",
  },
  description:
    "Full-stack engineer in Lahore, mostly backend: schedulers, queues, payment webhooks, data loaders and the APIs in front of them. Verid, Commodity Price API, TweetStorm.ai and Netus.ai at Jfreaks Software Solutions.",
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
  alternates: { canonical: "/" },

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Suleman Ali",
    title: "Suleman Ali, Full-Stack Engineer",
    description:
      "Backend systems, REST APIs, data pipelines, and payment integrations. Building production products at Jfreaks Software Solutions.",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Suleman Ali, full-stack engineer. Whole systems, one engineer." }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Suleman Ali, Full-Stack Engineer",
    images: ["/og.png"],
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
