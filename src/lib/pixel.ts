export type Pixels = (string | null)[];

export type BlendMode =
  "normal" | "multiply" | "screen" | "overlay" | "color-dodge" | "lighten" | "darken";

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  pixels: Pixels;
}

export interface Frame {
  id: string;
  name: string;
  duration: number;
  layers: Layer[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  from: number;
  to: number;
}

export interface Project {
  app: string;
  version: string;
  width: number;
  height: number;
  palette: string[];
  frames: Frame[];
  tags?: Tag[];
  savedAt?: string; // ISO timestamp of last autosave
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const DEFAULT_PALETTE = [
  "#000000",
  "#1d2b53",
  "#7e2553",
  "#008751",
  "#ab5236",
  "#5f574f",
  "#c2c3c7",
  "#fff1e8",
  "#ff004d",
  "#ffa300",
  "#ffec27",
  "#00e436",
  "#29adff",
  "#83769c",
  "#ff77a8",
  "#ffccaa",
];

export function makePixels(w: number, h: number, fill: string | null = null): Pixels {
  return new Array(w * h).fill(fill);
}

export function makeLayer(w: number, h: number, name = "Layer"): Layer {
  return {
    id: uid(),
    name,
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: "normal",
    pixels: makePixels(w, h),
  };
}

export function makeFrame(w: number, h: number, n = 1): Frame {
  return { id: uid(), name: `Frame ${n}`, duration: 120, layers: [makeLayer(w, h, "Layer 1")] };
}

export function createProject(w = 32, h = 32): Project {
  return {
    app: "Pixora",
    version: "5.1",
    width: w,
    height: h,
    palette: [...DEFAULT_PALETTE],
    frames: [makeFrame(w, h, 1)],
    tags: [],
  };
}

/**
 * Migrate an older project JSON (any version) to the current schema.
 * Safe to call on projects loaded from file or localStorage.
 */
type RawLayer = Partial<Layer>;
type RawFrame = Partial<Frame> & { layers?: RawLayer[] };
type RawProject = Partial<Project> & { frames?: RawFrame[]; tags?: Tag[] };

export function migrateProject(raw: RawProject): Project {
  const p: Project = {
    app: "Pixora",
    version: "5.1",
    width: Number(raw.width) || 32,
    height: Number(raw.height) || 32,
    palette: Array.isArray(raw.palette) ? raw.palette : [...DEFAULT_PALETTE],
    frames: [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  };
  if (Array.isArray(raw.frames) && raw.frames.length > 0) {
    p.frames = raw.frames.map((f, fi) => ({
      id: f.id || uid(),
      name: f.name || `Frame ${fi + 1}`,
      duration: Number(f.duration) || 120,
      layers:
        Array.isArray(f.layers) && f.layers.length > 0
          ? f.layers.map((l, li) => ({
              id: l.id || uid(),
              name: l.name || `Layer ${li + 1}`,
              visible: l.visible !== false,
              locked: !!l.locked,
              opacity: typeof l.opacity === "number" ? l.opacity : 1,
              blendMode: l.blendMode || "normal",
              pixels: Array.isArray(l.pixels) ? l.pixels : makePixels(p.width, p.height),
            }))
          : [makeLayer(p.width, p.height, "Layer 1")],
    }));
  } else {
    p.frames = [makeFrame(p.width, p.height, 1)];
  }
  return p;
}

/**
 * Run-length encode a Pixels array for storage.
 * Each run: [value, count] where value is string|null.
 * Returns a compact array like [null,5,"#ff0000",3,...] alternating value/count.
 */
export function compressPixels(px: Pixels): (string | null | number)[] {
  const out: (string | null | number)[] = [];
  if (px.length === 0) return out;
  let cur = px[0];
  let count = 1;
  for (let i = 1; i < px.length; i++) {
    if (px[i] === cur) {
      count++;
    } else {
      out.push(cur, count);
      cur = px[i];
      count = 1;
    }
  }
  out.push(cur, count);
  return out;
}

/** Decode a compressed Pixels array back to Pixels. */
export function decompressPixels(data: (string | null | number)[]): Pixels {
  const out: Pixels = [];
  for (let i = 0; i < data.length; i += 2) {
    const val = data[i] as string | null;
    const count = data[i + 1] as number;
    for (let j = 0; j < count; j++) out.push(val);
  }
  return out;
}

export function hexToRgb(hex: string) {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("")
  );
}

export function luminance(hex: string) {
  const c = hexToRgb(hex);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

export function hueOf(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const d = max - min;
  if (d === 0) return 0;
  let h = 0;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return (h * 60 + 360) % 360;
}

export function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}

export function hexToHSL(hex: string): [number, number, number] {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return [0, 0, l * 100];

  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;

  return [(h * 60 + 360) % 360, s * 100, l * 100];
}

export function rampBetween(a: string, b: string, steps: number): string[] {
  const ca = hexToRgb(a),
    cb = hexToRgb(b);
  const out: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    out.push(
      rgbToHex(ca.r + (cb.r - ca.r) * t, ca.g + (cb.g - ca.g) * t, ca.b + (cb.b - ca.b) * t),
    );
  }
  return out;
}

export function linePoints(x0: number, y0: number, x1: number, y1: number) {
  const pts: [number, number][] = [];
  const dx = Math.abs(x1 - x0),
    dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    pts.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return pts;
}

export function rectPoints(x0: number, y0: number, x1: number, y1: number, fill: boolean) {
  const pts: [number, number][] = [];
  const minX = Math.min(x0, x1),
    maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1),
    maxY = Math.max(y0, y1);
  for (let y = minY; y <= maxY; y++)
    for (let x = minX; x <= maxX; x++)
      if (fill || x === minX || x === maxX || y === minY || y === maxY) pts.push([x, y]);
  return pts;
}

export function ellipsePoints(x0: number, y0: number, x1: number, y1: number, fill: boolean) {
  const minX = Math.min(x0, x1),
    maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1),
    maxY = Math.max(y0, y1);
  const cx = (minX + maxX) / 2,
    cy = (minY + maxY) / 2;
  const rx = Math.max(0.5, (maxX - minX) / 2),
    ry = Math.max(0.5, (maxY - minY) / 2);
  const pts: [number, number][] = [];
  const seen = new Set<string>();
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const nx = (x - cx) / rx,
        ny = (y - cy) / ry;
      const d = nx * nx + ny * ny;
      const inside = d <= 1;
      const edge = d <= 1 && d >= 0.55;
      if (fill ? inside : edge) {
        const key = `${x},${y}`;
        if (!seen.has(key)) {
          seen.add(key);
          pts.push([x, y]);
        }
      }
    }
  }
  return pts;
}

export function floodFill(
  pixels: Pixels,
  w: number,
  h: number,
  sx: number,
  sy: number,
  color: string,
): number[] {
  const start = pixels[sy * w + sx] ?? null;
  if (start === color) return [];
  const out: number[] = [];
  const stack: [number, number][] = [[sx, sy]];
  const seen = new Set<number>();
  while (stack.length) {
    const [x, y] = stack.pop()!;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const i = y * w + x;
    if (seen.has(i)) continue;
    if ((pixels[i] ?? null) !== start) continue;
    seen.add(i);
    out.push(i);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return out;
}

// ============= Palette presets =============
export const PALETTE_PRESETS: { name: string; colors: string[] }[] = [
  { name: "PICO-8", colors: [...DEFAULT_PALETTE] },
  {
    name: "Game Boy",
    colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"],
  },
  {
    name: "NES",
    colors: [
      "#000000",
      "#fcfcfc",
      "#f8f8f8",
      "#bcbcbc",
      "#7c7c7c",
      "#a4e4fc",
      "#3cbcfc",
      "#0078f8",
      "#0000fc",
      "#b8b8f8",
      "#6888fc",
      "#0058f8",
      "#0000bc",
      "#d8b8f8",
      "#9878f8",
      "#6844fc",
    ],
  },
  {
    name: "Sweetie 16",
    colors: [
      "#1a1c2c",
      "#5d275d",
      "#b13e53",
      "#ef7d57",
      "#ffcd75",
      "#a7f070",
      "#38b764",
      "#257179",
      "#29366f",
      "#3b5dc9",
      "#41a6f6",
      "#73eff7",
      "#f4f4f4",
      "#94b0c2",
      "#566c86",
      "#333c57",
    ],
  },
  {
    name: "Endesga 16",
    colors: [
      "#e4a672",
      "#b86f50",
      "#743f39",
      "#3f2832",
      "#9e2835",
      "#e53b44",
      "#fb922b",
      "#ffe762",
      "#63c64d",
      "#327345",
      "#193d3f",
      "#4f6781",
      "#afbfd2",
      "#ffffff",
      "#2ce8f4",
      "#0484d1",
    ],
  },
];

// ============= Transform / effect helpers =============
export function flipH(pixels: Pixels, w: number, h: number): Pixels {
  const out = makePixels(w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) out[y * w + x] = pixels[y * w + (w - 1 - x)];
  return out;
}

export function flipV(pixels: Pixels, w: number, h: number): Pixels {
  const out = makePixels(w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) out[y * w + x] = pixels[(h - 1 - y) * w + x];
  return out;
}

/** Rotate 90deg clockwise (only meaningful for square canvases; keeps size). */
export function rotate90(pixels: Pixels, w: number, h: number): Pixels {
  const out = makePixels(w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const nx = h - 1 - y,
        ny = x;
      if (nx < w && ny < h) out[ny * w + nx] = pixels[y * w + x];
    }
  return out;
}

/** Add an outline of `color` around all non-empty pixels. */
export function outline(pixels: Pixels, w: number, h: number, color: string): Pixels {
  const out = pixels.slice();
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (pixels[y * w + x]) continue;
      for (const [dx, dy] of dirs) {
        const nx = x + dx,
          ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && pixels[ny * w + nx]) {
          out[y * w + x] = color;
          break;
        }
      }
    }
  return out;
}

export function shiftHue(pixels: Pixels, deg: number): Pixels {
  return pixels.map((c) => {
    if (!c) return c;
    const h = (hueOf(c) + deg + 360) % 360;
    const { r, g, b } = hexToRgb(c);
    const rn = r / 255,
      gn = g / 255,
      bn = b / 255;
    const max = Math.max(rn, gn, bn),
      min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    return hslToHex(h, s * 100, l * 100);
  });
}

export function grayscale(pixels: Pixels): Pixels {
  return pixels.map((c) => {
    if (!c) return c;
    const { r, g, b } = hexToRgb(c);
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    return rgbToHex(gray, gray, gray);
  });
}

export function invert(pixels: Pixels): Pixels {
  return pixels.map((c) => {
    if (!c) return c;
    const { r, g, b } = hexToRgb(c);
    return rgbToHex(255 - r, 255 - g, 255 - b);
  });
}

export function resizeProject(
  proj: Project,
  newW: number,
  newH: number,
  scale: boolean = false,
): Project {
  const np = JSON.parse(JSON.stringify(proj)) as Project;
  const oldW = np.width;
  const oldH = np.height;
  np.width = newW;
  np.height = newH;

  np.frames.forEach((frame) => {
    frame.layers.forEach((layer) => {
      const oldPx = layer.pixels;
      const newPx = makePixels(newW, newH);

      for (let y = 0; y < newH; y++) {
        for (let x = 0; x < newW; x++) {
          if (scale) {
            const srcX = Math.floor((x / newW) * oldW);
            const srcY = Math.floor((y / newH) * oldH);
            newPx[y * newW + x] = oldPx[srcY * oldW + srcX];
          } else {
            // crop or expand
            if (x < oldW && y < oldH) {
              newPx[y * newW + x] = oldPx[y * oldW + x];
            }
          }
        }
      }
      layer.pixels = newPx;
    });
  });
  return np;
}

/** 4x4 Bayer ordered dithering threshold matrix (normalized 0..1). */
export const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => v / 16));

/** Returns true if a dither cell at (x,y) with given density (0..1) should paint. */
export function ditherOn(x: number, y: number, density: number): boolean {
  return density > BAYER4[y & 3][x & 3];
}
