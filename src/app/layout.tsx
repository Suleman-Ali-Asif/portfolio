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
        className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <CursorOrb />

        {children}
      </body>
    </html>
  );
}
