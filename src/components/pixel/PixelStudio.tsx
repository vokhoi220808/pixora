
import React, { Component, ErrorInfo, ReactNode } from "react";
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{padding: 20, background: 'red', color: 'white'}}><h1>Something went wrong.</h1><pre>{this.state.error?.toString()}</pre><pre>{this.state.error?.stack}</pre></div>;
    }
    return this.props.children;
  }
}

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  type BlendMode,
  type Frame,
  type Layer,
  type Pixels,
  type Project,
  clamp,
  compressPixels,
  createProject,
  decompressPixels,
  ellipsePoints,
  floodFill,
  hslToHex,
  hexToHSL,
  hueOf,
  linePoints,
  luminance,
  makeFrame,
  makeLayer,
  makePixels,
  migrateProject,
  rampBetween,
  rectPoints,
  uid,
} from "@/lib/pixel";
import {
  PALETTE_PRESETS,
  ditherOn,
  flipH,
  flipV,
  outline,
  rotate90,
  shiftHue,
  grayscale,
  invert,
  resizeProject,
} from "@/lib/pixel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import gifenc from "gifenc";
const { GIFEncoder, quantize, applyPalette } = gifenc;
import {
  Hand,
  ZoomIn,
  Ruler,
  Stamp,
  MousePointerClick,
  Magnet,
  Sparkles,
  Grid2X2,
  LassoSelect,
  Spline,
  Droplet,
  Cloud,
  Pencil,
  SprayCan,
  SunMedium,
  Blend,
  Hexagon,
  Palette,
  Type,
  LayoutGrid,
  FileDown,
  FileUp,
  Brush,
  Eraser,
  PaintBucket,
  Pipette,
  Minus,
  Square,
  Circle,
  Move,
  Play,
  Pause,
  Plus,
  Copy,
  Trash2,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  CircleHelp,
  Download,
  Save,
  FolderOpen,
  FilePlus2,
  Grid3x3,
  FlipHorizontal2,
  FlipVertical2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers as LayersIcon,
  BoxSelect,
  Grip,
  RotateCw,
  Wand2,
  Image as ImageIcon,
  Film,
  Video,
  StopCircle,
  Command,
  Volume2,
  VolumeX,
  ImagePlus,
  AlertCircle,
  Check,
} from "lucide-react";
import { audio } from "../../lib/audio";

type Tool =
  | "hand"
  | "zoom"
  | "ruler"
  | "clone"
  | "stamp"
  | "color_select"
  | "magnetic_lasso"
  | "noise"
  | "halftone"
  | "lasso"
  | "curve"
  | "smudge"
  | "blur"
  | "brush"
  | "pencil"
  | "spray"
  | "shade"
  | "replace"
  | "polygon"
  | "grad"
  | "pattern"
  | "tile"
  | "text"
  | "dither"
  | "eraser"
  | "fill"
  | "pick"
  | "line"
  | "rect"
  | "circle"
  | "move"
  | "select"
  | "wand";

type CompressedPixels = (string | null | number)[];
type AutosaveLayer = Omit<Layer, "pixels"> & { pixels: Pixels | CompressedPixels };
type AutosaveFrame = Omit<Frame, "layers"> & { layers: AutosaveLayer[] };
type AutosaveProject = Omit<Project, "frames"> & {
  frames: AutosaveFrame[];
  _compressed?: boolean;
};
type SelectionBox = { x0: number; y0: number; x1: number; y1: number };
type KeyboardHandlers = {
  undo: () => void;
  redo: () => void;
  copySelection: () => void;
  pasteSelection: () => void;
  clearSelection: () => void;
  setCmdOpen: Dispatch<SetStateAction<boolean>>;
  setSelection: Dispatch<SetStateAction<SelectionBox | null>>;
  setTool: Dispatch<SetStateAction<Tool>>;
  setShowGrid: Dispatch<SetStateAction<boolean>>;
  setTilePreview: Dispatch<SetStateAction<boolean>>;
  setBrushSize: Dispatch<SetStateAction<number>>;
  setFrameIndex: Dispatch<SetStateAction<number>>;
  project: Project;
  selection: SelectionBox | null;
};
type RequestFrameTrack = MediaStreamTrack & { requestFrame?: () => void };

const TOOLS: { id: Tool; icon: typeof Brush; label: string; key: string; soon?: boolean }[] = [
  { id: "hand", icon: Hand, label: "Hand (Pan)", key: "H" },
  { id: "zoom", icon: ZoomIn, label: "Zoom", key: "Z" },
  { id: "ruler", icon: Ruler, label: "Ruler", key: "Shift+R" },
  { id: "clone", icon: Copy, label: "Clone Stamp", key: "Shift+K" },
  { id: "stamp", icon: Stamp, label: "Stamp Tool", key: "Shift+M" },
  { id: "color_select", icon: MousePointerClick, label: "Color Select", key: "Shift+W" },
  { id: "magnetic_lasso", icon: Magnet, label: "Magnetic Lasso", key: "Shift+G" },
  { id: "noise", icon: Sparkles, label: "Noise", key: "Shift+N" },
  { id: "halftone", icon: Grid2X2, label: "Halftone", key: "Shift+H" },
  { id: "lasso", icon: LassoSelect, label: "Lasso Select", key: "Shift+L" },
  { id: "curve", icon: Spline, label: "Curve", key: "Shift+C" },
  { id: "smudge", icon: Droplet, label: "Smudge", key: "Shift+S" },
  { id: "blur", icon: Cloud, label: "Blur", key: "Shift+B" },
  { id: "pencil", icon: Pencil, label: "Pencil (1px)", key: "N" },
  { id: "brush", icon: Brush, label: "Brush", key: "B" },
  { id: "dither", icon: Grip, label: "Dither", key: "D" },
  { id: "eraser", icon: Eraser, label: "Eraser", key: "E" },
  { id: "fill", icon: PaintBucket, label: "Fill", key: "F" },
  { id: "pick", icon: Pipette, label: "Picker", key: "I" },
  { id: "line", icon: Minus, label: "Line", key: "L" },
  { id: "rect", icon: Square, label: "Rectangle", key: "R" },
  { id: "circle", icon: Circle, label: "Ellipse", key: "C" },
  { id: "select", icon: BoxSelect, label: "Select", key: "S" },
  { id: "wand", icon: Wand2, label: "Magic Wand", key: "W" },
  { id: "move", icon: Move, label: "Move layer", key: "M" },
  { id: "spray", icon: SprayCan, label: "Spray Pixel", key: "Y" },
  { id: "shade", icon: SunMedium, label: "Shading Brush", key: "O" },
  { id: "replace", icon: Blend, label: "Replace Color", key: "K" },
  { id: "polygon", icon: Hexagon, label: "Polygon", key: "P" },
  { id: "grad", icon: Palette, label: "Gradient Fill", key: "Shift+G" },
  { id: "pattern", icon: Grid3x3, label: "Pattern Brush", key: "T" },
  { id: "tile", icon: LayoutGrid, label: "Tile Seam", key: "J" },
  { id: "text", icon: Type, label: "Text Pixel Tool", key: "X" },
];

const TOOL_GROUPS: Tool[][] = [
  ["hand", "zoom", "ruler"],
  ["brush", "pencil", "eraser", "dither"],
  ["spray", "pattern", "tile", "text"],
  ["shade", "smudge", "blur"],
  ["noise", "halftone"],
  ["clone", "stamp"],
  ["line", "curve", "rect", "circle", "polygon"],
  ["select", "lasso", "color_select", "magnetic_lasso", "wand", "move"],
  ["pick", "fill", "replace", "grad"]
];


const BLEND_MODES: BlendMode[] = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "color-dodge",
  "lighten",
  "darken",
];

const CANVAS_PRESETS = [16, 32, 48, 64, 96, 128];
const QUICK_TOUR_STORAGE_KEY = "pixora-studio-quick-tour-v1";
const QUICK_TOUR_STEPS = [
  {
    target: "topbar",
    title: "Welcome to Pixora Studio",
    body: "This is your main control bar: File saves and opens projects, Export creates images or animations, View toggles the timeline, Undo/Redo control history, and Ctrl+K opens the Command Palette.",
    hint: "The ? button next to Pixora Studio always opens the full user guide.",
  },
  {
    target: "tools",
    title: "Choose a Drawing Tool",
    body: "The left toolbar holds 11 tools such as Brush, Eraser, Fill, Picker, Line, Selection, and Magic Wand. Hover an icon to see its name and shortcut.",
    hint: "Quick start: press B for Brush, E for Eraser, and F for Fill.",
  },
  {
    target: "canvas",
    title: "Draw Directly on the Canvas",
    body: "The center area is where you place pixels. Click to draw one pixel, or hold and drag to draw continuously. The status bar shows live X/Y coordinates.",
    hint: "The default 32 x 32 canvas is great for icons, game items, and small sprites.",
  },
  {
    target: "panels",
    title: "Adjust Details in the Right Panel",
    body: "The right panel controls canvas size, zoom, animation preview, brush size, symmetry, reference images, palettes, and layers.",
    hint: "If a change does not behave as expected, check the active layer first.",
  },
  {
    target: "timeline",
    title: "Create Animation with the Timeline",
    body: "The bottom timeline lets you add frames, duplicate frames, set frame duration, and preview animation. Each frame keeps its own layer stack.",
    hint: "Duplicate a frame and move details by 1 pixel for a fast idle animation.",
  },
  {
    target: "topbar",
    title: "Autosave and Replay the Tour",
    body: "Pixora automatically saves a browser draft after you make changes. This tour appears only once, but you can replay it with the Tour button in the top bar.",
    hint: "For real work, use File > Save Project to download a JSON backup.",
  },
] as const;

function clone(p: Project): Project {
  return JSON.parse(JSON.stringify(p));
}

/** Build ImageData for a layer's pixels at native resolution. */
function pixelsToImageData(pixels: Pixels, w: number, h: number): ImageData {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < pixels.length; i++) {
    const c = pixels[i];
    if (!c) continue;
    const n = parseInt(c.replace("#", ""), 16);
    data[i * 4] = (n >> 16) & 255;
    data[i * 4 + 1] = (n >> 8) & 255;
    data[i * 4 + 2] = n & 255;
    data[i * 4 + 3] = 255;
  }
  return new ImageData(data, w, h);
}

function layerCanvas(pixels: Pixels, w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d")!.putImageData(pixelsToImageData(pixels, w, h), 0, 0);
  return c;
}

/** Composite a frame's visible layers to a native-resolution canvas. */
function compositeFrame(
  frame: Frame,
  w: number,
  h: number,
  overrideLayerId?: string,
  overridePixels?: Pixels,
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d")!;
  for (const layer of frame.layers) {
    if (!layer.visible) continue;
    const px = layer.id === overrideLayerId && overridePixels ? overridePixels : layer.pixels;
    ctx.globalAlpha = layer.opacity;
    ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;
    ctx.drawImage(layerCanvas(px, w, h), 0, 0);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  return out;
}


function applySepia(pixels: Pixels): Pixels {
  return pixels.map(p => {
    if (!p) return p;
    const hex = p.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const tr = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    const tg = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    const tb = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    return "#" + [tr, tg, tb].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
  });
}
function applyGrayscale(pixels: Pixels): Pixels {
  return pixels.map(p => {
    if (!p) return p;
    const hex = p.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
    const h = gray.toString(16).padStart(2, "0");
    return "#" + h + h + h;
  });
}
function applyBrightness(pixels: Pixels, amount: number): Pixels {
  return pixels.map(p => {
    if (!p) return p;
    const hex = p.replace("#", "");
    const r = Math.min(255, Math.max(0, parseInt(hex.substring(0, 2), 16) + amount));
    const g = Math.min(255, Math.max(0, parseInt(hex.substring(2, 4), 16) + amount));
    const b = Math.min(255, Math.max(0, parseInt(hex.substring(4, 6), 16) + amount));
    return "#" + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
  });
}
function applyPosterize(pixels: Pixels, levels: number): Pixels {
  const step = 255 / (levels - 1);
  return pixels.map(p => {
    if (!p) return p;
    const hex = p.replace("#", "");
    const r = Math.round(Math.round(parseInt(hex.substring(0, 2), 16) / step) * step);
    const g = Math.round(Math.round(parseInt(hex.substring(2, 4), 16) / step) * step);
    const b = Math.round(Math.round(parseInt(hex.substring(4, 6), 16) / step) * step);
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
  });
}
function applyAutoOutline(pixels: Pixels, W: number, H: number, color: string): Pixels {
  const out = [...pixels];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (pixels[y * W + x]) continue; // Already filled
      // Check neighbors
      let neighborFilled = false;
      if (x > 0 && pixels[y * W + (x - 1)]) neighborFilled = true;
      if (x < W - 1 && pixels[y * W + (x + 1)]) neighborFilled = true;
      if (y > 0 && pixels[(y - 1) * W + x]) neighborFilled = true;
      if (y < H - 1 && pixels[(y + 1) * W + x]) neighborFilled = true;
      if (neighborFilled) out[y * W + x] = color;
    }
  }
  return out;
}
function applyArbitraryRotate(pixels: Pixels, W: number, H: number, angleDeg: number): Pixels {
  const out = new Array(W * H).fill(null);
  const angleRad = (angleDeg * Math.PI) / 180;
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);
  const cx = W / 2;
  const cy = H / 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // inverse mapping
      const dx = x - cx;
      const dy = y - cy;
      const srcX = Math.round(dx * cosA + dy * sinA + cx);
      const srcY = Math.round(-dx * sinA + dy * cosA + cy);
      if (srcX >= 0 && srcX < W && srcY >= 0 && srcY < H) {
        out[y * W + x] = pixels[srcY * W + srcX];
      }
    }
  }
  return out;
}
function applyScale(pixels: Pixels, W: number, H: number, scale: number): Pixels {
  const out = new Array(W * H).fill(null);
  const cx = W / 2;
  const cy = H / 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const srcX = Math.round(dx / scale + cx);
      const srcY = Math.round(dy / scale + cy);
      if (srcX >= 0 && srcX < W && srcY >= 0 && srcY < H) {
        out[y * W + x] = pixels[srcY * W + srcX];
      }
    }
  }
  return out;
}

export default function PixelStudioWrapper() {
  return <ErrorBoundary><PixelStudio /></ErrorBoundary>;
}
function PixelStudio() {
  const [project, setProject] = useState<Project>(() => createProject(32, 32));
  const [restorePrompt, setRestorePrompt] = useState<Project | null>(null);
  const [autosaveChecked, setAutosaveChecked] = useState(false);
  const [quickTourOpen, setQuickTourOpen] = useState(false);
  const [quickTourStep, setQuickTourStep] = useState(0);
  const [showRulers, setShowRulers] = useState(true);

  const [draggedFrameIndex, setDraggedFrameIndex] = useState<number | null>(null);

  const [showFeedback, setShowFeedback] = useState(false);



  useEffect(() => {
    try {
      const raw = localStorage.getItem("pixora-autosave");
      if (raw) {
        const parsed = JSON.parse(raw) as AutosaveProject;
        // Decompress pixels if stored in compressed format
        if (parsed._compressed) {
          parsed.frames?.forEach((f) =>
            f.layers?.forEach((l) => {
              if (Array.isArray(l.pixels)) l.pixels = decompressPixels(l.pixels);
            }),
          );
          delete parsed._compressed;
        }
        setRestorePrompt(migrateProject(parsed as Project));
      }
    } catch (error) {
      console.warn("[Pixora] Failed to read autosave", error);
    }
    setAutosaveChecked(true);
  }, []);

  useEffect(() => {
    if (!autosaveChecked || restorePrompt) return;
    try {
      if (localStorage.getItem(QUICK_TOUR_STORAGE_KEY) === "done") return;
      setQuickTourStep(0);
      setQuickTourOpen(true);
    } catch {
      setQuickTourOpen(true);
    }
  }, [autosaveChecked, restorePrompt]);

  const initialized = useRef(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autosaveChecked) return;
    if (restorePrompt) return;
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    // Debounced autosave: wait 1.5s after last change
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      try {
        // Compress pixels for storage efficiency
        const compressed = JSON.parse(JSON.stringify(project)) as AutosaveProject;
        compressed.frames?.forEach((f) =>
          f.layers?.forEach((l) => {
            l.pixels = compressPixels(l.pixels as Pixels);
          }),
        );
        compressed._compressed = true;
        compressed.savedAt = new Date().toISOString();
        localStorage.setItem("pixora-autosave", JSON.stringify(compressed));
      } catch (e) {
        console.warn("[Pixora] Autosave failed (storage full?)", e);
      }
    }, 1500);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [project, restorePrompt, autosaveChecked]);

  // Pause animation when tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  const [frameIndex, setFrameIndex] = useState(0);
  const [layerIndex, setLayerIndex] = useState(0);
  const [tool, setTool] = useState<Tool>("brush");
  const [primary, setPrimary] = useState("#000000");
  const [secondary, setSecondary] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(1);
  const [pixelPerfect, setPixelPerfect] = useState(false);
  const [stabilizer, setStabilizer] = useState(0);
  const [polygonSides, setPolygonSides] = useState(5);
  const [textSize, setTextSize] = useState(8);
  const [customBrush, setCustomBrush] = useState<{w: number, h: number, pixels: (string | null)[]} | null>(null);
  const [savedBrushes, setSavedBrushes] = useState<{w: number, h: number, pixels: (string | null)[]}[]>([]);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [ditherPattern, setDitherPattern] = useState("checker");
  const [sprayRadius, setSprayRadius] = useState(8);
  const [shapeMode, setShapeMode] = useState<"stroke"|"fill"|"both">("stroke");
  const [textFont, setTextFont] = useState("'Press Start 2P'");
  const [globalReplace, setGlobalReplace] = useState(false);
  const [sprayDensity, setSprayDensity] = useState(30);
  const [shadeMode, setShadeMode] = useState<"dodge" | "burn">("dodge");
  const [zoom, setZoom] = useState(16);
  const [showGrid, setShowGrid] = useState(true);
  const [tilePreview, setTilePreview] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [symX, setSymX] = useState(false);
  const [symY, setSymY] = useState(false);
  const [onionMode, setOnionMode] = useState(0); // 0: off, 1: normal, 2: pro (tinted)
  const [onionPrevOpacity, setOnionPrevOpacity] = useState(35);
  const [onionNextOpacity, setOnionNextOpacity] = useState(35);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(8);
  const [status, setStatus] = useState("Ready.");
  const [, forceRender] = useReducer((x) => x + 1, 0);

  // pro-feature state
  const [sym4, setSym4] = useState(false);
  const [ditherDensity, setDitherDensity] = useState(0.5);
  const [refUrl, setRefUrl] = useState<string | null>(null);
  const [refOpacity, setRefOpacity] = useState(0.5);
  const [showRef, setShowRef] = useState(true);
  const [recording, setRecording] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [clipMask, setClipMask] = useState<Set<number> | null>(null);
  const lassoPointsRef = useRef<[number, number][]>([]);
  const curveStateRef = useRef<number>(0);
  const smudgeBufferRef = useRef<(string | null)[]>([]);
  const cloneSourceRef = useRef<[number, number] | null>(null);
  const cloneCurrentRef = useRef<[number, number] | null>(null);
  const cloneBaseBufferRef = useRef<(string | null)[]>([]);
  const rulerStartRef = useRef<[number, number] | null>(null);
  const handStartRef = useRef<[number, number] | null>(null);
  const [showTimeline, setShowTimeline] = useState(true);
  const [selection, setSelection] = useState<SelectionBox | null>(null);
  const [exportScale, setExportScale] = useState(8);
  const [frameMenu, setFrameMenu] = useState<{ i: number; x: number; y: number } | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [hoverCoords, setHoverCoords] = useState<[number, number] | null>(null);
  const [showResize, setShowResize] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<{
    title: string;
    defaultValue?: string;
    placeholder?: string;
    onConfirm: (val: string) => void;
  } | null>(null);
  const refImgRef = useRef<HTMLImageElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const undoRef = useRef<string[]>([]);
  const redoRef = useRef<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topRulerRef = useRef<HTMLCanvasElement>(null);
  const leftRulerRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const panning = useRef(false);
  const spaceDown = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  // live stroke state
  const drawing = useRef(false);
  const baseRef = useRef<Pixels | null>(null);
  const workRef = useRef<Pixels | null>(null);
  const startRef = useRef<[number, number] | null>(null);
  const lastRef = useRef<[number, number] | null>(null);
  const moveRef = useRef<[number, number] | null>(null);

  const { width: W, height: H } = project;

  useEffect(() => {
    if (!showRulers) return;
    
    let rafId: number;
    const drawRulers = () => {
      const main = mainRef.current;
      const topRuler = topRulerRef.current;
      const leftRuler = leftRulerRef.current;
      if (!main || !topRuler || !leftRuler) return;

      const topCtx = topRuler.getContext("2d");
      const leftCtx = leftRuler.getContext("2d");
      if (!topCtx || !leftCtx) return;

      // Match canvas physical resolution to display size
      const rectT = topRuler.getBoundingClientRect();
      if (topRuler.width !== rectT.width) topRuler.width = rectT.width;
      if (topRuler.height !== rectT.height) topRuler.height = rectT.height;
      
      const rectL = leftRuler.getBoundingClientRect();
      if (leftRuler.width !== rectL.width) leftRuler.width = rectL.width;
      if (leftRuler.height !== rectL.height) leftRuler.height = rectL.height;

      // Clear
      topCtx.clearRect(0, 0, topRuler.width, topRuler.height);
      leftCtx.clearRect(0, 0, leftRuler.width, leftRuler.height);

      topCtx.fillStyle = "#1e1e24";
      topCtx.fillRect(0, 0, topRuler.width, topRuler.height);
      leftCtx.fillStyle = "#1e1e24";
      leftCtx.fillRect(0, 0, leftRuler.width, leftRuler.height);

      topCtx.fillStyle = "#888";
      topCtx.font = "9px sans-serif";
      leftCtx.fillStyle = "#888";
      leftCtx.font = "9px sans-serif";
      
      topCtx.textBaseline = "top";
      leftCtx.textBaseline = "middle";
      leftCtx.textAlign = "center";

      // Draw bottom/right border for the rulers
      topCtx.fillStyle = "#333";
      topCtx.fillRect(0, topRuler.height - 1, topRuler.width, 1);
      leftCtx.fillStyle = "#333";
      leftCtx.fillRect(leftRuler.width - 1, 0, 1, leftRuler.height);

      topCtx.fillStyle = "#888";
      leftCtx.fillStyle = "#888";

      const canvasW = project.width * zoom;
      const canvasH = project.height * zoom;

      // The canvas is centered in main if main is larger.
      const offsetX = Math.max(0, (main.clientWidth - canvasW) / 2) - main.scrollLeft;
      const offsetY = Math.max(0, (main.clientHeight - canvasH) / 2) - main.scrollTop;

      // Step calculation based on zoom
      let stepPx = 10;
      if (zoom >= 10) stepPx = 1;
      else if (zoom >= 5) stepPx = 2;
      else if (zoom >= 2) stepPx = 5;
      else if (zoom < 0.5) stepPx = 50;

      // Draw top ruler
      for (let i = 0; i <= project.width; i += stepPx) {
        const x = Math.round(offsetX + i * zoom);
        if (x < -50 || x > topRuler.width + 50) continue;
        const isMajor = i % (stepPx * 5) === 0;
        topCtx.fillRect(x, topRuler.height - (isMajor ? 10 : 5), 1, 10);
        if (isMajor) {
           topCtx.fillText(i.toString(), x + 2, 2);
        }
      }

      // Draw left ruler
      for (let i = 0; i <= project.height; i += stepPx) {
        const y = Math.round(offsetY + i * zoom);
        if (y < -50 || y > leftRuler.height + 50) continue;
        const isMajor = i % (stepPx * 5) === 0;
        leftCtx.fillRect(leftRuler.width - (isMajor ? 10 : 5), y, 10, 1);
        if (isMajor) {
           leftCtx.save();
           leftCtx.translate(leftRuler.width / 2 - 2, y + 10);
           leftCtx.rotate(-Math.PI / 2);
           leftCtx.fillText(i.toString(), 0, 0);
           leftCtx.restore();
        }
      }
    };

    drawRulers();
    
    const onScroll = () => {
       if (rafId) cancelAnimationFrame(rafId);
       rafId = requestAnimationFrame(drawRulers);
    };

    const main = mainRef.current;
    if (main) {
       main.addEventListener("scroll", onScroll);
       window.addEventListener("resize", onScroll);
       return () => {
         main.removeEventListener("scroll", onScroll);
         window.removeEventListener("resize", onScroll);
         cancelAnimationFrame(rafId);
       };
    }
  }, [showRulers, zoom, project.width, project.height]);
  const frame = project.frames[Math.min(frameIndex, project.frames.length - 1)];
  const activeLayer = frame.layers[Math.min(layerIndex, frame.layers.length - 1)];

  const pushUndo = useCallback(() => {
    undoRef.current.push(JSON.stringify(project));
    if (undoRef.current.length > 80) undoRef.current.shift();
    redoRef.current = [];
  }, [project]);

  const undo = useCallback(() => {
    if (!undoRef.current.length) return;
    redoRef.current.push(JSON.stringify(project));
    const prev = JSON.parse(undoRef.current.pop()!) as Project;
    setProject(prev);
    setFrameIndex((f) => clamp(f, 0, prev.frames.length - 1));
    setStatus("Undo");
  }, [project]);

  const redo = useCallback(() => {
    if (!redoRef.current.length) return;
    undoRef.current.push(JSON.stringify(project));
    setProject(JSON.parse(redoRef.current.pop()!) as Project);
    setStatus("Redo");
  }, [project]);

  // ---- rendering ----
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = W * zoom;
    canvas.height = H * zoom;
    ctx.imageSmoothingEnabled = false;

    // checkerboard bg
    const s = Math.max(4, Math.round(zoom / 2));
    for (let y = 0; y < canvas.height; y += s) {
      for (let x = 0; x < canvas.width; x += s) {
        ctx.fillStyle = ((x / s + y / s) & 1) === 0 ? "#2a2a33" : "#22222a";
        ctx.fillRect(x, y, s, s);
      }
    }

    // onion skin
    if (onionMode > 0) {
      const prev = project.frames[frameIndex - 1];
      const next = project.frames[frameIndex + 1];

      const drawTinted = (f: Frame, color: string, opacity: number) => {
        const c = document.createElement("canvas");
        c.width = canvas.width;
        c.height = canvas.height;
        const cx = c.getContext("2d")!;
        cx.imageSmoothingEnabled = false;
        cx.drawImage(compositeFrame(f, W, H), 0, 0, canvas.width, canvas.height);
        if (onionMode === 2) {
          cx.globalCompositeOperation = "source-in";
          cx.fillStyle = color;
          cx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.globalAlpha = opacity / 100;
        ctx.drawImage(c, 0, 0);
      };

      if (prev) drawTinted(prev, "#ff2222", onionPrevOpacity); // Red tint for past
      if (next) drawTinted(next, "#22ff22", onionNextOpacity); // Green tint for future
      ctx.globalAlpha = 1;
    }

    const composed = compositeFrame(
      frame,
      W,
      H,
      drawing.current ? activeLayer.id : undefined,
      drawing.current ? (workRef.current ?? undefined) : undefined,
    );
    ctx.drawImage(composed, 0, 0, canvas.width, canvas.height);

    // reference image overlay
    if (showRef && refImgRef.current) {
      ctx.globalAlpha = refOpacity;
      ctx.drawImage(refImgRef.current, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    // grid
    if (showGrid && zoom >= 6) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        ctx.moveTo(x * zoom + 0.5, 0);
        ctx.lineTo(x * zoom + 0.5, canvas.height);
      }
      for (let y = 0; y <= H; y++) {
        ctx.moveTo(0, y * zoom + 0.5);
        ctx.lineTo(canvas.width, y * zoom + 0.5);
      }
      ctx.stroke();
    }

    // selection marquee
    if (selection) {
      const sx = Math.min(selection.x0, selection.x1);
      const sy = Math.min(selection.y0, selection.y1);
      const sw = Math.abs(selection.x1 - selection.x0) + 1;
      const sh = Math.abs(selection.y1 - selection.y0) + 1;
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = "rgba(120,220,255,0.95)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sx * zoom + 0.5, sy * zoom + 0.5, sw * zoom, sh * zoom);
      ctx.setLineDash([]);
    }

    // hover cursor
    const hv = moveRef.current;
    if (hv && !drawing.current) {
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      const half = Math.floor(brushSize / 2);
      ctx.strokeRect(
        (hv[0] - half) * zoom,
        (hv[1] - half) * zoom,
        brushSize * zoom,
        brushSize * zoom,
      );
    }
  }, [
    W,
    H,
    zoom,
    showGrid,
    onionMode,
    project,
    frame,
    frameIndex,
    activeLayer.id,
    brushSize,
    selection,
    showRef,
    refOpacity,
  ]);

  useEffect(() => {
    render();
  }, [render]);

  // ---- main animation (timeline play) ----
  useEffect(() => {
    if (!playing || project.frames.length < 2) return;
    let timer: ReturnType<typeof setTimeout>;
    const tag = activeTag ? project.tags?.find((t) => t.id === activeTag) : null;
    const loop = () => {
      setFrameIndex((f) => {
        let nf = f + 1;
        if (tag) {
          if (nf > tag.to || nf < tag.from) nf = tag.from;
        } else {
          nf = nf % project.frames.length;
        }
        if (nf >= project.frames.length) nf = 0; // safety
        timer = setTimeout(loop, project.frames[nf].duration || 120);
        return nf;
      });
    };
    timer = setTimeout(loop, project.frames[frameIndex].duration || 120);
    return () => clearTimeout(timer);
  }, [playing, project.frames, frameIndex, activeTag, project.tags]);

  // ---- live preview panel ----
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancel = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let pFrame = 0;
    const loop = () => {
      if (cancel || project.frames.length === 0) return;
      const c = previewCanvasRef.current;
      if (c) {
        const ctx = c.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        c.width = W * 4;
        c.height = H * 4;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(compositeFrame(project.frames[pFrame], W, H), 0, 0, c.width, c.height);
      }
      const dur = project.frames[pFrame].duration || 120;
      pFrame = (pFrame + 1) % project.frames.length;
      timer = setTimeout(loop, dur);
    };
    loop();
    return () => {
      cancel = true;
      if (timer) clearTimeout(timer);
    };
  }, [project, W, H]);

  // ---- drawing helpers ----
  const stampPoints = useCallback(
    (target: Pixels, points: [number, number][], color: string | null) => {
      if (tool === "brush" && customBrush) {
        for (const [px, py] of points) {
          const cx = Math.floor(customBrush.w / 2);
          const cy = Math.floor(customBrush.h / 2);
          for(let iy = 0; iy < customBrush.h; iy++) {
            for(let ix = 0; ix < customBrush.w; ix++) {
              const bx = px - cx + ix;
              const by = py - cy + iy;
              const bColor = customBrush.pixels[iy * customBrush.w + ix];
              if (bColor !== null && bx >= 0 && bx < W && by >= 0 && by < H) {
                target[by * W + bx] = applyOpacity(bColor, brushOpacity);
              }
            }
          }
        }
        return;
      }
      const isPencil = tool === "pencil";
      const actualSize = isPencil ? 1 : isSpray ? sprayRadius : brushSize;
      const half = Math.floor(actualSize / 2);
      const isDither = tool === "dither" && color !== null;
      const isSpray = tool === "spray" && color !== null;
      const isShade = tool === "shade" && color !== null;

      const put = (px: number, py: number) => {
        for (let dy = 0; dy < actualSize; dy++) {
          for (let dx = 0; dx < actualSize; dx++) {
            // Tile seam wrap calculation
            let cx = px - half + dx;
            let cy = py - half + dy;
            
            if (tool === "tile") {
              cx = ((cx % W) + W) % W;
              cy = ((cy % H) + H) % H;
            } else if (cx < 0 || cy < 0 || cx >= W || cy >= H) {
              continue;
            }

            if (isDither) {
              if (ditherPattern === "checker" && ((cx + cy) % 2 === 0)) continue;
              if (ditherPattern === "bayer") {
                const bayer = [ [0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5] ];
                if (bayer[cy % 4][cx % 4] > 7) continue;
              }
              if (ditherPattern === "noise" && Math.random() > 0.5) continue;
            }
            if (clipMask && !clipMask.has(cy * W + cx)) continue;
            
            
            if (isSpray) {
              // Circular brush bounds for spray
              const dist = Math.sqrt(Math.pow(dx - half, 2) + Math.pow(dy - half, 2));
              if (dist > half) continue;
              // Density probability
              if (Math.random() * 100 > sprayDensity) continue;
            }
            
            if (tool === "pattern") {
               // 4x4 checkerboard pattern
               if ((cx + cy) % 2 === 0) continue;
            }

            const idx = cy * W + cx;

            if (isShade) {
              const currentHex = target[idx];
              if (!currentHex) continue; // Don't shade transparent pixels
              
              // Simple dodge/burn by extracting RGB and lerping
              const cHex = (currentHex as string).replace("#", "");
              let r = parseInt(cHex.substring(0,2), 16);
              let g = parseInt(cHex.substring(2,4), 16);
              let b = parseInt(cHex.substring(4,6), 16);
              
              const factor = 1.2; // 20% change per stamp
              if (shadeMode === "dodge") {
                r = Math.min(255, Math.round(r * factor));
                g = Math.min(255, Math.round(g * factor));
                b = Math.min(255, Math.round(b * factor));
              } else {
                r = Math.max(0, Math.round(r / factor));
                g = Math.max(0, Math.round(g / factor));
                b = Math.max(0, Math.round(b / factor));
              }
              target[idx] = "#" + [r,g,b].map(v => v.toString(16).padStart(2, '0')).join('');
              continue;
            }

            target[idx] = color;
          }
        }
      };
      for (const [x, y] of points) {
        put(x, y);
        if (symX) put(W - 1 - x, y);
        if (symY) put(x, H - 1 - y);
        if (symX && symY) put(W - 1 - x, H - 1 - y);
        if (sym4) {
          put(y, x);
          put(H - 1 - y, x);
          put(y, W - 1 - x);
          put(H - 1 - y, W - 1 - x);
        }
      }
    },
    [brushSize, W, H, symX, symY, sym4, tool, ditherDensity, clipMask],
  );

  const commitWork = useCallback(
    (work: Pixels) => {
      pushUndo();
      setProject((p) => {
        const np = clone(p);
        np.frames[frameIndex].layers[layerIndex].pixels = work;
        return np;
      });
    },
    [pushUndo, frameIndex, layerIndex],
  );

  const eventToCell = (e: React.PointerEvent): [number, number] => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * W);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * H);
    return [clamp(x, 0, W - 1), clamp(y, 0, H - 1)];
  };

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom((z) => clamp(z + (e.deltaY > 0 ? -1 : 1), 1, 128));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button === 1 || spaceDown.current) {
      e.preventDefault();
      canvasRef.current?.setPointerCapture(e.pointerId);
      panning.current = true;
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        sx: mainRef.current!.scrollLeft,
        sy: mainRef.current!.scrollTop,
      };
      return;
    }
    if (activeLayer.locked || !activeLayer.visible) {
      setStatus("Layer is locked/hidden");
      return;
    }
    canvasRef.current!.setPointerCapture(e.pointerId);
    const [x, y] = eventToCell(e);
    const color = e.button === 2 || e.shiftKey ? secondary : primary;
    const erase = tool === "eraser" || e.button === 2;

    if (tool === "text") {
      setCustomPrompt({
        title: "Text Tool",
        defaultValue: "Pixel",
        placeholder: "Enter text to draw",
        onConfirm: (text) => {
          if (!text) {
             setCustomPrompt(null);
             return;
          }
          const canvas = document.createElement("canvas");
          canvas.width = W;
          canvas.height = H;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "white";
            ctx.font = `bold ${textSize}px ${textFont}, monospace, sans-serif`;
            ctx.fillText(text, x, y + textSize);
            const data = ctx.getImageData(0, 0, W, H).data;
            const work = activeLayer.pixels.slice();
            for (let i = 0; i < W * H; i++) {
              if (data[i * 4 + 3] > 128) work[i] = color;
            }
            commitWork(work);
          }
          setCustomPrompt(null);
        }
      });
      return;
    }
    
    if (tool === "wand") {
      const idxs = floodFill(
        activeLayer.pixels,
        W,
        H,
        x,
        y,
        activeLayer.pixels[y * W + x] as string,
      );
      if (idxs.length) {
        setClipMask(new Set(idxs));
        setStatus(`Mask created (${idxs.length} px). Click 'Clear Mask' to remove.`);
      }
      return;
    }

    if (tool === "pick") {
      const c = compositeFrame(frame, W, H).getContext("2d")!.getImageData(x, y, 1, 1).data;
      if (c[3] > 0) {
        const hex = "#" + [c[0], c[1], c[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
        setPrimary(hex);
        setStatus(`Picked ${hex}`);
      }
      return;
    }
    if (tool === "fill") {
      const idxs = floodFill(
        activeLayer.pixels,
        W,
        H,
        x,
        y,
        erase ? (null as unknown as string) : color,
      );
      if (idxs.length) {
        const work = activeLayer.pixels.slice();
        for (const i of idxs) work[i] = erase ? null : color;
        commitWork(work);
      }
      return;
    }
    if (tool === "replace") {
      const targetColor = activeLayer.pixels[y * W + x];
      if (targetColor === (erase ? null : color)) return;
      
      if (globalReplace) {
        mutate((p) => {
          for (const f of p.frames) {
            for (const l of f.layers) {
              for (let i = 0; i < l.pixels.length; i++) {
                if (l.pixels[i] === targetColor) l.pixels[i] = erase ? null : color;
              }
            }
          }
        });
      } else {
        const work = activeLayer.pixels.slice();
        let changed = false;
        for (let i = 0; i < W * H; i++) {
           if (work[i] === targetColor) {
               work[i] = erase ? null : color;
               changed = true;
           }
        }
        if (changed) commitWork(work);
      }
      return;
    }

    drawing.current = true;
    baseRef.current = activeLayer.pixels.slice();
    workRef.current = activeLayer.pixels.slice();
    startRef.current = [x, y];
    lastRef.current = [x, y];
    strokeCellsRef.current = [[x, y]];
    mouseHistoryRef.current = [];
    for (let i = 0; i < (stabilizer * 2 + 1); i++) mouseHistoryRef.current.push([x, y]);

    if (tool === "lasso") {
      lassoPointsRef.current = [[x, y]];
    } else if (tool === "curve") {
      if (curveStateRef.current === 1) {
        lastRef.current = [x, y]; // end point
        stampPoints(workRef.current, linePoints(start[0], start[1], x, y), fillColor);
      } else if (curveStateRef.current === 2) {
        const pts = quadraticBezierPoints(start[0], start[1], x, y, lastRef.current[0], lastRef.current[1]);
        workRef.current = base.slice();
        stampPoints(workRef.current, pts, fillColor);
      }
    } else if (tool === "smudge") {
      const last = lastRef.current!;
      const pts = linePoints(last[0], last[1], x, y);
      const rad = Math.max(1, Math.floor(brushSize / 2));
      for (const p of pts) {
         const cx = p[0], cy = p[1];
         // Simple smudge: take color from start and paint it, fading out?
         // Let's just do a basic blend with neighbors
         boxBlur(workRef.current, W, H, cx, cy, rad, true); // true = smudge mode (directional)
      }
      lastRef.current = [x, y];
    } else if (tool === "blur") {
      const last = lastRef.current!;
      const pts = linePoints(last[0], last[1], x, y);
      const rad = Math.max(1, Math.floor(brushSize / 2));
      for (const p of pts) {
         boxBlur(workRef.current, W, H, p[0], p[1], rad, false);
      }
      lastRef.current = [x, y];
    } else if (["brush", "eraser", "dither", "pencil", "spray", "shade", "tile", "pattern"].includes(tool)) {
      stampPoints(workRef.current, [[x, y]], erase ? null : color);
      audio.playDraw();
    }
    if (tool === "select") setSelection({ x0: x, y0: y, x1: x, y1: y });
    
    if (tool === "lasso") {
      lassoPointsRef.current = [[x, y]];
    } else if (tool === "curve") {
      if (curveStateRef.current === 0) {
        curveStateRef.current = 1;
        startRef.current = [x, y];
        lastRef.current = [x, y];
      } else if (curveStateRef.current === 2) {
        curveStateRef.current = 0;
        drawing.current = false;
        commitWork(workRef.current!);
        workRef.current = null;
        baseRef.current = null;
        render();
        return;
      }
    } else if (tool === "smudge" || tool === "blur") {
      smudgeBufferRef.current = activeLayer.pixels.slice();
    }
    (canvasRef.current as unknown as { _erase?: boolean })._erase = erase;
    (canvasRef.current as unknown as { _color?: string })._color = color;
    render();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (panning.current) {
      if (mainRef.current) {
        mainRef.current.scrollLeft = panStartRef.current.sx - (e.clientX - panStartRef.current.x);
        mainRef.current.scrollTop = panStartRef.current.sy - (e.clientY - panStartRef.current.y);
      }
      return;
    }
    let [x, y] = eventToCell(e);
    moveRef.current = [x, y];
    setHoverCoords([x, y]);
    if (!drawing.current && !(tool === "curve" && curveStateRef.current === 2)) {
      render();
      return;
    }
    
    if (stabilizer > 0 && (tool === "brush" || tool === "pencil" || tool === "eraser")) {
      mouseHistoryRef.current.push([x, y]);
      if (mouseHistoryRef.current.length > (stabilizer * 2 + 1)) {
        mouseHistoryRef.current.shift();
      }
      let avgX = 0, avgY = 0;
      for (const p of mouseHistoryRef.current) { avgX += p[0]; avgY += p[1]; }
      x = Math.round(avgX / mouseHistoryRef.current.length);
      y = Math.round(avgY / mouseHistoryRef.current.length);
    }
    
    const base = baseRef.current!;
    const work = base.slice();
    workRef.current = work;
    const start = startRef.current!;
    const erase = (canvasRef.current as unknown as { _erase?: boolean })._erase;
    const color = (canvasRef.current as unknown as { _color?: string })._color ?? primary;
    const fillColor = erase ? null : color;

    if (tool === "hand" && handStartRef.current) {
      const dx = e.clientX - handStartRef.current[0];
      const dy = e.clientY - handStartRef.current[1];
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      handStartRef.current = [e.clientX, e.clientY];
      return;
    }
    if (tool === "ruler") {
      render();
      const dist = Math.sqrt(Math.pow(x - rulerStartRef.current![0], 2) + Math.pow(y - rulerStartRef.current![1], 2));
      setStatus(`Ruler distance: ${dist.toFixed(1)} px`);
      return;
    }
    if (tool === "magnetic_lasso") {
      lassoPointsRef.current.push([x, y]);
      render();
      return;
    }
    if (tool === "clone" && cloneSourceRef.current && cloneCurrentRef.current) {
       const dx = x - cloneCurrentRef.current[0];
       const dy = y - cloneCurrentRef.current[1];
       const srcX = cloneSourceRef.current[0] + dx;
       const srcY = cloneSourceRef.current[1] + dy;
       if (srcX>=0 && srcY>=0 && srcX<W && srcY<H) {
           const srcColor = cloneBaseBufferRef.current[srcY*W + srcX];
           if (srcColor) {
               stampPoints(workRef.current, [[x, y]], srcColor);
           }
       }
       cloneCurrentRef.current = [x, y];
       cloneSourceRef.current = [srcX, srcY];
    }
    if (["noise", "halftone", "stamp"].includes(tool)) {
      stampPoints(workRef.current, linePoints(lastRef.current![0], lastRef.current![1], x, y), color);
      lastRef.current = [x, y];
    }
    if (tool === "lasso") {
      lassoPointsRef.current.push([x, y]);
      render();
      return;
    }
    if (tool === "hand") {
      handStartRef.current = null;
      return;
    }
    if (tool === "ruler") {
      rulerStartRef.current = null;
      setStatus("Ready.");
      return;
    }
    if (tool === "magnetic_lasso") {
      const pts = lassoPointsRef.current;
      if (pts.length > 2) {
        const minX = Math.min(...pts.map(p => p[0]));
        const maxX = Math.max(...pts.map(p => p[0]));
        const minY = Math.min(...pts.map(p => p[1]));
        const maxY = Math.max(...pts.map(p => p[1]));
        const idxs = [];
        for (let iy = minY; iy <= maxY; iy++) {
          for (let ix = minX; ix <= maxX; ix++) {
            let inside = false;
            for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
              const xi = pts[i][0], yi = pts[i][1];
              const xj = pts[j][0], yj = pts[j][1];
              const intersect = ((yi > iy) !== (yj > iy)) && (ix < (xj - xi) * (iy - yi) / (yj - yi) + xi);
              if (intersect) inside = !inside;
            }
            if (inside) idxs.push(iy * W + ix);
          }
        }
        if (idxs.length) {
          setClipMask(new Set(idxs));
          setStatus(`Magnetic mask created (${idxs.length} px).`);
        }
      }
      lassoPointsRef.current = [];
      drawing.current = false;
      render();
      return;
    }
    if (tool === "select") {
      setSelection({ x0: start[0], y0: start[1], x1: x, y1: y });
      return;
    }
    if (tool === "hand") {
      handStartRef.current = [e.clientX, e.clientY];
      return;
    }
    if (tool === "zoom") {
      const zoomFactor = e.altKey ? 0.8 : 1.25;
      setZoom(z => clamp(z * zoomFactor, 0.5, 32));
      return;
    }
    if (tool === "ruler") {
      rulerStartRef.current = [x, y];
      return;
    }
    if (tool === "color_select") {
      const targetColor = activeLayer.pixels[y * W + x];
      if (targetColor) {
         const newMask = new Set<number>();
         for (let i = 0; i < W * H; i++) {
           if (activeLayer.pixels[i] === targetColor) {
              newMask.add(i);
           }
         }
         setClipMask(newMask);
         setStatus(`Color mask created (${newMask.size} px).`);
      }
      return;
    }
    if (tool === "clone") {
      if (e.altKey) {
        cloneSourceRef.current = [x, y];
        setStatus("Clone source set.");
        return;
      }
      if (cloneSourceRef.current) {
        cloneBaseBufferRef.current = activeLayer.pixels.slice();
        cloneCurrentRef.current = [x, y];
      }
    }
    if (["noise", "halftone", "stamp"].includes(tool)) {
      stampPoints(workRef.current, [[x, y]], color);
      audio.playDraw();
    }
    if (["brush", "eraser", "dither", "pencil", "spray", "shade", "tile", "pattern"].includes(tool)) {
      const last = lastRef.current!;
      const pts = linePoints(last[0], last[1], x, y);
      
      if (pixelPerfect && (tool === "pencil" || brushSize === 1)) {
        if (strokeCellsRef.current.length > 0 && pts.length > 0 && pts[0][0] === strokeCellsRef.current[strokeCellsRef.current.length-1][0] && pts[0][1] === strokeCellsRef.current[strokeCellsRef.current.length-1][1]) {
            strokeCellsRef.current.push(...pts.slice(1));
        } else {
            strokeCellsRef.current.push(...pts);
        }
        
        const thinned = strokeCellsRef.current.length >= 3 ? filterPixelPerfect(strokeCellsRef.current) : strokeCellsRef.current;
        workRef.current = baseRef.current!.slice();
        stampPoints(workRef.current, thinned, fillColor);
      } else {
        stampPoints(work, pts, fillColor);
        const prev = baseRef.current!;
        workRef.current = accumulateBrush(prev, work);
      }
      lastRef.current = [x, y];
    } else if (tool === "line") {
      stampPoints(work, linePoints(start[0], start[1], x, y), fillColor);
    } else if (tool === "rect") {
      if (shapeMode === "fill" || shapeMode === "both") stampPoints(work, rectPoints(start[0], start[1], x, y, true), shapeMode === "both" ? secondary : fillColor);
      if (shapeMode === "stroke" || shapeMode === "both") stampPoints(work, rectPoints(start[0], start[1], x, y, false), fillColor);
    } else if (tool === "circle") {
      if (shapeMode === "fill" || shapeMode === "both") stampPoints(work, ellipsePoints(start[0], start[1], x, y, true), shapeMode === "both" ? secondary : fillColor);
      if (shapeMode === "stroke" || shapeMode === "both") stampPoints(work, ellipsePoints(start[0], start[1], x, y, false), fillColor);
    } else if (tool === "polygon") {
      // Polygon fill logic not fully ray-casted yet, fallback to stroke
      stampPoints(work, polygonPoints(start[0], start[1], x, y, polygonSides), fillColor);
    } else if (tool === "grad") {
      drawGradient(work, W, H, start[0], start[1], x, y, primary, secondary);
    } else if (tool === "move") {
      const dx = x - start[0],
        dy = y - start[1];
      const moved = makePixels(W, H);
      for (let iy = 0; iy < H; iy++)
        for (let ix = 0; ix < W; ix++) {
          const ny = iy - dy,
            nx = ix - dx;
          if (nx >= 0 && ny >= 0 && nx < W && ny < H) moved[iy * W + ix] = base[ny * W + nx];
        }
      workRef.current = moved;
    }
    render();
  };

  // brush accumulation across moves
  const brushAccum = useRef<Pixels | null>(null);
  const strokeCellsRef = useRef<[number, number][]>([]);
  const mouseHistoryRef = useRef<[number, number][]>([]);

  function polygonPoints(cx: number, cy: number, x: number, y: number, sides: number) {
    const r = Math.hypot(x - cx, y - cy);
    const angleOffset = Math.atan2(y - cy, x - cx);
    const pts: [number, number][] = [];
    const vertices: [number, number][] = [];
    for (let i = 0; i < sides; i++) {
      const angle = angleOffset + (Math.PI * 2 * i) / sides;
      vertices.push([Math.round(cx + Math.cos(angle) * r), Math.round(cy + Math.sin(angle) * r)]);
    }
    for (let i = 0; i < sides; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % sides];
      pts.push(...linePoints(p1[0], p1[1], p2[0], p2[1]));
    }
    return pts;
  }


  function quadraticBezierPoints(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) {
    const pts: [number, number][] = [];
    const steps = 30;
    for(let i=0; i<=steps; i++) {
       const t = i/steps;
       const u = 1-t;
       const px = Math.round(u*u*x0 + 2*u*t*cx + t*t*x1);
       const py = Math.round(u*u*y0 + 2*u*t*cy + t*t*y1);
       if (i > 0) {
          const prev = pts[pts.length-1];
          pts.push(...linePoints(prev[0], prev[1], px, py).slice(1));
       } else {
          pts.push([px, py]);
       }
    }
    return pts;
  }

  function boxBlur(work: (string | null)[], W: number, H: number, x: number, y: number, rad: number, isSmudge: boolean) {
     let r=0, g=0, b=0, count=0;
     for(let dy=-rad; dy<=rad; dy++) {
       for(let dx=-rad; dx<=rad; dx++) {
         const nx = x+dx, ny = y+dy;
         if (nx>=0 && ny>=0 && nx<W && ny<H) {
            const hex = isSmudge ? smudgeBufferRef.current[ny*W+nx] : work[ny*W+nx];
            if (hex) {
               const rgb = hexToRgb(hex);
               r+=rgb[0]; g+=rgb[1]; b+=rgb[2]; count++;
            }
         }
       }
     }
     if (count > 0) {
        const avgHex = "#" + [Math.round(r/count), Math.round(g/count), Math.round(b/count)].map(v => v.toString(16).padStart(2, '0')).join("");
        for(let dy=-rad; dy<=rad; dy++) {
          for(let dx=-rad; dx<=rad; dx++) {
            const nx = x+dx, ny = y+dy;
            if (nx>=0 && ny>=0 && nx<W && ny<H && dx*dx+dy*dy <= rad*rad) {
               if (isSmudge) {
                 // write to both work and smudgeBuffer
                 work[ny*W+nx] = avgHex;
                 smudgeBufferRef.current[ny*W+nx] = avgHex;
               } else {
                 work[ny*W+nx] = avgHex;
               }
            }
          }
        }
     }
  }

  function applyOpacity(hex: string | null, opacity: number): string | null {
    if (!hex) return null;
    if (opacity >= 100) return hex;
    const a = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');
    // if hex already has opacity, we just overwrite it for now, or just append if it's 7 chars (#RRGGBB)
    return hex.slice(0, 7) + a;
  }

  function hexToRgb(hex: string) {
    const c = hex.replace("#", "");
    return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)];
  }

  function drawGradient(work: (string | null)[], W: number, H: number, x0: number, y0: number, x1: number, y1: number, c1: string, c2: string) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return;
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    for (let iy = 0; iy < H; iy++) {
      for (let ix = 0; ix < W; ix++) {
        const dot = ((ix - x0) * dx + (iy - y0) * dy) / lenSq;
        const t = Math.max(0, Math.min(1, dot));
        const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
        const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
        const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
        work[iy * W + ix] = "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join("");
      }
    }
  }

  function filterPixelPerfect(points: [number, number][]) {
    if (points.length < 3) return points;
    const result: [number, number][] = [points[0]];
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = result[result.length - 1]; // Use last accepted point as reference
      const p2 = points[i];
      const p3 = points[i + 1];
      
      const dx1 = Math.abs(p2[0] - p1[0]);
      const dy1 = Math.abs(p2[1] - p1[1]);
      const dx2 = Math.abs(p3[0] - p2[0]);
      const dy2 = Math.abs(p3[1] - p2[1]);
      
      if (dx1 + dy1 === 1 && dx2 + dy2 === 1 && dx1 !== dx2) {
        continue;
      }
      result.push(p2);
    }
    result.push(points[points.length - 1]);
    return result;
  }
  function accumulateBrush(_base: Pixels, latest: Pixels): Pixels {
    if (!brushAccum.current) brushAccum.current = _base.slice();
    for (let i = 0; i < latest.length; i++) {
      if (latest[i] !== _base[i]) brushAccum.current[i] = latest[i];
    }
    return brushAccum.current;
  }

  const onPointerUp = () => {
    if (panning.current) {
      panning.current = false;
      return;
    }
    if (!drawing.current) return;
    drawing.current = false;
    if (tool === "select") {
      return;
    }
    if (tool === "lasso") {
      const pts = lassoPointsRef.current;
      if (pts.length > 2) {
        const minX = Math.min(...pts.map(p => p[0]));
        const maxX = Math.max(...pts.map(p => p[0]));
        const minY = Math.min(...pts.map(p => p[1]));
        const maxY = Math.max(...pts.map(p => p[1]));
        const idxs = [];
        for (let iy = minY; iy <= maxY; iy++) {
          for (let ix = minX; ix <= maxX; ix++) {
            let inside = false;
            for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
              const xi = pts[i][0], yi = pts[i][1];
              const xj = pts[j][0], yj = pts[j][1];
              const intersect = ((yi > iy) !== (yj > iy)) && (ix < (xj - xi) * (iy - yi) / (yj - yi) + xi);
              if (intersect) inside = !inside;
            }
            if (inside) idxs.push(iy * W + ix);
          }
        }
        if (idxs.length) {
          setClipMask(new Set(idxs));
          setStatus(`Lasso mask created (${idxs.length} px).`);
        }
      }
      lassoPointsRef.current = [];
      drawing.current = false;
      render();
      return;
    }
    if (tool === "curve") {
      if (curveStateRef.current === 1) {
        curveStateRef.current = 2; // Transition to bending state
        return; // Keep drawing=true to allow bending
      }
    }
    const work =
      (tool === "brush" || tool === "eraser") && brushAccum.current
        ? brushAccum.current
        : workRef.current;
    if (work) commitWork(work);
    brushAccum.current = null;
    workRef.current = null;
    baseRef.current = null;
    render();
  };

  const kbdRef = useRef<Partial<KeyboardHandlers>>({});
  // ---- keyboard ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") spaceDown.current = true;
      const el = e.target as HTMLElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT"))
        return;
      const h = kbdRef.current;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) h.redo?.();
        else h.undo?.();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        h.redo?.();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        h.copySelection?.();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        e.preventDefault();
        h.pasteSelection?.();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "x") {
        e.preventDefault();
        h.copySelection?.();
        h.clearSelection?.();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (h.selection) h.clearSelection?.();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        h.setCmdOpen?.((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        h.setSelection?.(null);
        h.setCmdOpen?.(false);
        return;
      }
      let toolKey = e.key.toLowerCase();
      if (e.shiftKey) toolKey = "shift+" + toolKey;
      const t = TOOLS.find((tt) => tt.key.toLowerCase() === toolKey);
      if (t) h.setTool?.(t.id);
      
      if (e.key.toLowerCase() === "g" && !e.shiftKey) h.setShowGrid?.((v) => !v);
      if (e.key === "[") h.setBrushSize?.((s) => Math.max(1, s - 1));
      if (e.key === "]") h.setBrushSize?.((s) => Math.min(16, s + 1));
      if (e.key === "ArrowLeft") h.setFrameIndex?.((f) => Math.max(0, f - 1));
      if (e.key === "ArrowRight")
        h.setFrameIndex?.((f) => Math.min((h.project?.frames.length ?? 1) - 1, f + 1));
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") spaceDown.current = false;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // ---- mutations ----
  const mutate = (fn: (p: Project) => void, snapshot = true) => {
    if (snapshot) pushUndo();
    setProject((p) => {
      const np = clone(p);
      fn(np);
      return np;
    });
  };

  const newProject = (w: number, h: number) => {
    undoRef.current = [];
    redoRef.current = [];
    setProject(createProject(w, h));
    setFrameIndex(0);
    setLayerIndex(0);
    setStatus(`New ${w}×${h} project`);
  };

  const promptResize = () => {
    setShowResize(true);
  };

  const handleResize = (w: number, h: number, scale: boolean) => {
    if (w > 0 && h > 0) {
      mutate((p) => {
        const np = resizeProject(p, w, h, scale);
        Object.assign(p, np);
      }, true);
      setStatus(`Resized to ${w}x${h}`);
    }
  };

  // ---- palette ----
  const [selPalette, setSelPalette] = useState(0);
  const [rampA, setRampA] = useState("#1d2b53");
  const [rampB, setRampB] = useState("#ff004d");
  const [rampSteps, setRampSteps] = useState(6);

  // ---- export / io ----
  const exportPNG = (scale = 8) => {
    const src = compositeFrame(frame, W, H);
    const out = document.createElement("canvas");
    out.width = W * scale;
    out.height = H * scale;
    const c = out.getContext("2d")!;
    c.imageSmoothingEnabled = false;
    c.drawImage(src, 0, 0, out.width, out.height);
    downloadCanvas(out, `pixora-frame-${frameIndex + 1}.png`);
    audio.playSuccess();
  };
  const exportSheet = (scale = 8) => {
    const tag = activeTag ? project.tags?.find((t) => t.id === activeTag) : null;
    const exportFrames = tag ? project.frames.slice(tag.from, tag.to + 1) : project.frames;
    const out = document.createElement("canvas");
    out.width = W * exportFrames.length * scale;
    out.height = H * scale;
    const c = out.getContext("2d")!;
    c.imageSmoothingEnabled = false;
    exportFrames.forEach((f, i) =>
      c.drawImage(compositeFrame(f, W, H), i * W * scale, 0, W * scale, H * scale),
    );
    downloadCanvas(out, tag ? `pixora-spritesheet-${tag.name}.png` : "pixora-spritesheet.png");
    audio.playSuccess();
  };
  const downloadCanvas = (c: HTMLCanvasElement, name: string) => {
    const a = document.createElement("a");
    a.download = name;
    a.href = c.toDataURL("image/png");
    a.click();
  };
  const saveJSON = () => {
    const blob = new Blob([JSON.stringify(project)], { type: "application/json" });
    const a = document.createElement("a");
    a.download = "pixora-project.json";
    a.href = URL.createObjectURL(blob);
    a.click();
  };
  const loadJSON = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const raw = JSON.parse(String(r.result));
        if (!raw.frames || !raw.width) throw new Error("bad");
        const p = migrateProject(raw);
        undoRef.current = [];
        redoRef.current = [];
        setProject(p);
        setFrameIndex(0);
        setLayerIndex(0);
        setStatus(`✓ Loaded "${p.app}" — ${p.width}×${p.height}px, ${p.frames.length} frames`);
      } catch {
        setStatus("⚠ Invalid project file");
      }
    };
    r.readAsText(file);
  };

  // ---- layer effects ----
  const applyToLayer = (fn: (px: Pixels) => Pixels) => {
    mutate((p) => {
      const l = p.frames[frameIndex].layers[layerIndex];
      l.pixels = fn(l.pixels);
    });
  };
  const doFlipH = () => {
    applyToLayer((px) => flipH(px, W, H));
    setStatus("Flipped horizontally");
  };
  const doFlipV = () => {
    applyToLayer((px) => flipV(px, W, H));
    setStatus("Flipped vertically");
  };

  const doFilter = (type: string) => {
    applyToLayer(px => {
      if (type === "sepia") return applySepia(px);
      if (type === "grayscale") return applyGrayscale(px);
      if (type === "brightness_up") return applyBrightness(px, 30);
      if (type === "brightness_down") return applyBrightness(px, -30);
      if (type === "posterize") return applyPosterize(px, 4);
      if (type === "outline") return applyAutoOutline(px, W, H, secondary);
      return px;
    });
    setStatus(`Applied ${type}`);
  };
  const doTransform = (type: string) => {
    if (type === "rotate") {
       const a = prompt("Enter rotation angle in degrees:", "45");
       if (a && !isNaN(+a)) {
          applyToLayer(px => applyArbitraryRotate(px, W, H, +a));
          setStatus(`Rotated ${a} deg`);
       }
    }
    if (type === "scale") {
       const s = prompt("Enter scale factor (e.g. 2 for 200%, 0.5 for 50%):", "2");
       if (s && !isNaN(+s)) {
          applyToLayer(px => applyScale(px, W, H, +s));
          setStatus(`Scaled ${s}x`);
       }
    }
  };

  const doRotate = () => {
    applyToLayer((px) => rotate90(px, W, H));
    setStatus("Rotated 90°");
  };
  const doOutline = () => {
    applyToLayer((px) => outline(px, W, H, primary));
    setStatus("Outline added");
  };
  const doHueShift = (deg: number) => {
    applyToLayer((px) => shiftHue(px, deg));
    setStatus(`Hue ${deg > 0 ? "+" : ""}${deg}°`);
  };
  const doGrayscale = () => {
    applyToLayer((px) => grayscale(px));
    setStatus("Grayscale applied");
  };
  const doInvert = () => {
    applyToLayer((px) => invert(px));
    setStatus("Invert applied");
  };

  // ---- selection ops ----
  const selBounds = () => {
    if (!selection) return null;
    return {
      minX: Math.min(selection.x0, selection.x1),
      maxX: Math.max(selection.x0, selection.x1),
      minY: Math.min(selection.y0, selection.y1),
      maxY: Math.max(selection.y0, selection.y1),
    };
  };
  const clipboardRef = useRef<{ w: number; h: number; px: Pixels } | null>(null);
  const fillSelection = () => {
    if (!selection) return;
    mutate((p) => {
      const l = p.frames[frameIndex]?.layers.find((ll) => ll.id === activeLayer);
      if (!l) return;
      const { x0, y0, x1, y1 } = selection;
      const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
      const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
      for (let iy = minY; iy < maxY; iy++) {
        for (let ix = minX; ix < maxX; ix++) {
          if (ix >= 0 && iy >= 0 && ix < W && iy < H) l.pixels[iy * W + ix] = primary;
        }
      }
    });
  };

  const strokeSelection = () => {
    if (!selection) return;
    mutate((p) => {
      const l = p.frames[frameIndex]?.layers.find((ll) => ll.id === activeLayer);
      if (!l) return;
      const { x0, y0, x1, y1 } = selection;
      const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
      const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
      for (let ix = minX; ix < maxX; ix++) {
        if (ix >= 0 && ix < W) {
          if (minY >= 0 && minY < H) l.pixels[minY * W + ix] = primary;
          if (maxY - 1 >= 0 && maxY - 1 < H) l.pixels[(maxY - 1) * W + ix] = primary;
        }
      }
      for (let iy = minY; iy < maxY; iy++) {
        if (iy >= 0 && iy < H) {
          if (minX >= 0 && minX < W) l.pixels[iy * W + minX] = primary;
          if (maxX - 1 >= 0 && maxX - 1 < W) l.pixels[iy * W + (maxX - 1)] = primary;
        }
      }
    });
  };

  const importImagePixelate = (file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;
      
      mutate((p) => {
        const frame = p.frames[frameIndex];
        const newLayer = {
          id: Math.random().toString(36).slice(2, 9),
          name: "Import",
          visible: true,
          locked: false,
          opacity: 1,
          pixels: new Array(W * H).fill(null),
        };
        for (let i = 0; i < W * H; i++) {
          const r = data[i * 4];
          const g = data[i * 4 + 1];
          const b = data[i * 4 + 2];
          const a = data[i * 4 + 3];
          if (a > 10) {
            newLayer.pixels[i] = "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
          }
        }
        frame.layers.splice(0, 0, newLayer); // Insert at index 0 (bottom) or push (top)? Usually top is push, but layers are drawn bottom-to-top. Let's push to top. Wait, let's push.
        p.activeLayer = newLayer.id;
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const deleteSelection = () => {
    if (!selection) return;
    mutate((p) => {
      const l = p.frames[frameMenu?.i ?? 0]?.layers.find((ll) => ll.id === activeLayer);
      if (!l) return;
      const { x0, y0, x1, y1 } = selection;
      const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
      const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
      for (let iy = minY; iy < maxY; iy++) {
        for (let ix = minX; ix < maxX; ix++) {
          if (ix >= 0 && iy >= 0 && ix < W && iy < H) {
            l.pixels[iy * W + ix] = null;
          }
        }
      }
    });
  };

  const copySelection = () => {
    const b = selBounds();
    if (!b) return;
    const w = b.maxX - b.minX + 1,
      h = b.maxY - b.minY + 1;
    const px = makePixels(w, h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        px[y * w + x] = activeLayer.pixels[(b.minY + y) * W + (b.minX + x)];
    clipboardRef.current = { w, h, px };
    setStatus(`Copied ${w}×${h}`);
  };
  const pasteSelection = () => {
    const clip = clipboardRef.current;
    if (!clip) {
      setStatus("Clipboard empty");
      return;
    }
    const b = selBounds();
    const ox = b ? b.minX : 0,
      oy = b ? b.minY : 0;
    applyToLayer((px) => {
      const out = px.slice();
      for (let y = 0; y < clip.h; y++)
        for (let x = 0; x < clip.w; x++) {
          const tx = ox + x,
            ty = oy + y;
          if (tx >= 0 && ty >= 0 && tx < W && ty < H && clip.px[y * clip.w + x])
            out[ty * W + tx] = clip.px[y * clip.w + x];
        }
      return out;
    });
    setStatus("Pasted");
  };
  const clearSelection = () => {
    const b = selBounds();
    if (!b) return;
    applyToLayer((px) => {
      const out = px.slice();
      for (let y = b.minY; y <= b.maxY; y++)
        for (let x = b.minX; x <= b.maxX; x++) out[y * W + x] = null;
      return out;
    });
    setStatus("Cleared selection");
  };

  // ---- reference image ----
  const loadRef = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      refImgRef.current = img;
      setRefUrl(url);
      setShowRef(true);
      forceRender();
      setStatus("Reference loaded");
    };
    img.src = url;
  };
  const extractPalette = () => {
    const img = refImgRef.current;
    if (!img) {
      setStatus("Load a reference first");
      return;
    }
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const cx = c.getContext("2d")!;
    cx.drawImage(img, 0, 0, 64, 64);
    const d = cx.getImageData(0, 0, 64, 64).data;
    const counts = new Map<string, number>();
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      const q = (v: number) => Math.round(v / 32) * 32;
      const hex =
        "#" +
        [q(d[i]), q(d[i + 1]), q(d[i + 2])]
          .map((v) => clamp(v, 0, 255).toString(16).padStart(2, "0"))
          .join("");
      counts.set(hex, (counts.get(hex) ?? 0) + 1);
    }
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16)
      .map((e) => e[0]);
    mutate((p) => {
      p.palette = top;
    }, true);
    setStatus(`Extracted ${top.length} colors`);
  };

  // ---- palette IO ----
  const loadPreset = (name: string) => {
    const preset = PALETTE_PRESETS.find((p) => p.name === name);
    if (preset) {
      mutate((p) => {
        p.palette = [...preset.colors];
      }, true);
      setStatus(`${name} palette`);
    }
  };
  const exportPalette = () => {
    const blob = new Blob([JSON.stringify(project.palette, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.download = "pixora-palette.json";
    a.href = URL.createObjectURL(blob);
    a.click();
  };
  const importPalette = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const arr = JSON.parse(String(r.result));
        if (Array.isArray(arr)) {
          mutate((p) => {
            p.palette = arr;
          }, true);
          setStatus("Palette imported");
        }
      } catch {
        setStatus("Invalid palette");
      }
    };
    r.readAsText(file);
  };

  // ---- animated GIF export ----
  const exportGIF = () => {
    setStatus("Encoding GIF…");
    const gif = GIFEncoder();
    const tag = activeTag ? project.tags?.find((t) => t.id === activeTag) : null;
    const exportFrames = tag ? project.frames.slice(tag.from, tag.to + 1) : project.frames;
    exportFrames.forEach((f) => {
      const src = compositeFrame(f, W, H);
      const out = document.createElement("canvas");
      out.width = W * exportScale;
      out.height = H * exportScale;
      const c = out.getContext("2d")!;
      c.imageSmoothingEnabled = false;
      c.drawImage(src, 0, 0, out.width, out.height);
      const data = c.getImageData(0, 0, out.width, out.height).data;
      const palette = quantize(data, 256);
      const index = applyPalette(data, palette);
      gif.writeFrame(index, out.width, out.height, { palette, delay: f.duration || 120 });
    });
    gif.finish();
    const blob = new Blob([gif.bytes()], { type: "image/gif" });
    const a = document.createElement("a");
    a.download = tag ? `pixora-${tag.name}.gif` : "pixora-animation.gif";
    a.href = URL.createObjectURL(blob);
    a.click();
    setStatus("GIF exported");
    audio.playSuccess();
  };

  // ---- video export (webm animation) ----
  const exportWebM = async (scale = 8) => {
    setStatus("Rendering Video...");
    const canvas = document.createElement("canvas");
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const stream = canvas.captureStream(0);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5000000 });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    const tag = activeTag ? project.tags?.find((t) => t.id === activeTag) : null;
    const exportFrames = tag ? project.frames.slice(tag.from, tag.to + 1) : project.frames;

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mime });
      const a = document.createElement("a");
      a.download = tag ? `pixora-${tag.name}.webm` : "pixora-animation.webm";
      a.href = URL.createObjectURL(blob);
      a.click();
      setStatus("Video exported");
      audio.playSuccess();
    };

    recorder.start();

    // Loop animation 3 times to make the video longer
    for (let loop = 0; loop < 3; loop++) {
      for (let i = 0; i < exportFrames.length; i++) {
        const f = exportFrames[i];
        const comp = compositeFrame(f, W, H);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000"; // Background for video
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(comp, 0, 0, canvas.width, canvas.height);

        const track = stream.getVideoTracks()[0] as RequestFrameTrack;
        if (track.requestFrame) track.requestFrame();

        await new Promise((r) => setTimeout(r, f.duration || 120));
      }
    }

    recorder.stop();
  };

  // ---- screen recording (webm) ----
  const toggleRecording = () => {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stream = (
      canvas as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }
    ).captureStream(30);
    const chunks: Blob[] = [];
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const rec = new MediaRecorder(stream, { mimeType: mime });
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const a = document.createElement("a");
      a.download = "pixora-recording.webm";
      a.href = URL.createObjectURL(blob);
      a.click();
      setRecording(false);
      setStatus("Recording saved");
    };
    rec.start();
    recorderRef.current = rec;
    setRecording(true);
    setStatus("Recording… (draw/play, click stop)");
    if (project.frames.length > 1) setPlaying(true);
  };

  const importImageAsLayer = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;
      const pixels = makePixels(W, H);
      for (let i = 0; i < pixels.length; i++) {
        const idx = i * 4;
        if (data[idx + 3] > 127) {
          pixels[i] =
            "#" +
            [data[idx], data[idx + 1], data[idx + 2]]
              .map((v) => v.toString(16).padStart(2, "0"))
              .join("");
        }
      }
      mutate((p) => {
        const nl = makeLayer(W, H, `Imported ${file.name.substring(0, 8)}`);
        nl.pixels = pixels;
        p.frames[frameIndex].layers.unshift(nl);
        setLayerIndex(0);
      });
      URL.revokeObjectURL(url);
      setStatus("Image imported as layer.");
    };
    img.src = url;
  };

  kbdRef.current = {
    undo,
    redo,
    copySelection,
    pasteSelection,
    clearSelection,
    setCmdOpen,
    setSelection,
    setTool,
    setShowGrid,
    setTilePreview,
    setBrushSize,
    setFrameIndex,
    project,
    selection,
  };

  const canvasW = W * zoom;
  const activeTourStep = QUICK_TOUR_STEPS[quickTourStep];
  const tourTarget = quickTourOpen ? activeTourStep.target : null;
  const openQuickTour = () => {
    setQuickTourStep(0);
    setQuickTourOpen(true);
  };
  const finishQuickTour = () => {
    try {
      localStorage.setItem(QUICK_TOUR_STORAGE_KEY, "done");
    } catch {
      // Ignore private-mode storage failures; the tour can still close.
    }
    setQuickTourOpen(false);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
        {/* top bar */}
        <header
          className={`relative z-50 flex h-14 items-center gap-3 border-b border-white/10 bg-card/60 px-5 py-2 backdrop-blur-xl transition ${tourTarget === "topbar" ? "z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`}
        >
          <div className="mr-4 flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-extrabold tracking-tight">
            <img src="/pixora-logo.png" alt="Pixora" className="h-6 w-6 rounded" />
            Pixora <span className="text-primary">Studio</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="/guide"
                  aria-label="Open user guide"
                  className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-primary/50 text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  <CircleHelp size={13} />
                </a>
              </TooltipTrigger>
              <TooltipContent>User Guide</TooltipContent>
            </Tooltip>
            <button
              onClick={openQuickTour}
              className="ml-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
            >
              Tour
            </button>
          </div>


          {/* Filters & Transform Dropdown */}
          <div className="group relative flex h-full cursor-pointer items-center border-r border-border px-3 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            Filters
            <div className="absolute left-0 top-full hidden w-48 flex-col rounded-b-md border border-t-0 border-border bg-card p-1 shadow-xl group-hover:flex">
              <MenuItem onClick={() => doFilter("sepia")} icon={Palette} label="Sepia" />
              <MenuItem onClick={() => doFilter("grayscale")} icon={Palette} label="Grayscale" />
              <MenuItem onClick={() => doFilter("brightness_up")} icon={Palette} label="Brightness +30" />
              <MenuItem onClick={() => doFilter("brightness_down")} icon={Palette} label="Brightness -30" />
              <MenuItem onClick={() => doFilter("posterize")} icon={Palette} label="Posterize (4 levels)" />
              <MenuItem onClick={() => doFilter("outline")} icon={Palette} label="Auto Outline (Secondary Color)" />
              <div className="my-1 h-px w-full bg-border" />
              <MenuItem onClick={() => doTransform("rotate")} icon={RotateCw} label="Custom Rotate (Angle)" />
              <MenuItem onClick={() => doTransform("scale")} icon={Move} label="Scale / Resize" />
            </div>
          </div>

          {/* File Dropdown */}
          <div className="group relative flex h-full cursor-pointer items-center border-r border-border px-3 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            File
            <div className="absolute left-0 top-full hidden w-40 flex-col rounded-b-md border border-t-0 border-border bg-card p-1 shadow-xl group-hover:flex">
              <MenuItem onClick={() => newProject(W, H)} icon={FilePlus2} label="New Project" />
              <MenuItem onClick={saveJSON} icon={Save} label="Save Project" />
              <label className="cursor-pointer">
                <MenuItem as="span" icon={FolderOpen} label="Open JSON..." />
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && loadJSON(e.target.files[0])}
                />
              </label>
              <label className="cursor-pointer">
                <MenuItem as="span" icon={FolderOpen} label="Import Image (Pixelate)" />
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && importImagePixelate(e.target.files[0])}
                />
              </label>
              <div className="my-1 h-px w-full bg-border" />
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("pixora-autosave");
                  setStatus("Autosave cleared");
                }}
                icon={Trash2}
                label="Clear Autosave"
              />
            </div>
          </div>

          {/* Export Dropdown */}
          <div className="group relative flex h-full cursor-pointer items-center border-r border-border px-3 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            Export
            <div className="absolute left-0 top-full hidden w-48 flex-col rounded-b-md border border-t-0 border-border bg-card p-1 shadow-xl group-hover:flex">
              <label className="mb-1 flex items-center justify-between px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Scale
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={exportScale}
                  onChange={(e) => setExportScale(clamp(+e.target.value, 1, 32))}
                  className="w-12 rounded bg-input px-1 text-foreground"
                  onClick={(e) => e.stopPropagation()}
                />
              </label>
              <MenuItem onClick={() => exportPNG(exportScale)} icon={Download} label="Export PNG" />
              <MenuItem
                onClick={() => exportSheet(exportScale)}
                icon={Download}
                label="Export Sprite Sheet"
              />
              <MenuItem onClick={() => exportGIF()} icon={Film} label="Export GIF" />
              <MenuItem
                onClick={() => exportWebM(exportScale)}
                icon={Video}
                label="Export Video (WebM)"
              />
              <div className="my-1 h-px w-full bg-border" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRecording();
                }}
                className={`flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-xs font-medium transition active:scale-95 ${recording ? "bg-destructive text-destructive-foreground animate-pulse" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                {recording ? <StopCircle size={14} /> : <Video size={14} />}{" "}
                {recording ? "Stop Recording" : "Record Canvas"}
              </button>
            </div>
          </div>

          {/* View Group */}
          <div className="flex items-center gap-1 px-2">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              View
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium transition active:scale-95 hover:bg-secondary hover:text-foreground ${showTimeline ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
                >
                  <LayersIcon size={14} /> Timeline
                </button>
              </TooltipTrigger>
              <TooltipContent>Toggle Timeline</TooltipContent>
            </Tooltip>
          </div>
          <TopBtn onClick={undo} icon={Undo2} label="Undo" />
          <TopBtn onClick={redo} icon={Redo2} label="Redo" />
          <div className="ml-auto flex items-center gap-3">
            {clipMask && (
              <button
                onClick={() => setClipMask(null)}
                className="animate-pulse flex items-center gap-1 rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80"
              >
                Clear Mask
              </button>
            )}
            
            <button
              onClick={() => setShowFeedback(true)}
              className="group flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 transition-all hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95"
            >
              <AlertCircle size={14} className="transition-transform group-hover:scale-110" /> Report Issue
            </button>
            
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground active:scale-95"
            >
              <Command size={13} /> Ctrl + K / ⌘K
            </button>

            <div className="ml-2 hidden items-center gap-3 border-l border-border pl-4 text-[10px] font-bold text-muted-foreground md:flex">
              <span className="font-mono text-foreground/80">
                {W}x{H}px
              </span>
              <span className="opacity-30">•</span>
              <span>
                {project.frames.length} frame{project.frames.length !== 1 ? "s" : ""}
              </span>
              <span className="opacity-30">•</span>
              <span>{zoom}x</span>
              {hoverCoords && (
                <>
                  <span className="opacity-30">•</span>
                  <span className="font-mono tabular-nums text-primary">
                    X:{hoverCoords[0]} Y:{hoverCoords[1]}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* tool rail */}
          <aside
            className={`z-10 flex w-16 flex-col items-center gap-2 border-r border-white/5 bg-black/40 py-4 backdrop-blur-md transition overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${tourTarget === "tools" ? "relative z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`}
          >
            {TOOL_GROUPS.map((group, i) => {
              const activeToolInGroup = group.find((id) => id === tool);
              const displayToolId = activeToolInGroup || group[0];
              const displayTool = TOOLS.find((t) => t.id === displayToolId)!;

              return (
                <HoverCard key={i} openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <button
                      onClick={() => {
                        if (displayTool.soon) return;
                        setTool(displayTool.id);
                        audio.playDraw();
                      }}
                      className={`relative grid h-10 w-10 place-items-center rounded-xl transition-all duration-200 ${
                        displayTool.soon
                          ? "opacity-30 grayscale cursor-not-allowed"
                          : "active:scale-95"
                      } ${
                        activeToolInGroup && !displayTool.soon
                          ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                          : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      <displayTool.icon size={20} />
                      {group.length > 1 && (
                        <svg
                          width="6"
                          height="6"
                          viewBox="0 0 6 6"
                          className="absolute bottom-1.5 right-1.5 opacity-50"
                          fill="currentColor"
                        >
                          <polygon points="6,6 0,6 6,0" />
                        </svg>
                      )}
                    </button>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="right"
                    sideOffset={16}
                    align="start"
                    className="w-auto p-1 bg-slate-800/95 border-white/10 backdrop-blur-md shadow-2xl flex flex-col gap-1"
                  >
                    {group.map((id) => {
                      const t = TOOLS.find((x) => x.id === id)!;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            if (t.soon) return;
                            setTool(t.id);
                            audio.playDraw();
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                            t.soon
                              ? "opacity-30 grayscale cursor-not-allowed"
                              : "hover:bg-white/10"
                          } ${
                            tool === t.id
                              ? "bg-primary/20 text-primary"
                              : "text-slate-200"
                          }`}
                        >
                          <t.icon size={16} />
                          <span className="text-sm font-medium whitespace-nowrap">
                            {t.label}
                          </span>
                          <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                            {t.key}
                          </kbd>
                        </button>
                      );
                    })}
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </aside>

          {/* stage wrapper with top settings bar */}
          <div className="flex flex-1 flex-col min-w-0 z-10 bg-[#09090b]">
            {/* Top Settings Bar */}
            <div className="flex h-10 items-center gap-6 border-b border-white/5 bg-black/40 px-4 text-xs font-medium text-muted-foreground backdrop-blur-md">
              <span className="uppercase tracking-widest text-[10px] font-bold text-white/50 border-r border-white/10 pr-4">
                Tool Settings
              </span>
              
              {(tool === "brush" || tool === "pencil" || tool === "eraser") && (
                <>
                {tool === "brush" && (
                  <>
                  {customBrush && (
                    <>
                    <button 
                      className="px-2 py-1 bg-primary/20 hover:bg-primary/40 text-primary-foreground text-xs rounded transition-colors mr-2"
                      onClick={() => setSavedBrushes([...savedBrushes, customBrush])}
                    >
                      Save Brush
                    </button>
                    <button 
                      className="px-2 py-1 bg-destructive/20 hover:bg-destructive/40 text-destructive-foreground text-xs rounded transition-colors mr-2"
                      onClick={() => setCustomBrush(null)}
                    >
                      Clear
                    </button>
                    </>
                  )}
                  {savedBrushes.length > 0 && (
                    <div className="flex gap-1 mr-4 border-r border-border pr-4 items-center">
                      <span className="text-muted-foreground mr-1">Saved:</span>
                      {savedBrushes.map((b, i) => (
                        <BrushPreview key={i} brush={b} onClick={() => setCustomBrush(b)} />
                      ))}
                    </div>
                  )}
                  </>
                )}
                <label className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                  Opacity:
                  <input type="range" min="1" max="100" value={brushOpacity} onChange={e => setBrushOpacity(Number(e.target.value))} className="accent-primary w-24"/>
                  <span className="w-6 tabular-nums">{brushOpacity}%</span>
                </label>
                <label className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                  Stabilizer:
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={stabilizer} 
                    onChange={e => setStabilizer(Number(e.target.value))} 
                    className="accent-primary w-24"
                  />
                  <span className="w-4 tabular-nums">{stabilizer}</span>
                </label>
                </>
              )}
              {tool === "replace" && (
                <label className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer text-sm">
                  <input type="checkbox" checked={globalReplace} onChange={e => setGlobalReplace(e.target.checked)} className="accent-primary" />
                  Global Replace (All Frames & Layers)
                </label>
              )}
              
              {tool === "spray" && (
                <>
                <label className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer mr-4">
                  Radius:
                  <input type="range" min="2" max="32" value={sprayRadius} onChange={e => setSprayRadius(Number(e.target.value))} className="accent-primary w-24"/>
                  <span className="w-6 tabular-nums">{sprayRadius}</span>
                </label>
                <label className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                  Density:
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={sprayDensity} 
                    onChange={e => setSprayDensity(Number(e.target.value))} 
                    className="accent-primary w-24"
                  />
                  <span className="w-8 tabular-nums">{sprayDensity}%</span>
                </label>
                </>
              )}

              {tool === "text" && (
                <>
                <label className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer mr-4">
                  Font:
                  <select value={textFont} onChange={e => setTextFont(e.target.value)} className="bg-background text-sm rounded border border-border px-2 py-1">
                    <option value="'Press Start 2P'">Press Start 2P</option>
                    <option value="monospace">Monospace</option>
                    <option value="sans-serif">Sans Serif</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                  Font Size:
                  <input 
                    type="range" 
                    min="5" 
                    max="64" 
                    value={textSize} 
                    onChange={e => setTextSize(Number(e.target.value))} 
                    className="accent-primary w-24"
                  />
                  <span className="w-6 tabular-nums">{textSize}px</span>
                </label>
                </>
              )}

              {tool === "polygon" && (
                <label className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                  Sides:
                  <input 
                    type="range" 
                    min="3" 
                    max="12" 
                    value={polygonSides} 
                    onChange={e => setPolygonSides(Number(e.target.value))} 
                    className="accent-primary w-24"
                  />
                  <span className="w-4 tabular-nums">{polygonSides}</span>
                </label>
              )}

              {tool === "shade" && (
                <label className="flex items-center gap-2 hover:text-foreground transition-colors">
                  Mode:
                  <select 
                    className="bg-black/40 border border-white/10 rounded px-2 py-0.5 outline-none focus:border-primary/50 text-slate-200"
                    value={shadeMode} 
                    onChange={e => setShadeMode(e.target.value as "dodge"|"burn")}
                  >
                    <option className="bg-slate-900" value="dodge">Dodge (Lighten)</option>
                    <option className="bg-slate-900" value="burn">Burn (Darken)</option>
                  </select>
                </label>
              )}

              <label className="ml-auto flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={pixelPerfect} 
                  onChange={e => setPixelPerfect(e.target.checked)} 
                  className="accent-primary h-3.5 w-3.5 rounded-sm border-white/20 bg-white/5"
                />
                Pixel Perfect
              </label>
            </div>


            {/* stage wrapper */}
            <div className="flex flex-1 flex-col overflow-hidden bg-[#09090b]">
              {/* Top Ruler Container */}
              {showRulers && (
                <div className="flex h-5 shrink-0 bg-[#1e1e24]">
                  <div className="w-5 shrink-0 border-b border-r border-[#333] bg-[#1a1a1f]" />
                  <canvas ref={topRulerRef} className="flex-1" />
                </div>
              )}
              <div className="flex flex-1 overflow-hidden">
                {/* Left Ruler Container */}
                {showRulers && (
                  <div className="w-5 shrink-0 bg-[#1e1e24]">
                    <canvas ref={leftRulerRef} className="h-full w-full" />
                  </div>
                )}
                {/* main scrolling area */}
                <main
                  ref={mainRef}
                  className={`relative flex flex-1 items-center justify-center overflow-auto transition ${tourTarget === "canvas" ? "z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`}
                >
                  <canvas
                    ref={canvasRef}

              style={{
                width: canvasW,
                imageRendering: "pixelated",
                touchAction: "none",
                cursor:
                  tool === "move"
                    ? "grab"
                    : tool === "fill"
                      ? "cell"
                      : tool === "pick"
                        ? "copy"
                        : tool === "eraser"
                          ? "pointer"
                          : tool === "select"
                            ? "default"
                            : tool === "wand"
                              ? "help"
                              : "crosshair",
              }}
              className="shadow-2xl ring-1 ring-white/5"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={() => {
                panning.current = false;
                moveRef.current = null;
                setHoverCoords(null);
                render();
              }}
              onContextMenu={(e) => e.preventDefault()}
            />
          </main>
              </div>
            </div>
          </div>

          {/* right panels */}
          <aside
            className={`z-10 flex w-[300px] flex-col overflow-y-auto border-l border-white/5 bg-black/40 text-sm backdrop-blur-md transition custom-scrollbar ${tourTarget === "panels" ? "relative z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`}
          >
            <Panel title="Canvas">
              <div className="flex flex-wrap gap-1">
                {CANVAS_PRESETS.map((s) => (
                  <button
                    key={s}
                    onClick={() => newProject(s, s)}
                    className="rounded-md bg-secondary px-2 py-1 text-xs hover:bg-primary hover:text-primary-foreground"
                  >
                    {s}²
                  </button>
                ))}
                <button
                  onClick={promptResize}
                  className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
                >
                  Resize...
                </button>
              </div>
              <Row label={`Zoom ${zoom}px`}>
                <input
                  type="range"
                  min={4}
                  max={40}
                  value={zoom}
                  onChange={(e) => setZoom(+e.target.value)}
                  className="w-full accent-[oklch(0.72_0.19_300)]"
                />
              </Row>
              <div className="flex gap-2">
                <Toggle active={showGrid} onClick={() => setShowGrid((v) => !v)} icon={Grid3x3}>
                  Grid
                </Toggle>
                <Toggle
                  active={onionMode > 0}
                  onClick={() => setOnionMode((v) => (v + 1) % 3)}
                  icon={LayersIcon}
                >
                  {onionMode === 0
                    ? "Onion: Off"
                    : onionMode === 1
                      ? "Onion: Normal"
                      : "Onion: Pro"}
                </Toggle>
              </div>
            </Panel>

            <Panel title="Animation Preview">
              <div className="flex justify-center rounded bg-[#09090b] p-2 ring-1 ring-border">
                <canvas ref={previewCanvasRef} className="shadow-lg" />
              </div>

              <div className="mt-3 flex flex-col gap-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Animation Tags
                  </span>
                  <button
                    onClick={() => {
                      setCustomPrompt({
                        title: "Enter tag name",
                        placeholder: "e.g. Idle, Run, Jump",
                        defaultValue: "",
                        onConfirm: (name) => {
                          if (!name) return;
                          mutate((p) => {
                            if (!p.tags) p.tags = [];
                            p.tags.push({
                              id: uid(),
                              name,
                              color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                              from: 0,
                              to: Math.max(0, p.frames.length - 1),
                            });
                          });
                        },
                      });
                    }}
                    className="text-xs font-medium text-primary hover:text-primary/80"
                  >
                    + Add Tag
                  </button>
                </div>
                {project.tags?.map((t, i) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between rounded px-2 py-1.5 text-xs cursor-pointer transition ${activeTag === t.id ? "bg-primary/20 ring-1 ring-primary" : "bg-secondary/30 hover:bg-secondary/60"}`}
                    onClick={() => setActiveTag(activeTag === t.id ? null : t.id)}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="font-semibold">{t.name}</span>
                    </div>
                    <div
                      className="flex items-center gap-1 text-[10px] text-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="number"
                        min={1}
                        max={project.frames.length}
                        value={t.from + 1}
                        onChange={(e) =>
                          mutate((p) => {
                            p.tags![i].from = clamp(+e.target.value - 1, 0, p.frames.length - 1);
                          })
                        }
                        className="w-8 rounded bg-input px-1 py-0.5 text-center"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min={1}
                        max={project.frames.length}
                        value={t.to + 1}
                        onChange={(e) =>
                          mutate((p) => {
                            p.tags![i].to = clamp(+e.target.value - 1, 0, p.frames.length - 1);
                          })
                        }
                        className="w-8 rounded bg-input px-1 py-0.5 text-center"
                      />
                      <button
                        onClick={() => {
                          mutate((p) => {
                            p.tags!.splice(i, 1);
                          });
                          if (activeTag === t.id) setActiveTag(null);
                        }}
                        className="ml-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Brush">
              <Row label={`Size ${brushSize}`}>
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={brushSize}
                  onChange={(e) => setBrushSize(+e.target.value)}
                  className="w-full accent-[oklch(0.72_0.19_300)]"
                />
              </Row>
              {tool === "dither" && (
                <Row label={`Dither density ${(ditherDensity * 100) | 0}%`}>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.0625}
                    value={ditherDensity}
                    onChange={(e) => setDitherDensity(+e.target.value)}
                    className="w-full accent-[oklch(0.72_0.19_300)]"
                  />
                </Row>
              )}
              <div className="flex gap-2">
                <Toggle active={symX} onClick={() => setSymX((v) => !v)} icon={FlipHorizontal2}>
                  Mirror X
                </Toggle>
                <Toggle active={symY} onClick={() => setSymY((v) => !v)} icon={FlipVertical2}>
                  Mirror Y
                </Toggle>
              </div>
              <div className="flex gap-2">
                <Toggle active={sym4} onClick={() => setSym4((v) => !v)} icon={Grid3x3}>
                  Sym 4
                </Toggle>
              </div>
              <div className="flex gap-2">
                <Toggle active={showGrid} onClick={() => setShowGrid((v) => !v)} icon={Grid3x3}>
                  Grid
                </Toggle>
                <Toggle
                  active={tilePreview}
                  onClick={() => setTilePreview((v) => !v)}
                  icon={LayersIcon}
                >
                  Tile Preview
                </Toggle>
                <Toggle
                  active={audioEnabled}
                  onClick={() => {
                    setAudioEnabled((v) => !v);
                    audio.toggle(!audioEnabled);
                  }}
                  icon={audioEnabled ? Volume2 : VolumeX}
                >
                  Sound
                </Toggle>
              </div>
            </Panel>

            {tilePreview && (
              <Panel title="Tile Preview">
                <TilePreview frame={frame} w={W} h={H} />
              </Panel>
            )}

            <Panel title="Effects (active layer)">
              <div className="grid grid-cols-2 gap-1">
                <SmallBtn onClick={doFlipH} icon={FlipHorizontal2}>
                  Flip H
                </SmallBtn>
                <SmallBtn onClick={doFlipV} icon={FlipVertical2}>
                  Flip V
                </SmallBtn>
                <SmallBtn onClick={doRotate} icon={RotateCw}>
                  Rotate
                </SmallBtn>
                <SmallBtn onClick={doOutline} icon={Wand2}>
                  Outline
                </SmallBtn>
                <SmallBtn onClick={doGrayscale} icon={Circle}>
                  Grayscale
                </SmallBtn>
                <SmallBtn onClick={doInvert} icon={Square}>
                  Invert
                </SmallBtn>
              </div>
              <Row label="Hue shift">
                <div className="flex gap-1">
                  <button
                    onClick={() => doHueShift(-30)}
                    className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                  >
                    -30°
                  </button>
                  <button
                    onClick={() => doHueShift(30)}
                    className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                  >
                    +30°
                  </button>
                  <button
                    onClick={() => doHueShift(180)}
                    className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                  >
                    180°
                  </button>
                </div>
              </Row>
            </Panel>

            <Panel title="Selection">
              <div className="text-xs text-muted-foreground">
                {selection
                  ? "Region selected — S tool"
                  : "Use the Select (S) tool to mark a region"}
              </div>
              <div className="grid grid-cols-2 gap-1">
                <SmallBtn onClick={copySelection} icon={Copy}>
                  Copy
                </SmallBtn>
                <SmallBtn onClick={pasteSelection} icon={Grip}>
                  Paste
                </SmallBtn>
                <SmallBtn onClick={clearSelection} icon={Trash2}>
                  Clear
                </SmallBtn>
                <SmallBtn onClick={() => setSelection(null)} icon={BoxSelect}>
                  Deselect
                </SmallBtn>
              </div>
            </Panel>

            <Panel title="Reference">
              <label className="cursor-pointer">
                <span className="flex w-full items-center justify-center gap-1.5 rounded-md bg-secondary py-1.5 text-xs hover:bg-secondary/70">
                  <ImageIcon size={13} /> {refUrl ? "Replace image" : "Load image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && loadRef(e.target.files[0])}
                />
              </label>
              {refUrl && (
                <>
                  <Row label={`Opacity ${(refOpacity * 100) | 0}%`}>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={refOpacity}
                      onChange={(e) => setRefOpacity(+e.target.value)}
                      className="w-full accent-[oklch(0.72_0.19_300)]"
                    />
                  </Row>
                  <div className="flex gap-1">
                    <Toggle active={showRef} onClick={() => setShowRef((v) => !v)} icon={Eye}>
                      Show
                    </Toggle>
                    <button
                      onClick={extractPalette}
                      className="flex-1 rounded-md bg-primary py-1 text-xs font-medium text-primary-foreground"
                    >
                      Extract palette
                    </button>
                  </div>
                </>
              )}
            </Panel>

            <Panel title="Palette">
              <div className="flex gap-1">
                <select
                  onChange={(e) => {
                    if (e.target.value) loadPreset(e.target.value);
                    e.target.value = "";
                  }}
                  defaultValue=""
                  className="min-w-0 flex-1 rounded-md bg-input px-2 py-1 text-xs"
                >
                  <option value="">Load preset…</option>
                  {PALETTE_PRESETS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={exportPalette}
                  title="Export palette"
                  className="rounded-md bg-secondary px-2 py-1 text-xs hover:bg-secondary/70"
                >
                  ↓
                </button>
                <label
                  title="Import palette"
                  className="cursor-pointer rounded-md bg-secondary px-2 py-1 text-xs hover:bg-secondary/70"
                >
                  ↑
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && importPalette(e.target.files[0])}
                  />
                </label>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {project.palette.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrimary(c);
                      setSelPalette(i);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSecondary(c);
                    }}
                    title={c}
                    className={`aspect-square rounded ring-offset-1 ring-offset-sidebar transition ${selPalette === i ? "ring-2 ring-primary" : "ring-1 ring-black/40"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const hexStr = project.palette.join("\n");
                    const blob = new Blob([hexStr], { type: "text/plain" });
                    const a = document.createElement("a");
                    a.download = "pixora-palette.hex";
                    a.href = URL.createObjectURL(blob);
                    a.click();
                  }}
                  className="flex-1 rounded-md bg-secondary py-1 text-[10px] hover:bg-secondary/70"
                  title="Export Palette"
                >
                  Export .hex
                </button>
                <label className="flex-1 cursor-pointer rounded-md bg-secondary py-1 text-center text-[10px] hover:bg-secondary/70" title="Import Palette (.hex / .txt)">
                  Import
                  <input
                    type="file"
                    accept=".hex,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (e) => {
                         const text = e.target?.result as string;
                         const colors = text.split(/\s+/).filter(c => c.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/));
                         if (colors.length > 0) {
                            mutate(p => { p.palette = colors; });
                            setStatus(`Loaded ${colors.length} colors`);
                         } else {
                            setStatus("No valid hex colors found.");
                         }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => mutate((p) => p.palette.push(primary), false)}
                  className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                >
                  Add current
                </button>
                <button
                  onClick={() => mutate((p) => p.palette.splice(selPalette, 1), false)}
                  className="rounded-md bg-secondary px-2 py-1 text-xs hover:bg-destructive hover:text-destructive-foreground"
                >
                  Del
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    mutate((p) => p.palette.sort((a, b) => hueOf(a) - hueOf(b)), false)
                  }
                  className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                >
                  Sort hue
                </button>
                <button
                  onClick={() =>
                    mutate((p) => p.palette.sort((a, b) => luminance(a) - luminance(b)), false)
                  }
                  className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                >
                  Sort lum
                </button>
                <button
                  onClick={() => {
                    mutate((p) => {
                      const colors = new Set<string>();
                      for (const f of p.frames) {
                        for (const l of f.layers) {
                          for (const px of l.pixels) {
                            if (px) colors.add(px);
                          }
                        }
                      }
                      p.palette = Array.from(colors).slice(0, 256);
                    });
                  }}
                  className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                  title="Extract all used colors into Palette"
                >
                  Reduce
                </button>
              </div>
              <div className="mt-1 border-t border-border pt-2">
                <div className="mb-1 text-xs text-muted-foreground">Ramp generator</div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={rampA}
                    onChange={(e) => setRampA(e.target.value)}
                    className="h-7 w-7 rounded"
                  />
                  <input
                    type="color"
                    value={rampB}
                    onChange={(e) => setRampB(e.target.value)}
                    className="h-7 w-7 rounded"
                  />
                  <input
                    type="number"
                    min={2}
                    max={16}
                    value={rampSteps}
                    onChange={(e) => setRampSteps(clamp(+e.target.value, 2, 16))}
                    className="w-14 rounded bg-input px-2 py-1 text-xs"
                  />
                  <button
                    onClick={() =>
                      mutate((p) => {
                        p.palette.push(...rampBetween(rampA, rampB, rampSteps));
                      }, false)
                    }
                    className="flex-1 rounded-md bg-primary py-1 text-xs font-medium text-primary-foreground"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mt-2 border-t border-border pt-2">
                <div className="mb-1 text-xs text-muted-foreground">
                  Color Harmony (from Primary)
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      mutate((p) => {
                        const [h, s, l] = hexToHSL(primary);
                        p.palette.push(hslToHex(h + 180, s, l));
                      }, false)
                    }
                    className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                  >
                    Complement
                  </button>
                  <button
                    onClick={() =>
                      mutate((p) => {
                        const [h, s, l] = hexToHSL(primary);
                        p.palette.push(hslToHex(h - 30, s, l), hslToHex(h + 30, s, l));
                      }, false)
                    }
                    className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                  >
                    Analogous
                  </button>
                  <button
                    onClick={() =>
                      mutate((p) => {
                        const [h, s, l] = hexToHSL(primary);
                        p.palette.push(hslToHex(h + 120, s, l), hslToHex(h - 120, s, l));
                      }, false)
                    }
                    className="flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
                  >
                    Triadic
                  </button>
                </div>
              </div>
            </Panel>

            <Panel title="Layers">
              <div className="flex gap-1">
                <IconBtn
                  title="Add"
                  onClick={() =>
                    mutate((p) => {
                      p.frames[frameIndex].layers.unshift(
                        makeLayer(W, H, `Layer ${p.frames[frameIndex].layers.length + 1}`),
                      );
                      setLayerIndex(0);
                    })
                  }
                  icon={Plus}
                />
                <IconBtn
                  title="Duplicate"
                  onClick={() =>
                    mutate((p) => {
                      const l = p.frames[frameIndex].layers[layerIndex];
                      p.frames[frameIndex].layers.splice(layerIndex, 0, {
                        ...JSON.parse(JSON.stringify(l)),
                        id: uid(),
                        name: l.name + " copy",
                      });
                    })
                  }
                  icon={Copy}
                />
                <IconBtn
                  title="Merge Down"
                  onClick={() =>
                    mutate((p) => {
                      const a = p.frames[frameIndex].layers;
                      if (layerIndex < a.length - 1) {
                        const upper = a[layerIndex];
                        const lower = a[layerIndex + 1];
                        for (let i = 0; i < lower.pixels.length; i++) {
                          if (upper.pixels[i]) lower.pixels[i] = upper.pixels[i];
                        }
                        a.splice(layerIndex, 1);
                      }
                    })
                  }
                  icon={LayersIcon}
                />
                <IconBtn
                  title="Up"
                  onClick={() =>
                    mutate((p) => {
                      if (layerIndex > 0) {
                        const a = p.frames[frameIndex].layers;
                        [a[layerIndex - 1], a[layerIndex]] = [a[layerIndex], a[layerIndex - 1]];
                        setLayerIndex(layerIndex - 1);
                      }
                    })
                  }
                  icon={ChevronUp}
                />
                <IconBtn
                  title="Down"
                  onClick={() =>
                    mutate((p) => {
                      const a = p.frames[frameIndex].layers;
                      if (layerIndex < a.length - 1) {
                        [a[layerIndex + 1], a[layerIndex]] = [a[layerIndex], a[layerIndex + 1]];
                        setLayerIndex(layerIndex + 1);
                      }
                    })
                  }
                  icon={ChevronDown}
                />
                <IconBtn
                  title="Delete"
                  danger
                  onClick={() =>
                    mutate((p) => {
                      const a = p.frames[frameIndex].layers;
                      if (a.length > 1) {
                        a.splice(layerIndex, 1);
                        setLayerIndex(Math.max(0, layerIndex - 1));
                      }
                    })
                  }
                  icon={Trash2}
                />
                <label
                  title="Import Image"
                  className="flex shrink-0 cursor-pointer items-center justify-center rounded p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  <ImagePlus size={15} />
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && importImageAsLayer(e.target.files[0])}
                  />
                </label>
              </div>
              <div className="flex flex-col gap-1">
                {frame.layers.map((l, i) => (
                  <div
                    key={l.id}
                    onClick={() => setLayerIndex(i)}
                    className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 ${i === layerIndex ? "bg-primary/20 ring-1 ring-primary" : "bg-secondary/50 hover:bg-secondary"}`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        mutate((p) => {
                          p.frames[frameIndex].layers[i].visible = !l.visible;
                        }, false);
                      }}
                      className="text-muted-foreground"
                    >
                      {l.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <input
                      value={l.name}
                      onChange={(e) =>
                        mutate((p) => {
                          p.frames[frameIndex].layers[i].name = e.target.value;
                        }, false)
                      }
                      className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                    />
                  </div>
                ))}
              </div>
              <Row label={`Opacity ${(activeLayer.opacity * 100) | 0}%`}>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={activeLayer.opacity}
                  onChange={(e) =>
                    mutate((p) => {
                      p.frames[frameIndex].layers[layerIndex].opacity = +e.target.value;
                    }, false)
                  }
                  className="w-full accent-[oklch(0.72_0.19_300)]"
                />
              </Row>
              <select
                value={activeLayer.blendMode}
                onChange={(e) =>
                  mutate((p) => {
                    p.frames[frameIndex].layers[layerIndex].blendMode = e.target.value as BlendMode;
                  }, false)
                }
                className="w-full rounded-md bg-input px-2 py-1 text-xs"
              >
                {BLEND_MODES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  mutate((p) => {
                    p.frames[frameIndex].layers[layerIndex].pixels = makePixels(W, H);
                  })
                }
                className="rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70"
              >
                Clear layer
              </button>
            </Panel>
          </aside>
        </div>

        {/* timeline */}
        <footer
          className={`z-20 flex flex-col border-t border-border bg-card transition-all duration-300 ease-in-out ${showTimeline ? "max-h-[300px] opacity-100" : "pointer-events-none max-h-0 overflow-hidden opacity-0"} ${tourTarget === "timeline" ? "relative z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <button
              onClick={() => setPlaying((v) => !v)}
              className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground"
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <IconBtn
              title="Add frame"
              onClick={() =>
                mutate((p) => {
                  const nf = makeFrame(W, H, p.frames.length + 1);
                  nf.layers = JSON.parse(JSON.stringify(p.frames[frameIndex].layers)).map(
                    (l: Layer) => ({ ...l, id: uid() }),
                  );
                  p.frames.splice(frameIndex + 1, 0, nf);
                  setFrameIndex(frameIndex + 1);
                })
              }
              icon={Plus}
            />
            <IconBtn
              title="Duplicate frame"
              onClick={() =>
                mutate((p) => {
                  const nf = JSON.parse(JSON.stringify(p.frames[frameIndex])) as Frame;
                  nf.id = uid();
                  nf.layers.forEach((l) => (l.id = uid()));
                  p.frames.splice(frameIndex + 1, 0, nf);
                  setFrameIndex(frameIndex + 1);
                })
              }
              icon={Copy}
            />
            <IconBtn
              title="Delete frame"
              danger
              onClick={() =>
                mutate((p) => {
                  if (p.frames.length > 1) {
                    p.frames.splice(frameIndex, 1);
                    setFrameIndex(Math.max(0, frameIndex - 1));
                  }
                })
              }
              icon={Trash2}
            />
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              {status}
              <button
                onClick={() => setShowTimeline(false)}
                title="Hide timeline"
                className="rounded p-1 hover:bg-secondary hover:text-foreground"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto px-3 pb-3">
            {project.frames.map((f, i) => (
              <FrameThumb
                key={f.id}
                frame={f}
                w={W}
                h={H}
                active={i === frameIndex}
                index={i}
                onClick={() => setFrameIndex(i)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setFrameMenu({ i, x: e.clientX, y: e.clientY });
                }}
                onDurationChange={(d) =>
                  mutate((p) => {
                    p.frames[i].duration = d;
                  }, false)
                }
              />
            ))}
          </div>
        </footer>

        {frameMenu && (
          <div
            className="fixed inset-0 z-50"
            onClick={() => setFrameMenu(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              setFrameMenu(null);
            }}
          >
            <div
              className="absolute flex w-44 flex-col rounded-md border border-border bg-card p-1 shadow-2xl"
              style={{
                left: Math.min(frameMenu.x, window.innerWidth - 180),
                top: Math.min(frameMenu.y, window.innerHeight - 200),
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
                Frame {frameMenu.i + 1}
              </div>
              <MenuItem
                icon={Plus}
                label="Add Empty Frame"
                onClick={() => {
                  mutate((p) => {
                    const nf = makeFrame(W, H, p.frames.length + 1);
                    nf.layers = JSON.parse(JSON.stringify(p.frames[frameMenu.i].layers)).map(
                      (l: Layer) => ({ ...l, id: uid(), pixels: makePixels(W, H) }),
                    );
                    p.frames.splice(frameMenu.i + 1, 0, nf);
                    setFrameIndex(frameMenu.i + 1);
                  });
                  setFrameMenu(null);
                }}
              />
              <MenuItem
                icon={Copy}
                label="Duplicate Frame"
                onClick={() => {
                  mutate((p) => {
                    const nf = JSON.parse(JSON.stringify(p.frames[frameMenu.i])) as Frame;
                    nf.id = uid();
                    nf.layers.forEach((l) => (l.id = uid()));
                    p.frames.splice(frameMenu.i + 1, 0, nf);
                    setFrameIndex(frameMenu.i + 1);
                  });
                  setFrameMenu(null);
                }}
              />
              <div className="my-1 h-px w-full bg-border" />
              <MenuItem
                icon={ChevronLeft}
                label="Move Left"
                onClick={() => {
                  mutate((p) => {
                    if (frameMenu.i > 0) {
                      [p.frames[frameMenu.i - 1], p.frames[frameMenu.i]] = [
                        p.frames[frameMenu.i],
                        p.frames[frameMenu.i - 1],
                      ];
                      setFrameIndex(frameMenu.i - 1);
                    }
                  });
                  setFrameMenu(null);
                }}
              />
              <MenuItem
                icon={ChevronRight}
                label="Move Right"
                onClick={() => {
                  mutate((p) => {
                    if (frameMenu.i < p.frames.length - 1) {
                      [p.frames[frameMenu.i + 1], p.frames[frameMenu.i]] = [
                        p.frames[frameMenu.i],
                        p.frames[frameMenu.i + 1],
                      ];
                      setFrameIndex(frameMenu.i + 1);
                    }
                  });
                  setFrameMenu(null);
                }}
              />
              <div className="my-1 h-px w-full bg-border" />
              <MenuItem
                icon={Trash2}
                label="Delete Frame"
                onClick={() => {
                  mutate((p) => {
                    if (p.frames.length > 1) {
                      p.frames.splice(frameMenu.i, 1);
                      setFrameIndex(Math.max(0, frameMenu.i - 1));
                    }
                  });
                  setFrameMenu(null);
                }}
              />
            </div>
          </div>
        )}

        {!showTimeline && (
          <button
            onClick={() => setShowTimeline(true)}
            title="Show timeline"
            className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border bg-card p-1.5 text-muted-foreground shadow-lg transition hover:text-foreground"
          >
            <ChevronUp size={16} />
          </button>
        )}

        {cmdOpen && (
          <CommandPalette
            onClose={() => setCmdOpen(false)}
            actions={[
              ...TOOLS.map((t) => ({
                label: `Tool: ${t.label}`,
                hint: t.key,
                run: () => setTool(t.id),
              })),
              { label: "Toggle grid", hint: "G", run: () => setShowGrid((v) => !v) },
              { label: "Toggle tile preview", hint: "T", run: () => setTilePreview((v) => !v) },
              { label: "Flip layer horizontal", run: doFlipH },
              { label: "Flip layer vertical", run: doFlipV },
              { label: "Rotate layer 90°", run: doRotate },
              { label: "Outline layer", run: doOutline },
              { label: "Grayscale layer", run: doGrayscale },
              { label: "Invert layer", run: doInvert },
              { label: "Resize project", run: promptResize },
              {
                label: "Add layer",
                run: () =>
                  mutate((p) => {
                    p.frames[frameIndex].layers.unshift(
                      makeLayer(W, H, `Layer ${p.frames[frameIndex].layers.length + 1}`),
                    );
                    setLayerIndex(0);
                  }),
              },
              {
                label: "Add frame",
                run: () =>
                  mutate((p) => {
                    const nf = makeFrame(W, H, p.frames.length + 1);
                    nf.layers = JSON.parse(JSON.stringify(p.frames[frameIndex].layers)).map(
                      (l: Layer) => ({ ...l, id: uid() }),
                    );
                    p.frames.splice(frameIndex + 1, 0, nf);
                    setFrameIndex(frameIndex + 1);
                  }),
              },
              {
                label: clipMask ? "Clear magic wand mask" : "Magic wand tool",
                run: () => {
                  if (clipMask) setClipMask(null);
                  else setTool("wand");
                },
              },
              { label: "Toggle audio", run: () => audio.toggle(!audio.isEnabled()) },
              { label: "Toggle timeline", run: () => setShowTimeline((v) => !v) },
              { label: "Toggle rulers", run: () => setShowRulers((v) => !v) },
              {
                label: "Clear autosave",
                run: () => {
                  localStorage.removeItem("pixora-autosave");
                  setStatus("Autosave cleared");
                },
              },
              { label: "Export PNG", run: () => exportPNG(exportScale) },
              { label: "Export sprite sheet", run: () => exportSheet(exportScale) },
              { label: "Export animated GIF", run: () => exportGIF() },
              { label: recording ? "Stop recording" : "Start recording", run: toggleRecording },
              { label: "Save project (JSON)", run: saveJSON },
              { label: "Undo", hint: "Ctrl+Z", run: undo },
              { label: "Redo", hint: "Ctrl+Y", run: redo },
              ...PALETTE_PRESETS.map((p) => ({
                label: `Palette: ${p.name}`,
                run: () => loadPreset(p.name),
              })),
            ]}
          />
        )}

        {quickTourOpen && !restorePrompt && (
          <QuickTour
            step={activeTourStep}
            stepIndex={quickTourStep}
            totalSteps={QUICK_TOUR_STEPS.length}
            onBack={() => setQuickTourStep((step) => Math.max(0, step - 1))}
            onNext={() => {
              if (quickTourStep === QUICK_TOUR_STEPS.length - 1) finishQuickTour();
              else setQuickTourStep((step) => step + 1);
            }}
            onSkip={finishQuickTour}
          />
        )}

        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

        {restorePrompt && (
          <RestoreModal
            project={restorePrompt}
            onRestore={() => {
              setProject(restorePrompt);
              setRestorePrompt(null);
            }}
            onDiscard={() => {
              localStorage.removeItem("pixora-autosave");
              setRestorePrompt(null);
            }}
          />
        )}

        {showResize && (
          <ResizeModal
            width={W}
            height={H}
            onClose={() => setShowResize(false)}
            onConfirm={handleResize}
          />
        )}

        {customPrompt && (
          <PromptModal
            title={customPrompt.title}
            defaultValue={customPrompt.defaultValue}
            placeholder={customPrompt.placeholder}
            onClose={() => setCustomPrompt(null)}
            onConfirm={customPrompt.onConfirm}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

function CommandPalette({
  actions,
  onClose,
}: {
  actions: { label: string; hint?: string; run: () => void }[];
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const filtered = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setSel(0);
  }, [q]);
  const runAt = (i: number) => {
    const a = filtered[i];
    if (a) {
      a.run();
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-32"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSel((s) => Math.min(filtered.length - 1, s + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSel((s) => Math.max(0, s - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              runAt(sel);
            } else if (e.key === "Escape") onClose();
          }}
          placeholder="Type a command…"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none"
        />
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">No matches</div>
          )}
          {filtered.map((a, i) => (
            <button
              key={a.label}
              onMouseEnter={() => setSel(i)}
              onClick={() => runAt(i)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${i === sel ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
            >
              <span>{a.label}</span>
              {a.hint && (
                <kbd
                  className={`rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] ${i === sel ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                >
                  {a.hint}
                </kbd>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickTour({
  step,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  onSkip,
}: {
  step: (typeof QUICK_TOUR_STEPS)[number];
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/45 backdrop-blur-[2px]" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-tour-title"
        className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 rounded-xl border border-primary/30 bg-card p-4 shadow-[0_0_40px_rgba(168,85,247,0.25)] sm:bottom-6 sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">
              {stepIndex + 1}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Quick Tour
              </p>
              <h2 id="quick-tour-title" className="text-base font-black text-foreground">
                {step.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            Skip
          </button>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
        <div className="mt-3 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs leading-5 text-foreground">
          {step.hint}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-1.5" aria-label="Tour progress">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === stepIndex ? "w-7 bg-primary" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              disabled={stepIndex === 0}
              className="rounded-md bg-secondary/60 px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={onNext}
              className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              {isLastStep ? "Start Drawing" : "Next"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function FrameThumb({
  frame,
  w,
  h,
  active,
  index,
  onClick,
  onContextMenu,
  onDurationChange,
}: {
  frame: Frame;
  w: number;
  h: number;
  active: boolean;
  index: number;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onDurationChange: (d: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(compositeFrame(frame, w, h), 0, 0, c.width, c.height);
  });
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={`relative shrink-0 rounded-md p-1 transition-all ${active ? "bg-primary/20 ring-2 ring-primary scale-110 z-10" : "bg-secondary/40 ring-1 ring-border hover:bg-secondary hover:scale-105"}`}
      >
        <canvas
          ref={ref}
          width={w}
          height={h}
          style={{ width: 52, height: 52, imageRendering: "pixelated" }}
          className="rounded checkerboard"
        />
        <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white">
          {index + 1}
        </span>
      </button>
      <div className="flex items-center mt-1 text-[9px] text-muted-foreground bg-input rounded overflow-hidden">
        <input
          type="number"
          min={10}
          max={5000}
          value={frame.duration || 120}
          onChange={(e) => onDurationChange(+e.target.value)}
          className="w-9 bg-transparent px-1 py-0.5 text-center outline-none"
          title="Duration (ms)"
        />
        <span className="pr-1 opacity-70">ms</span>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-white/5 bg-card/30 px-5 py-4">
      <h3
        onClick={() => setIsOpen(!isOpen)}
        className="mb-3 flex cursor-pointer items-center justify-between font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
      >
        {title}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}
        />
      </h3>
      <div
        className={`flex flex-col gap-2 transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
      >
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Brush;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs transition active:scale-95 ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
    >
      <Icon size={13} /> {children}
    </button>
  );
}

function IconBtn({
  icon: Icon,
  onClick,
  title,
  danger,
}: {
  icon: typeof Brush;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`grid h-8 w-8 place-items-center rounded-md bg-secondary text-muted-foreground transition active:scale-95 hover:text-foreground ${danger ? "hover:bg-destructive hover:text-destructive-foreground" : "hover:bg-secondary/70"}`}
        >
          <Icon size={16} />
        </button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );
}

function TopBtn({
  icon: Icon,
  label,
  onClick,
  as,
}: {
  icon: typeof Brush;
  label: string;
  onClick?: () => void;
  as?: "span";
}) {
  const cls =
    "flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-muted-foreground transition active:scale-95 hover:bg-secondary hover:text-foreground";
  if (as === "span")
    return (
      <span className={cls}>
        <Icon size={14} /> {label}
      </span>
    );
  return (
    <button onClick={onClick} className={cls}>
      <Icon size={14} /> {label}
    </button>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  as,
}: {
  icon: typeof Brush;
  label: string;
  onClick?: () => void;
  as?: "span";
}) {
  const cls =
    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs font-medium text-muted-foreground transition active:scale-95 hover:bg-secondary hover:text-foreground";
  if (as === "span")
    return (
      <span className={cls}>
        <Icon size={14} /> {label}
      </span>
    );
  return (
    <button onClick={onClick} className={cls}>
      <Icon size={14} /> {label}
    </button>
  );
}

function SmallBtn({
  icon: Icon,
  onClick,
  children,
}: {
  icon: typeof Brush;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1 rounded-md bg-secondary px-2 py-1.5 text-xs text-muted-foreground transition active:scale-95 hover:bg-secondary/70 hover:text-foreground"
    >
      <Icon size={13} /> {children}
    </button>
  );
}

function TilePreview({ frame, w, h }: { frame: Frame; w: number; h: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    const tile = compositeFrame(frame, w, h);
    const cell = Math.floor(c.width / 3);
    for (let ty = 0; ty < 3; ty++)
      for (let tx = 0; tx < 3; tx++) ctx.drawImage(tile, tx * cell, ty * cell, cell, cell);
  });
  return (
    <canvas
      ref={ref}
      width={180}
      height={180}
      style={{ width: "100%", imageRendering: "pixelated" }}
      className="rounded-md bg-[#22222a]"
    />
  );
}

function PromptModal({
  title,
  defaultValue = "",
  placeholder = "",
  onClose,
  onConfirm,
}: {
  title: string;
  defaultValue?: string;
  placeholder?: string;
  onClose: () => void;
  onConfirm: (val: string) => void;
}) {
  const [val, setVal] = useState(defaultValue);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm border border-border bg-card p-5 shadow-2xl rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">{title}</h3>
        <input
          ref={ref}
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onConfirm(val);
              onClose();
            } else if (e.key === "Escape") onClose();
          }}
          className="mb-5 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md bg-secondary/50 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(val);
              onClose();
            }}
            className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function ResizeModal({
  width,
  height,
  onClose,
  onConfirm,
}: {
  width: number;
  height: number;
  onClose: () => void;
  onConfirm: (w: number, h: number, scale: boolean) => void;
}) {
  const [w, setW] = useState(width);
  const [h, setH] = useState(height);
  const [scale, setScale] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs border border-border bg-card p-5 shadow-2xl rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary">
          Resize Project
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase">Width</label>
            <input
              type="number"
              min={1}
              max={512}
              value={w}
              onChange={(e) => setW(Math.max(1, +e.target.value))}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase">Height</label>
            <input
              type="number"
              min={1}
              max={512}
              value={h}
              onChange={(e) => setH(Math.max(1, +e.target.value))}
              className="mt-1 w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mb-5 flex items-center gap-2">
          <input
            type="checkbox"
            id="scale-pixels"
            checked={scale}
            onChange={(e) => setScale(e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary"
          />
          <label
            htmlFor="scale-pixels"
            className="text-xs text-muted-foreground cursor-pointer select-none"
          >
            Scale pixels (Nearest Neighbor)
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md bg-secondary/50 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(w, h, scale);
              onClose();
            }}
            className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition"
          >
            Resize
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    
    const validUrls = images.map(u => u.trim()).filter(u => u.startsWith("http"));
    
    let finalContent = `**[Pixora Studio Feedback]**\n${content}`;
    if (validUrls.length > 0) {
      finalContent += `\n\n**Attachments / Links:**\n` + validUrls.map(u => `- ${u}`).join('\n');
    }

    // Only use Discord embeds for URLs that look like direct images to prevent webhook 400 errors
    const embeds = validUrls
      .filter(u => /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(u))
      .map(url => ({ image: { url } }));

    const payload = {
      content: finalContent,
      embeds: embeds.length > 0 ? embeds : undefined
    };

    try {
      const res = await fetch("https://discord.com/api/webhooks/1522267130643611651/VRBK-00befRySEUJBtASQGjP2qewNMxDC5NnVZ3b3y357xCqRNevBuePtL-P3FqUDukq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 2000);
      } else {
        alert("Failed to send feedback.");
      }
    } catch (err) {
      alert("Error sending feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-card/95 shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-black/5 backdrop-blur-xl">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <Check size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground">Thank You!</h3>
            <p className="mt-2 text-sm text-muted-foreground">Your feedback has been sent successfully.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-white/5 bg-white/5 px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
                <AlertCircle size={18} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Report / Feedback
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  autoFocus
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Describe the issue, feature request, or share your ideas..."
                  className="h-28 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-foreground transition focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Image URLs (Optional)</span>
                  <button type="button" onClick={() => setImages([...images, ""])} className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold text-primary transition hover:bg-white/10">
                    + Add URL
                  </button>
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {images.map((img, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={img}
                        onChange={e => {
                          const newImgs = [...images];
                          newImgs[i] = e.target.value;
                          setImages(newImgs);
                        }}
                        placeholder="https://..."
                        className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-foreground transition focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 text-muted-foreground transition hover:bg-rose-500/20 hover:text-rose-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-white/5 mt-2">
                <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.4)] transition hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Sending..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function RestoreModal({
  project,
  onRestore,
  onDiscard,
}: {
  project: Project;
  onRestore: () => void;
  onDiscard: () => void;
}) {
  const savedAt = project.savedAt;
  const timeAgo = savedAt
    ? (() => {
        const diff = Date.now() - new Date(savedAt).getTime();
        const mins = Math.floor(diff / 60000);
        const hrs = Math.floor(mins / 60);
        const days = Math.floor(hrs / 24);
        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hrs > 0) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
        if (mins > 0) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
        return "just now";
      })()
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm border border-yellow-500/30 bg-card p-6 shadow-2xl rounded-xl">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400">
            Unsaved Session Found
          </h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          You have an unsaved project from your previous session. Continue where you left off?
        </p>
        <div className="mb-5 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Canvas</span>
            <span className="font-mono font-semibold text-foreground">
              {project.width}×{project.height}px
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Frames</span>
            <span className="font-semibold text-foreground">{project.frames.length}</span>
          </div>
          {timeAgo && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Saved</span>
              <span className="text-foreground">{timeAgo}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onDiscard}
            className="rounded-md bg-secondary/50 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-destructive/80 hover:text-white transition"
          >
            Discard
          </button>
          <button
            onClick={onRestore}
            className="rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black hover:bg-yellow-400 transition"
          >
            ✦ Restore
          </button>
        </div>
      </div>
    </div>
  );
}
