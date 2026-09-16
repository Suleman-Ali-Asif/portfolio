"use client";

import dynamic from "next/dynamic";

/**
 * Flat stand-in: the same laptop, drawn with dotted strokes so it is made of
 * full stops too. It holds the space before the scene chunk arrives and stays
 * put where WebGL is unavailable.
 */
function FlatLaptop() {
  return (
    <svg
      viewBox="0 0 120 80"
      aria-hidden="true"
      className="h-full w-full text-text"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeDasharray="0.01 3.2"
      opacity="0.75"
    >
      <rect x="18" y="6" width="84" height="47" rx="1" />
      <rect x="24" y="12" width="72" height="35" rx="1" opacity="0.5" />
      <path d="M18 53 L10 72 H110 L102 53" />
      <rect x="49" y="58" width="22" height="9" rx="1" opacity="0.5" />
    </svg>
  );
}

// three.js is worth a chunk of its own: the fold paints without it.
const DotLaptopScene = dynamic(() => import("./DotLaptopScene"), {
  ssr: false,
  loading: () => <FlatLaptop />,
});

/**
 * A laptop drawn entirely in full stops. Pointing at it magnifies the dots
 * under the cursor, dragging turns it.
 */
export default function DotLaptop({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <DotLaptopScene className="h-full w-full">
        <FlatLaptop />
      </DotLaptopScene>
    </div>
  );
}
