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

export function applySepia(px: (string | null)[]) {
  return px.map(color => {
    if (!color) return null;
    const {r, g, b} = hexToRgb(color);
    const tr = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    const tg = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    const tb = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    return rgbToHex(Math.round(tr), Math.round(tg), Math.round(tb));
  });
}

export function applyGrayscale(px: (string | null)[]) {
  return px.map(color => {
    if (!color) return null;
    const {r, g, b} = hexToRgb(color);
    const avg = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
    return rgbToHex(avg, avg, avg);
  });
}

export function applyBrightness(px: (string | null)[], amount: number) {
  return px.map(color => {
    if (!color) return null;
    const {r, g, b} = hexToRgb(color);
    return rgbToHex(
      Math.max(0, Math.min(255, r + amount)),
      Math.max(0, Math.min(255, g + amount)),
      Math.max(0, Math.min(255, b + amount))
    );
  });
}

export function applyPosterize(px: (string | null)[], levels: number) {
  const step = 255 / (levels - 1);
  return px.map(color => {
    if (!color) return null;
    const {r, g, b} = hexToRgb(color);
    return rgbToHex(
      Math.round(Math.round(r / step) * step),
      Math.round(Math.round(g / step) * step),
      Math.round(Math.round(b / step) * step)
    );
  });
}

export function applyAutoOutline(px: (string | null)[], w: number, h: number, outlineColor: string) {
  const out = [...px];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!px[idx]) {
        // If empty, check neighbors
        let hasSolidNeighbor = false;
        const neighbors = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
        ];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            if (px[ny * w + nx]) {
              hasSolidNeighbor = true;
              break;
            }
          }
        }
        if (hasSolidNeighbor) {
          out[idx] = outlineColor;
        }
      }
    }
  }
  return out;
}

export function applyArbitraryRotate(px: (string | null)[], w: number, h: number, angleDeg: number) {
  const out = new Array(w * h).fill(null);
  const cx = w / 2;
  const cy = h / 2;
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = px[y * w + x];
      if (!c) continue;
      // rotate around center
      const dx = x - cx;
      const dy = y - cy;
      const nx = Math.round(dx * cos - dy * sin + cx);
      const ny = Math.round(dx * sin + dy * cos + cy);
      
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        out[ny * w + nx] = c;
      }
    }
  }
  return out;
}

export function applyScale(px: (string | null)[], w: number, h: number, scale: number) {
  const out = new Array(w * h).fill(null);
  const cx = w / 2;
  const cy = h / 2;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // inverse mapping
      const dx = x - cx;
      const dy = y - cy;
      
      const srcX = Math.round(dx / scale + cx);
      const srcY = Math.round(dy / scale + cy);
      
      if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
        out[y * w + x] = px[srcY * w + srcX] || null;
      }
    }
  }
  return out;
}

// --- Reconstructed Functions ---

export function linePoints(x0: number, y0: number, x1: number, y1: number) {
  const pts: [number, number][] = [];
  let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, e2; 
  while (true) {
    pts.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
  return pts;
}

export function rectPoints(x0: number, y0: number, x1: number, y1: number, filled = false) {
  const pts: [number, number][] = [];
  const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
  
  if (filled) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        pts.push([x, y]);
      }
    }
  } else {
    for (let x = minX; x <= maxX; x++) {
      pts.push([x, minY]);
      pts.push([x, maxY]);
    }
    for (let y = minY + 1; y < maxY; y++) {
      pts.push([minX, y]);
      pts.push([maxX, y]);
    }
  }
  return pts;
}

export function ellipsePoints(x0: number, y0: number, x1: number, y1: number, filled = false) {
  const pts: [number, number][] = [];
  const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
  const rx = Math.floor((maxX - minX) / 2);
  const ry = Math.floor((maxY - minY) / 2);
  const xc = minX + rx;
  const yc = minY + ry;
  
  if (rx === 0 && ry === 0) return [[xc, yc]];
  
  if (filled) {
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1.2) {
          pts.push([xc + x, yc + y]);
        }
      }
    }
    return pts;
  }
  
  let x = 0, y = ry;
  let d1 = (ry * ry) - (rx * rx * ry) + (0.25 * rx * rx);
  let dx = 2 * ry * ry * x;
  let dy = 2 * rx * rx * y;
  
  const add = (px: number, py: number) => {
    pts.push([xc + px, yc + py]);
    pts.push([xc - px, yc + py]);
    pts.push([xc + px, yc - py]);
    pts.push([xc - px, yc - py]);
  };
  
  while (dx < dy) {
    add(x, y);
    if (d1 < 0) {
      x++; dx += 2 * ry * ry; d1 += dx + ry * ry;
    } else {
      x++; y--; dx += 2 * ry * ry; dy -= 2 * rx * rx; d1 += dx - dy + ry * ry;
    }
  }
  
  let d2 = (ry * ry) * ((x + 0.5) * (x + 0.5)) + (rx * rx) * ((y - 1) * (y - 1)) - (rx * rx * ry * ry);
  while (y >= 0) {
    add(x, y);
    if (d2 > 0) {
      y--; dy -= 2 * rx * rx; d2 += rx * rx - dy;
    } else {
      y--; x++; dx += 2 * ry * ry; dy -= 2 * rx * rx; d2 += dx - dy + rx * rx;
    }
  }
  return pts;
}

export function floodFill(px: (string | null)[], w: number, h: number, startX: number, startY: number, fillColor: string | null) {
  const startIdx = startY * w + startX;
  const targetColor = px[startIdx];
  if (targetColor === fillColor) return [];
  
  const idxs: number[] = [];
  const q: [number, number][] = [[startX, startY]];
  const visited = new Set<number>();
  visited.add(startIdx);
  
  while (q.length > 0) {
    const [x, y] = q.shift()!;
    const idx = y * w + x;
    if (px[idx] === targetColor) {
      idxs.push(idx);
      const left = y * w + (x - 1);
      if (x > 0 && !visited.has(left)) { visited.add(left); q.push([x - 1, y]); }
      const right = y * w + (x + 1);
      if (x < w - 1 && !visited.has(right)) { visited.add(right); q.push([x + 1, y]); }
      const up = (y - 1) * w + x;
      if (y > 0 && !visited.has(up)) { visited.add(up); q.push([x, y - 1]); }
      const down = (y + 1) * w + x;
      if (y < h - 1 && !visited.has(down)) { visited.add(down); q.push([x, y + 1]); }
    }
  }
  return idxs;
}

export function hexToHSL(hex: string): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16) / 255;
    g = parseInt(hex.substring(3, 5), 16) / 255;
    b = parseInt(hex.substring(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hueOf(hex: string): number {
  return hexToHSL(hex)[0];
}

export function luminance(hex: string): number {
  return hexToHSL(hex)[2];
}

export function rampBetween(c1: string, c2: string, steps: number): string[] {
  const [h1, s1, l1] = hexToHSL(c1);
  const [h2, s2, l2] = hexToHSL(c2);
  const ramp: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const h = h1 + (h2 - h1) * t;
    const s = s1 + (s2 - s1) * t;
    const l = l1 + (l2 - l1) * t;
    ramp.push(hslToHex(h, s, l));
  }
  return ramp;
}


export const PALETTE_PRESETS = [
  { name: "Pico-8", colors: ["#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", "#FF004D", "#FFA300", "#FFEC27", "#00E436", "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"] },
  { name: "GameBoy", colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"] }
];

export function flipH(px: (string | null)[], w: number, h: number) {
  const out = new Array(w * h).fill(null);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      out[y * w + (w - 1 - x)] = px[y * w + x];
    }
  }
  return out;
}

export function flipV(px: (string | null)[], w: number, h: number) {
  const out = new Array(w * h).fill(null);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      out[(h - 1 - y) * w + x] = px[y * w + x];
    }
  }
  return out;
}

export function rotate90(px: (string | null)[], w: number, h: number) {
  // Rotate 90 degrees clockwise. Note this only perfectly works if w == h. 
  // We assume w == h for rotate90 in this simple app context.
  const out = new Array(w * h).fill(null);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      out[x * w + (h - 1 - y)] = px[y * w + x];
    }
  }
  return out;
}

export function outline(px: (string | null)[], w: number, h: number, color: string) {
  const out = [...px];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!px[idx]) {
        let n = false;
        if (x > 0 && px[y * w + (x - 1)]) n = true;
        if (x < w - 1 && px[y * w + (x + 1)]) n = true;
        if (y > 0 && px[(y - 1) * w + x]) n = true;
        if (y < h - 1 && px[(y + 1) * w + x]) n = true;
        if (n) out[idx] = color;
      }
    }
  }
  return out;
}

export function shiftHue(px: (string | null)[], amount: number) {
  return px.map(color => {
    if (!color) return null;
    let [h, s, l] = hexToHSL(color);
    h = (h + amount) % 360;
    if (h < 0) h += 360;
    return hslToHex(h, s, l);
  });
}

export function grayscale(px: (string | null)[]) {
  return px.map(color => {
    if (!color) return null;
    const {r, g, b} = hexToRgb(color);
    const avg = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
    return rgbToHex(avg, avg, avg);
  });
}

export function invert(px: (string | null)[]) {
  return px.map(color => {
    if (!color) return null;
    const {r, g, b} = hexToRgb(color);
    return rgbToHex(255 - r, 255 - g, 255 - b);
  });
}

export function resizeProject(p: any, newW: number, newH: number, scale: boolean) {
  const out = JSON.parse(JSON.stringify(p));
  out.width = newW;
  out.height = newH;
  for (let f of out.frames) {
    for (let l of f.layers) {
      const oldPx = l.pixels;
      const newPx = new Array(newW * newH).fill(null);
      if (scale) {
        const scaleX = p.width / newW;
        const scaleY = p.height / newH;
        for (let y = 0; y < newH; y++) {
          for (let x = 0; x < newW; x++) {
            const srcX = Math.floor(x * scaleX);
            const srcY = Math.floor(y * scaleY);
            if (srcX >= 0 && srcX < p.width && srcY >= 0 && srcY < p.height) {
              newPx[y * newW + x] = oldPx[srcY * p.width + srcX];
            }
          }
        }
      } else {
        for (let y = 0; y < Math.min(newH, p.height); y++) {
          for (let x = 0; x < Math.min(newW, p.width); x++) {
            newPx[y * newW + x] = oldPx[y * p.width + x];
          }
        }
      }
      l.pixels = newPx;
    }
  }
  return out;
}
