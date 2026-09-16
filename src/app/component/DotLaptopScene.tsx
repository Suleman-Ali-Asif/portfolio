"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

/* ── The laptop ───────────────────────────────────────────────────────────────
   Nothing but full stops on a grid, the way you would type it out: an open
   laptop is two flat fields of dots, the deck lying away from you and the lid
   hinged up off its back edge. Shapes are drawn by how bright each dot is,
   never by moving it, so the grid stays perfectly regular. */

const HALF_W = 1.7; // half the width of both fields
const DECK_D = 2.05; // front edge (z = 0) back to the hinge
const LID_H = 2.15;
const LID_TILT = MathUtils.degToRad(78); // how far the lid is opened back
const STEP = 0.075; // grid pitch
const DOT = 0.034; // a dot's width in world units

type Rect = { x0: number; x1: number; d0: number; d1: number };
const has = (x: number, d: number, r: Rect) => x >= r.x0 && x <= r.x1 && d >= r.d0 && d <= r.d1;
const shrink = (r: Rect, m: number): Rect => ({
  x0: r.x0 + m,
  x1: r.x1 - m,
  d0: r.d0 + m,
  d1: r.d1 - m,
});
/** Bright on the rim of a shape, quieter inside it. */
const edged = (x: number, d: number, r: Rect, rim: number, inner: number) =>
  has(x, d, shrink(r, STEP * 1.2)) ? inner : rim;

const DECK: Rect = { x0: -HALF_W, x1: HALF_W, d0: 0, d1: DECK_D };
const KEYS: Rect = { x0: -1.44, x1: 1.44, d0: 0.74, d1: 1.9 };
const PAD: Rect = { x0: -0.52, x1: 0.52, d0: 0.14, d1: 0.58 };
const LID: Rect = { x0: -HALF_W, x1: HALF_W, d0: 0, d1: LID_H };
const SCREEN: Rect = { x0: -HALF_W + 0.17, x1: HALF_W - 0.17, d0: 0.23, d1: LID_H - 0.17 };

function deckAlpha(x: number, d: number): number {
  if (!has(x, d, shrink(DECK, STEP * 0.9))) return 0.95; // the deck's own outline
  if (has(x, d, KEYS)) return edged(x, d, KEYS, 0.9, 0.58);
  if (has(x, d, PAD)) return edged(x, d, PAD, 0.9, 0.5);
  return 0.28; // bare deck
}

/* Words hidden in the screen's dot field, lit up only while the pointer is on
   the screen itself. Five letters is the whole alphabet this needs, so they are
   spelled out as 5x5 bitmaps and laid straight onto the same grid: no extra
   dots, nothing to line up. */
const GLYPHS: Record<string, string[]> = {
  V: ["10001", "10001", "10001", "01010", "00100"],
  I: ["11111", "00100", "00100", "00100", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001"],
  C: ["01110", "10001", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "11110"],
};
const LINES = ["VINI", "VIDI", "VICI"];
const TEXT_COL0 = 10; // grid column the first letter starts on
const TEXT_ROW_TOP = 25; // grid row of the top line, counting up the lid
const CELL_W = 7; // 5 for the letter, 2 of air
const CELL_H = 8; // 5 for the letter, 3 of air

/** Is the dot at grid cell (i, j) part of a letter? */
function lidText(i: number, j: number): boolean {
  const col = i - TEXT_COL0;
  const row = TEXT_ROW_TOP - j;
  if (col < 0 || row < 0) return false;
  const line = LINES[Math.floor(row / CELL_H)];
  const rowIn = row % CELL_H;
  const ch = Math.floor(col / CELL_W);
  const colIn = col % CELL_W;
  if (!line || rowIn > 4 || colIn > 4 || ch >= line.length) return false;
  return GLYPHS[line[ch]][rowIn][colIn] === "1";
}

function lidAlpha(x: number, d: number): number {
  if (Math.abs(x) < STEP * 0.6 && Math.abs(d - (LID_H - 0.1)) < STEP * 0.6) return 1; // camera
  if (!has(x, d, shrink(LID, STEP * 0.9))) return 0.95; // lid outline, hinge included
  if (has(x, d, SCREEN)) return edged(x, d, SCREEN, 0.8, 0.29);
  return 0.55; // bezel
}

function buildLaptop() {
  const xyz: number[] = [];
  const alpha: number[] = [];
  const text: number[] = [];
  const add = (x: number, y: number, z: number, a: number, t = 0) => {
    xyz.push(x, y, z);
    alpha.push(a);
    text.push(t);
  };

  const cols = Math.round((HALF_W * 2) / STEP);
  const deckRows = Math.round(DECK_D / STEP);
  const lidRows = Math.round(LID_H / STEP);
  const upY = Math.sin(LID_TILT);
  const upZ = -Math.cos(LID_TILT);

  for (let i = 0; i <= cols; i++) {
    const x = -HALF_W + i * STEP;
    for (let j = 0; j <= deckRows; j++) {
      const d = j * STEP; // back from the front edge
      add(x, 0, -d, deckAlpha(x, d));
    }
    for (let j = 0; j <= lidRows; j++) {
      const h = j * STEP; // up from the hinge
      // 1 marks a letter, 0.5 the rest of the screen it hides in: the field
      // steps back as the letters come up, or they would not read.
      const role = lidText(i, j) ? 1 : has(x, h, SCREEN) ? 0.5 : 0;
      add(x, upY * h, -DECK_D + upZ * h, lidAlpha(x, h), role);
    }
  }

  // Sit the whole thing around the origin so it turns about its middle.
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < xyz.length; i += 3) {
    minY = Math.min(minY, xyz[i + 1]);
    maxY = Math.max(maxY, xyz[i + 1]);
    minZ = Math.min(minZ, xyz[i + 2]);
    maxZ = Math.max(maxZ, xyz[i + 2]);
  }
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  for (let i = 0; i < xyz.length; i += 3) {
    xyz[i + 1] -= cy;
    xyz[i + 2] -= cz;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(xyz), 3));
  geometry.setAttribute("aAlpha", new BufferAttribute(new Float32Array(alpha), 1));
  geometry.setAttribute("aText", new BufferAttribute(new Float32Array(text), 1));

  // The screen's four corners, in the same centred space, so the page can ask
  // whether the pointer is on the screen rather than merely near the laptop.
  const onLid = (x: number, d: number) =>
    new Vector3(x, upY * d - cy, -DECK_D + upZ * d - cz);
  const screenQuad = [
    onLid(SCREEN.x0, SCREEN.d0),
    onLid(SCREEN.x1, SCREEN.d0),
    onLid(SCREEN.x1, SCREEN.d1),
    onLid(SCREEN.x0, SCREEN.d1),
  ];

  return { geometry, screenQuad };
}

/* ── The lens ─────────────────────────────────────────────────────────────────
   Dots near the cursor rise toward the camera and spread apart, brighter and
   fatter, so the grid bulges where you point. The spread is scaled by
   1 - (r/R)^2, which reaches zero exactly at the rim: no seam, no pile-up. */

const VERT = /* glsl */ `
  uniform vec2 uCursor;
  uniform float uHover;
  uniform float uAspect;
  uniform float uLensR;
  uniform float uMagnify;
  uniform float uLift;
  uniform float uDot;
  uniform float uScale;
  uniform float uGain;
  uniform float uReveal;
  attribute float aAlpha;
  attribute float aText;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;

    vec2 away = vec2((ndc.x - uCursor.x) * uAspect, ndc.y - uCursor.y);
    float t = clamp(length(away) / uLensR, 0.0, 1.0);
    float f = (1.0 - t * t) * uHover;

    mv.z += uLift * f;
    clip = projectionMatrix * mv;
    vec2 lifted = clip.xy / clip.w;
    clip.xy = (uCursor + (lifted - uCursor) * (1.0 + uMagnify * f)) * clip.w;

    float letter = step(0.75, aText);
    float field = step(0.25, aText) * (1.0 - letter);
    float lit = letter * uReveal;

    gl_Position = clip;
    gl_PointSize = (uDot * uScale / max(-mv.z, 0.001)) * (1.0 + 0.9 * f) * (1.0 + 0.7 * lit);
    vAlpha = (aAlpha * (1.0 - 0.68 * field * uReveal) + 0.9 * lit) * uGain * (1.0 + 0.9 * f);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r2 = dot(c, c);
    if (r2 > 0.25) discard;
    gl_FragColor = vec4(uColor, clamp(vAlpha, 0.0, 1.0) * smoothstep(0.25, 0.13, r2));
    #include <colorspace_fragment>
  }
`;

/* ── Motion ───────────────────────────────────────────────────────────────── */

const TWO_PI = Math.PI * 2;
/** Shortest way round to an angle, so coming back from a spin never unwinds. */
const wrap = (a: number) => a - TWO_PI * Math.round(a / TWO_PI);

const FOV = 30;
const FIT_W = 2.1; // half extents to frame, wide enough to cover a turn
const FIT_H = 1.45;
const POSE = { x: 0.34, y: -0.42 }; // the three-quarter view it rests in
const SWAY = 0.17; // rad either side of that, while nothing is happening
const SWAY_RATE = 0.00035; // rad of phase per ms
const TILT = 0.16; // extra lean toward the pointer on hover
const MAX_TILT = 1.15;
const DRAG_GAIN = 0.011; // rad per pixel dragged

export default function DotLaptopScene({
  className = "",
  children,
}: {
  className?: string;
  /** Flat stand-in, shown until WebGL is up and left in place if it never is. */
  children?: React.ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const skinRef = useRef<(() => void) | null>(null);
  const [live, setLive] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the wrapper keeps its flat drawing
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(dpr);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);
    setLive(true);

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);

    const uniforms = {
      uCursor: { value: new Vector2() },
      uHover: { value: 0 },
      uAspect: { value: 1 },
      uLensR: { value: 0.5 },
      uMagnify: { value: 0.75 },
      uLift: { value: 0.55 },
      uDot: { value: DOT },
      uScale: { value: 300 },
      uGain: { value: 1 },
      uReveal: { value: 0 },
      uColor: { value: new Color("#17171a") },
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const { geometry, screenQuad } = buildLaptop();
    const cloud = new Points(geometry, material);
    scene.add(cloud);

    // Where the screen's corners land on the page right now. The words show
    // only while the pointer is inside that quad, and only from the front: a
    // back-lit lid winds the other way once the laptop is turned around.
    const quad = screenQuad.map(() => new Vector2());
    const p = new Vector3();
    const onScreen = () => {
      for (let i = 0; i < screenQuad.length; i++) {
        p.copy(screenQuad[i]).applyMatrix4(cloud.matrixWorld).project(camera);
        quad[i].set(p.x, p.y);
      }
      const c = uniforms.uCursor.value;
      let sign = 0;
      for (let i = 0; i < quad.length; i++) {
        const a = quad[i];
        const b = quad[(i + 1) % quad.length];
        const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        if (cross === 0) continue;
        if (sign === 0) sign = Math.sign(cross);
        else if (Math.sign(cross) !== sign) return false;
      }
      return sign > 0; // positive winding is the side the screen faces
    };

    // The dots take their colour from the theme token, read after the class has
    // landed on <html>. Ink on paper needs a little more weight than pale dots
    // on black, which the dark ground already does half the work of.
    const skin = () => {
      const ink = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
      uniforms.uColor.value.set(ink || "#17171a");
      const onPaper = uniforms.uColor.value.getHSL({ h: 0, s: 0, l: 0 }).l < 0.5;
      uniforms.uGain.value = onPaper ? 1.32 : 1;
    };
    skin();
    skinRef.current = skin;

    /* ── state ── */
    const rot = { ...POSE };
    const vel = { x: 0, y: 0 };
    const lean = { x: 0, y: 0 };
    const targetLean = { x: 0, y: 0 };
    let hover = 0; // eased 0..1, drives the lens
    let reveal = 0; // eased 0..1, brings the words up on the screen
    let wantHover = false;
    let dragging = false;
    let pointer = { x: 0, y: 0, t: 0 };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      uniforms.uAspect.value = camera.aspect;
      // Frame the laptop by its own extents, whatever shape the box is.
      const halfV = Math.tan(MathUtils.degToRad(FOV / 2));
      camera.position.z = (Math.max(FIT_H, FIT_W / camera.aspect) / halfV) * 1.12;
      camera.updateProjectionMatrix();
      uniforms.uScale.value = (height * dpr) / (2 * halfV);
    };

    const draw = () => {
      cloud.rotation.x = rot.x + lean.x;
      cloud.rotation.y = rot.y + lean.y;
      cloud.updateMatrixWorld(true);
      // The magnifier stands down over the screen: a bulge would scramble the
      // very words it is sitting on.
      uniforms.uHover.value = hover * (1 - 0.78 * reveal);
      uniforms.uReveal.value = reveal;
      renderer.render(scene, camera);
    };

    let raf = 0;
    let last = 0;
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;

      hover += ((wantHover || dragging ? 1 : 0) - hover) * (1 - Math.exp(-9 * dt));

      if (!dragging) {
        rot.x += vel.x * dt;
        rot.y += vel.y * dt;
        const decay = Math.exp(-2.4 * dt);
        vel.x *= decay;
        vel.y *= decay;

        // A throw keeps turning until it dies down; only then does the resting
        // three-quarter pose draw it back.
        const settled = Math.max(0, 1 - Math.hypot(vel.x, vel.y));
        const k = (1 - Math.exp(-1.6 * dt)) * settled;
        rot.y += wrap(POSE.y + Math.sin(now * SWAY_RATE) * SWAY - rot.y) * k;
        rot.x += (POSE.x + Math.sin(now * SWAY_RATE * 1.3) * 0.06 - rot.x) * k;
        rot.x = MathUtils.clamp(rot.x, -MAX_TILT, MAX_TILT);
        rot.y = wrap(rot.y);
      }

      const chase = 1 - Math.exp(-7 * dt);
      lean.x += (targetLean.x * hover - lean.x) * chase;
      lean.y += (targetLean.y * hover - lean.y) * chase;

      cloud.rotation.x = rot.x + lean.x;
      cloud.rotation.y = rot.y + lean.y;
      cloud.updateMatrixWorld(true);
      const wantWords = (wantHover || dragging) && onScreen() ? 1 : 0;
      reveal += (wantWords - reveal) * (1 - Math.exp(-8 * dt));
      draw();
    };

    const start = () => {
      if (raf || reduce.matches) return;
      last = 0;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    // The lens is direct manipulation, so it still answers the pointer when the
    // animation loop is parked for reduced motion.
    const staticDraw = () => {
      if (!reduce.matches) return;
      hover = wantHover || dragging ? 1 : 0;
      cloud.rotation.x = rot.x + lean.x;
      cloud.rotation.y = rot.y + lean.y;
      cloud.updateMatrixWorld(true);
      reveal = hover && onScreen() ? 1 : 0;
      draw();
    };

    /* ── input ── */
    const aim = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * 2 - 1;
      const py = ((e.clientY - r.top) / r.height) * 2 - 1;
      uniforms.uCursor.value.set(px, -py);
      targetLean.y = px * TILT;
      targetLean.x = py * TILT * 0.6;
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      wantHover = true;
      aim(e);
      staticDraw();
    };
    const onLeave = () => {
      wantHover = false;
      staticDraw();
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) {
        const now = performance.now();
        const dt = Math.max((now - pointer.t) / 1000, 1 / 240);
        const dx = (e.clientX - pointer.x) * DRAG_GAIN;
        const dy = (e.clientY - pointer.y) * DRAG_GAIN;
        pointer = { x: e.clientX, y: e.clientY, t: now };
        rot.y = wrap(rot.y + dx);
        rot.x = MathUtils.clamp(rot.x + dy, -MAX_TILT, MAX_TILT);
        vel.y = MathUtils.lerp(vel.y, MathUtils.clamp(dx / dt, -12, 12), 0.35);
        vel.x = MathUtils.lerp(vel.x, MathUtils.clamp(dy / dt, -12, 12), 0.35);
      }
      aim(e);
      staticDraw();
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      pointer = { x: e.clientX, y: e.clientY, t: performance.now() };
      vel.x = 0;
      vel.y = 0;
      // A finger has no hover, so touching is what turns the lens on.
      wantHover = true;
      aim(e);
      host.setPointerCapture(e.pointerId);
      staticDraw();
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (host.hasPointerCapture(e.pointerId)) host.releasePointerCapture(e.pointerId);
      if (e.pointerType === "touch") wantHover = false;
      staticDraw();
    };
    // Belt and braces: if the browser takes the pointer away (a context menu, a
    // window switch) the pointerup never lands, and the drag would stick.
    const onLostCapture = () => {
      dragging = false;
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("lostpointercapture", onLostCapture);

    /* ── lifecycle: it only runs while on screen, in a visible tab ── */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionPref = () => {
      if (reduce.matches) {
        stop();
        draw();
      } else {
        start();
      }
    };
    reduce.addEventListener("change", onMotionPref);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(host);
    resize();
    draw();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onMotionPref);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("lostpointercapture", onLostCapture);
      skinRef.current = null;
      setLive(false);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // A theme flip only needs a new colour, not a new scene, so the pose survives.
  useEffect(() => {
    const id = requestAnimationFrame(() => skinRef.current?.());
    return () => cancelAnimationFrame(id);
  }, [resolvedTheme]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      // Sideways drags turn it; vertical ones still scroll the page.
      className={`relative cursor-crosshair touch-pan-y select-none ${className}`}
    >
      {!live && children}
    </div>
  );
}
