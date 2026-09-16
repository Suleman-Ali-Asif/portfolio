import type { Metadata } from "next";
import Link from "next/link";
import Nav from "./component/Nav";
import Tile from "./component/Tile";
import { NAV } from "./utils/constants";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-bg text-text">
      <Nav />
      <main id="main" className="mx-auto max-w-[1440px] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
        <Tile pad="lg" className="min-h-[60vh]">
        <div className="max-w-[680px]">
          <p className="font-mono text-[12px] text-muted">404</p>
          <h1 className="mt-5 font-display text-[clamp(2rem,4vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-text">
            There is nothing at this address.
          </h1>
          <p className="mt-6 text-[16px] leading-[1.65] text-body">
            The page may have moved, or the link was mistyped. Everything on this
            site lives on one page.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
            <li>
              <Link href="/" className="link">Back to home</Link>
            </li>
            {NAV.filter((n) => n.id !== "about").map((n) => (
              <li key={n.id}>
                <Link href={`/#${n.id}`} className="link">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        </Tile>
      </main>
    </div>
  );
}
