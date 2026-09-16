import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * Tile — one cell of the bento grid: a filled, generously rounded panel on the
 * page ground. No border, no shadow. `inverted` swaps to ink on paper (or paper
 * on ink in dark mode) for the single call-to-action tile. `interactive` tiles
 * shift their fill on hover and are meant to be rendered as <button> or <a>.
 *
 * Bento — the 12-column section grid. One column below `sm`, six from `sm`,
 * twelve from `lg`.
 */

type TileOwnProps<T extends ElementType> = {
  as?: T;
  interactive?: boolean;
  inverted?: boolean;
  /** md: 24/28px (default), sm: 20/24px, lg: 32/40/56px, none: caller pads */
  pad?: "md" | "sm" | "lg" | "none";
  className?: string;
  children: ReactNode;
};

type TileProps<T extends ElementType> = TileOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TileOwnProps<T>>;

export const TILE_RADIUS = "rounded-[22px]";

const BASE = `relative flex h-full min-w-0 flex-col ${TILE_RADIUS} text-left`;
const PAD = {
  md: "p-6 sm:p-7",
  sm: "p-5 sm:p-6",
  lg: "p-6 sm:p-10 lg:p-14",
  none: "",
};
const PLAIN = "bg-surface text-text";
const INVERTED = "bg-text text-bg";
const INTERACTIVE_PLAIN =
  "group/tile cursor-pointer transition-[background-color,opacity] duration-200 hover:bg-surface-2 active:opacity-80";
const INTERACTIVE_INVERTED =
  "group/tile cursor-pointer transition-opacity duration-200 hover:opacity-90 active:opacity-80";

export default function Tile<T extends ElementType = "div">({
  as,
  interactive = false,
  inverted = false,
  pad = "md",
  className = "",
  children,
  ...rest
}: TileProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const skin = inverted ? INVERTED : PLAIN;
  const hover = interactive ? (inverted ? INTERACTIVE_INVERTED : INTERACTIVE_PLAIN) : "";
  return (
    <Component className={`${BASE} ${PAD[pad]} ${skin} ${hover} ${className}`} {...rest}>
      {children}
    </Component>
  );
}

export function Bento({
  as: Component = "div",
  className = "",
  children,
}: {
  as?: "div" | "ul" | "ol" | "dl";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Component className={`grid grid-cols-1 gap-3 sm:grid-cols-6 sm:gap-4 lg:grid-cols-12 ${className}`}>
      {children}
    </Component>
  );
}
