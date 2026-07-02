import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { A as Grid3x3, B as Copy, C as Minus, D as Image$1, F as FilePlusCorner, G as CircleQuestionMark, I as Eye, J as ChevronRight, K as CircleAlert, L as EyeOff, M as FlipVertical2, N as FlipHorizontal2, O as ImagePlus, P as Film, Q as Brush, R as Eraser, T as Layers, U as Circle, V as Command, W as CircleStop, X as ChevronDown, Y as ChevronLeft, Z as Check, _ as Pipette, a as Video, b as PaintBucket, c as Square, f as Save, g as Play, h as Plus, i as Volume2, j as FolderOpen, k as Grip, l as SquareDashed, m as Redo2, n as WandSparkles, o as Undo2, p as RotateCw, q as ChevronUp, r as VolumeX, s as Trash2, v as Pause, x as Move, z as Download } from "../_libs/lucide-react.mjs";
import { t as audio } from "./audio-BHwBOFKX.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Bt } from "../_libs/gifenc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-BjRBwkMI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var uid = () => Math.random().toString(36).slice(2, 10);
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var DEFAULT_PALETTE = [
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
	"#ffccaa"
];
function makePixels(w, h, fill = null) {
	return new Array(w * h).fill(fill);
}
function makeLayer(w, h, name = "Layer") {
	return {
		id: uid(),
		name,
		visible: true,
		locked: false,
		opacity: 1,
		blendMode: "normal",
		pixels: makePixels(w, h)
	};
}
function makeFrame(w, h, n = 1) {
	return {
		id: uid(),
		name: `Frame ${n}`,
		duration: 120,
		layers: [makeLayer(w, h, "Layer 1")]
	};
}
function createProject(w = 32, h = 32) {
	return {
		app: "Pixora",
		version: "5.1",
		width: w,
		height: h,
		palette: [...DEFAULT_PALETTE],
		frames: [makeFrame(w, h, 1)],
		tags: []
	};
}
function migrateProject(raw) {
	const p = {
		app: "Pixora",
		version: "5.1",
		width: Number(raw.width) || 32,
		height: Number(raw.height) || 32,
		palette: Array.isArray(raw.palette) ? raw.palette : [...DEFAULT_PALETTE],
		frames: [],
		tags: Array.isArray(raw.tags) ? raw.tags : []
	};
	if (Array.isArray(raw.frames) && raw.frames.length > 0) p.frames = raw.frames.map((f, fi) => ({
		id: f.id || uid(),
		name: f.name || `Frame ${fi + 1}`,
		duration: Number(f.duration) || 120,
		layers: Array.isArray(f.layers) && f.layers.length > 0 ? f.layers.map((l, li) => ({
			id: l.id || uid(),
			name: l.name || `Layer ${li + 1}`,
			visible: l.visible !== false,
			locked: !!l.locked,
			opacity: typeof l.opacity === "number" ? l.opacity : 1,
			blendMode: l.blendMode || "normal",
			pixels: Array.isArray(l.pixels) ? l.pixels : makePixels(p.width, p.height)
		})) : [makeLayer(p.width, p.height, "Layer 1")]
	}));
	else p.frames = [makeFrame(p.width, p.height, 1)];
	return p;
}
/**
* Run-length encode a Pixels array for storage.
* Each run: [value, count] where value is string|null.
* Returns a compact array like [null,5,"#ff0000",3,...] alternating value/count.
*/
function compressPixels(px) {
	const out = [];
	if (px.length === 0) return out;
	let cur = px[0];
	let count = 1;
	for (let i = 1; i < px.length; i++) if (px[i] === cur) count++;
	else {
		out.push(cur, count);
		cur = px[i];
		count = 1;
	}
	out.push(cur, count);
	return out;
}
/** Decode a compressed Pixels array back to Pixels. */
function decompressPixels(data) {
	const out = [];
	for (let i = 0; i < data.length; i += 2) {
		const val = data[i];
		const count = data[i + 1];
		for (let j = 0; j < count; j++) out.push(val);
	}
	return out;
}
function hexToRgb(hex) {
	let h = hex.replace("#", "");
	if (h.length === 3) h = h.split("").map((c) => c + c).join("");
	const n = parseInt(h, 16);
	return {
		r: n >> 16 & 255,
		g: n >> 8 & 255,
		b: n & 255
	};
}
function rgbToHex(r, g, b) {
	return "#" + [
		r,
		g,
		b
	].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("");
}
function luminance(hex) {
	const c = hexToRgb(hex);
	return .2126 * c.r + .7152 * c.g + .0722 * c.b;
}
function hueOf(hex) {
	const { r, g, b } = hexToRgb(hex);
	const rn = r / 255, gn = g / 255, bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const d = max - Math.min(rn, gn, bn);
	if (d === 0) return 0;
	let h = 0;
	if (max === rn) h = (gn - bn) / d % 6;
	else if (max === gn) h = (bn - rn) / d + 2;
	else h = (rn - gn) / d + 4;
	return (h * 60 + 360) % 360;
}
function hslToHex(h, s, l) {
	h = (h % 360 + 360) % 360;
	s /= 100;
	l /= 100;
	const k = (n) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}
function hexToHSL(hex) {
	const { r, g, b } = hexToRgb(hex);
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	const d = max - min;
	if (d === 0) return [
		0,
		0,
		l * 100
	];
	const s = d / (1 - Math.abs(2 * l - 1));
	let h = 0;
	if (max === rn) h = (gn - bn) / d % 6;
	else if (max === gn) h = (bn - rn) / d + 2;
	else h = (rn - gn) / d + 4;
	return [
		(h * 60 + 360) % 360,
		s * 100,
		l * 100
	];
}
function rampBetween(a, b, steps) {
	const ca = hexToRgb(a), cb = hexToRgb(b);
	const out = [];
	for (let i = 0; i < steps; i++) {
		const t = steps === 1 ? 0 : i / (steps - 1);
		out.push(rgbToHex(ca.r + (cb.r - ca.r) * t, ca.g + (cb.g - ca.g) * t, ca.b + (cb.b - ca.b) * t));
	}
	return out;
}
function linePoints(x0, y0, x1, y1) {
	const pts = [];
	const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
	const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
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
function rectPoints(x0, y0, x1, y1, fill) {
	const pts = [];
	const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
	const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
	for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) if (fill || x === minX || x === maxX || y === minY || y === maxY) pts.push([x, y]);
	return pts;
}
function ellipsePoints(x0, y0, x1, y1, fill) {
	const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
	const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
	const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
	const rx = Math.max(.5, (maxX - minX) / 2), ry = Math.max(.5, (maxY - minY) / 2);
	const pts = [];
	const seen = /* @__PURE__ */ new Set();
	for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
		const nx = (x - cx) / rx, ny = (y - cy) / ry;
		const d = nx * nx + ny * ny;
		if (fill ? d <= 1 : d <= 1 && d >= .55) {
			const key = `${x},${y}`;
			if (!seen.has(key)) {
				seen.add(key);
				pts.push([x, y]);
			}
		}
	}
	return pts;
}
function floodFill(pixels, w, h, sx, sy, color) {
	const start = pixels[sy * w + sx] ?? null;
	if (start === color) return [];
	const out = [];
	const stack = [[sx, sy]];
	const seen = /* @__PURE__ */ new Set();
	while (stack.length) {
		const [x, y] = stack.pop();
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
var PALETTE_PRESETS = [
	{
		name: "PICO-8",
		colors: [...DEFAULT_PALETTE]
	},
	{
		name: "Game Boy",
		colors: [
			"#0f380f",
			"#306230",
			"#8bac0f",
			"#9bbc0f"
		]
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
			"#6844fc"
		]
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
			"#333c57"
		]
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
			"#0484d1"
		]
	}
];
function flipH(pixels, w, h) {
	const out = makePixels(w, h);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[y * w + x] = pixels[y * w + (w - 1 - x)];
	return out;
}
function flipV(pixels, w, h) {
	const out = makePixels(w, h);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[y * w + x] = pixels[(h - 1 - y) * w + x];
	return out;
}
/** Rotate 90deg clockwise (only meaningful for square canvases; keeps size). */
function rotate90(pixels, w, h) {
	const out = makePixels(w, h);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const nx = h - 1 - y, ny = x;
		if (nx < w && ny < h) out[ny * w + nx] = pixels[y * w + x];
	}
	return out;
}
/** Add an outline of `color` around all non-empty pixels. */
function outline(pixels, w, h, color) {
	const out = pixels.slice();
	const dirs = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		if (pixels[y * w + x]) continue;
		for (const [dx, dy] of dirs) {
			const nx = x + dx, ny = y + dy;
			if (nx >= 0 && ny >= 0 && nx < w && ny < h && pixels[ny * w + nx]) {
				out[y * w + x] = color;
				break;
			}
		}
	}
	return out;
}
function shiftHue(pixels, deg) {
	return pixels.map((c) => {
		if (!c) return c;
		const h = (hueOf(c) + deg + 360) % 360;
		const { r, g, b } = hexToRgb(c);
		const rn = r / 255, gn = g / 255, bn = b / 255;
		const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
		const l = (max + min) / 2;
		const d = max - min;
		return hslToHex(h, (d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))) * 100, l * 100);
	});
}
function grayscale(pixels) {
	return pixels.map((c) => {
		if (!c) return c;
		const { r, g, b } = hexToRgb(c);
		const gray = Math.round(.299 * r + .587 * g + .114 * b);
		return rgbToHex(gray, gray, gray);
	});
}
function invert(pixels) {
	return pixels.map((c) => {
		if (!c) return c;
		const { r, g, b } = hexToRgb(c);
		return rgbToHex(255 - r, 255 - g, 255 - b);
	});
}
function resizeProject(proj, newW, newH, scale = false) {
	const np = JSON.parse(JSON.stringify(proj));
	const oldW = np.width;
	const oldH = np.height;
	np.width = newW;
	np.height = newH;
	np.frames.forEach((frame) => {
		frame.layers.forEach((layer) => {
			const oldPx = layer.pixels;
			const newPx = makePixels(newW, newH);
			for (let y = 0; y < newH; y++) for (let x = 0; x < newW; x++) if (scale) {
				const srcX = Math.floor(x / newW * oldW);
				const srcY = Math.floor(y / newH * oldH);
				newPx[y * newW + x] = oldPx[srcY * oldW + srcX];
			} else if (x < oldW && y < oldH) newPx[y * newW + x] = oldPx[y * oldW + x];
			layer.pixels = newPx;
		});
	});
	return np;
}
/** 4x4 Bayer ordered dithering threshold matrix (normalized 0..1). */
var BAYER4 = [
	[
		0,
		8,
		2,
		10
	],
	[
		12,
		4,
		14,
		6
	],
	[
		3,
		11,
		1,
		9
	],
	[
		15,
		7,
		13,
		5
	]
].map((row) => row.map((v) => v / 16));
/** Returns true if a dither cell at (x,y) with given density (0..1) should paint. */
function ditherOn(x, y, density) {
	return density > BAYER4[y & 3][x & 3];
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var { GIFEncoder, quantize, applyPalette } = Bt;
var TOOLS = [
	{
		id: "brush",
		icon: Brush,
		label: "Brush",
		key: "B"
	},
	{
		id: "dither",
		icon: Grip,
		label: "Dither",
		key: "D"
	},
	{
		id: "eraser",
		icon: Eraser,
		label: "Eraser",
		key: "E"
	},
	{
		id: "fill",
		icon: PaintBucket,
		label: "Fill",
		key: "F"
	},
	{
		id: "pick",
		icon: Pipette,
		label: "Picker",
		key: "I"
	},
	{
		id: "line",
		icon: Minus,
		label: "Line",
		key: "L"
	},
	{
		id: "rect",
		icon: Square,
		label: "Rectangle",
		key: "R"
	},
	{
		id: "circle",
		icon: Circle,
		label: "Ellipse",
		key: "C"
	},
	{
		id: "select",
		icon: SquareDashed,
		label: "Select",
		key: "S"
	},
	{
		id: "wand",
		icon: WandSparkles,
		label: "Magic Wand",
		key: "W"
	},
	{
		id: "move",
		icon: Move,
		label: "Move layer",
		key: "M"
	}
];
var BLEND_MODES = [
	"normal",
	"multiply",
	"screen",
	"overlay",
	"color-dodge",
	"lighten",
	"darken"
];
var CANVAS_PRESETS = [
	16,
	32,
	48,
	64,
	96,
	128
];
var QUICK_TOUR_STORAGE_KEY = "pixora-studio-quick-tour-v1";
var QUICK_TOUR_STEPS = [
	{
		target: "topbar",
		title: "Welcome to Pixora Studio",
		body: "This is your main control bar: File saves and opens projects, Export creates images or animations, View toggles the timeline, Undo/Redo control history, and Ctrl+K opens the Command Palette.",
		hint: "The ? button next to Pixora Studio always opens the full user guide."
	},
	{
		target: "tools",
		title: "Choose a Drawing Tool",
		body: "The left toolbar holds 11 tools such as Brush, Eraser, Fill, Picker, Line, Selection, and Magic Wand. Hover an icon to see its name and shortcut.",
		hint: "Quick start: press B for Brush, E for Eraser, and F for Fill."
	},
	{
		target: "canvas",
		title: "Draw Directly on the Canvas",
		body: "The center area is where you place pixels. Click to draw one pixel, or hold and drag to draw continuously. The status bar shows live X/Y coordinates.",
		hint: "The default 32 x 32 canvas is great for icons, game items, and small sprites."
	},
	{
		target: "panels",
		title: "Adjust Details in the Right Panel",
		body: "The right panel controls canvas size, zoom, animation preview, brush size, symmetry, reference images, palettes, and layers.",
		hint: "If a change does not behave as expected, check the active layer first."
	},
	{
		target: "timeline",
		title: "Create Animation with the Timeline",
		body: "The bottom timeline lets you add frames, duplicate frames, set frame duration, and preview animation. Each frame keeps its own layer stack.",
		hint: "Duplicate a frame and move details by 1 pixel for a fast idle animation."
	},
	{
		target: "topbar",
		title: "Autosave and Replay the Tour",
		body: "Pixora automatically saves a browser draft after you make changes. This tour appears only once, but you can replay it with the Tour button in the top bar.",
		hint: "For real work, use File > Save Project to download a JSON backup."
	}
];
function clone(p) {
	return JSON.parse(JSON.stringify(p));
}
/** Build ImageData for a layer's pixels at native resolution. */
function pixelsToImageData(pixels, w, h) {
	const data = new Uint8ClampedArray(w * h * 4);
	for (let i = 0; i < pixels.length; i++) {
		const c = pixels[i];
		if (!c) continue;
		const n = parseInt(c.replace("#", ""), 16);
		data[i * 4] = n >> 16 & 255;
		data[i * 4 + 1] = n >> 8 & 255;
		data[i * 4 + 2] = n & 255;
		data[i * 4 + 3] = 255;
	}
	return new ImageData(data, w, h);
}
function layerCanvas(pixels, w, h) {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	c.getContext("2d").putImageData(pixelsToImageData(pixels, w, h), 0, 0);
	return c;
}
/** Composite a frame's visible layers to a native-resolution canvas. */
function compositeFrame(frame, w, h, overrideLayerId, overridePixels) {
	const out = document.createElement("canvas");
	out.width = w;
	out.height = h;
	const ctx = out.getContext("2d");
	for (const layer of frame.layers) {
		if (!layer.visible) continue;
		const px = layer.id === overrideLayerId && overridePixels ? overridePixels : layer.pixels;
		ctx.globalAlpha = layer.opacity;
		ctx.globalCompositeOperation = layer.blendMode;
		ctx.drawImage(layerCanvas(px, w, h), 0, 0);
	}
	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = "source-over";
	return out;
}
function PixelStudio() {
	const [project, setProject] = (0, import_react.useState)(() => createProject(32, 32));
	const [restorePrompt, setRestorePrompt] = (0, import_react.useState)(null);
	const [autosaveChecked, setAutosaveChecked] = (0, import_react.useState)(false);
	const [quickTourOpen, setQuickTourOpen] = (0, import_react.useState)(false);
	const [quickTourStep, setQuickTourStep] = (0, import_react.useState)(0);
	const [showFeedback, setShowFeedback] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem("pixora-autosave");
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed._compressed) {
					parsed.frames?.forEach((f) => f.layers?.forEach((l) => {
						if (Array.isArray(l.pixels)) l.pixels = decompressPixels(l.pixels);
					}));
					delete parsed._compressed;
				}
				setRestorePrompt(migrateProject(parsed));
			}
		} catch (error) {
			console.warn("[Pixora] Failed to read autosave", error);
		}
		setAutosaveChecked(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!autosaveChecked || restorePrompt) return;
		try {
			if (localStorage.getItem(QUICK_TOUR_STORAGE_KEY) === "done") return;
			setQuickTourStep(0);
			setQuickTourOpen(true);
		} catch {
			setQuickTourOpen(true);
		}
	}, [autosaveChecked, restorePrompt]);
	const initialized = (0, import_react.useRef)(false);
	const autosaveTimer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!autosaveChecked) return;
		if (restorePrompt) return;
		if (!initialized.current) {
			initialized.current = true;
			return;
		}
		if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
		autosaveTimer.current = setTimeout(() => {
			try {
				const compressed = JSON.parse(JSON.stringify(project));
				compressed.frames?.forEach((f) => f.layers?.forEach((l) => {
					l.pixels = compressPixels(l.pixels);
				}));
				compressed._compressed = true;
				compressed.savedAt = (/* @__PURE__ */ new Date()).toISOString();
				localStorage.setItem("pixora-autosave", JSON.stringify(compressed));
			} catch (e) {
				console.warn("[Pixora] Autosave failed (storage full?)", e);
			}
		}, 1500);
		return () => {
			if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
		};
	}, [
		project,
		restorePrompt,
		autosaveChecked
	]);
	(0, import_react.useEffect)(() => {
		const onVisibility = () => {
			if (document.hidden) setPlaying(false);
		};
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, []);
	const [frameIndex, setFrameIndex] = (0, import_react.useState)(0);
	const [layerIndex, setLayerIndex] = (0, import_react.useState)(0);
	const [tool, setTool] = (0, import_react.useState)("brush");
	const [primary, setPrimary] = (0, import_react.useState)("#000000");
	const [secondary, setSecondary] = (0, import_react.useState)("#ffffff");
	const [brushSize, setBrushSize] = (0, import_react.useState)(1);
	const [zoom, setZoom] = (0, import_react.useState)(16);
	const [showGrid, setShowGrid] = (0, import_react.useState)(true);
	const [tilePreview, setTilePreview] = (0, import_react.useState)(false);
	const [audioEnabled, setAudioEnabled] = (0, import_react.useState)(true);
	const [symX, setSymX] = (0, import_react.useState)(false);
	const [symY, setSymY] = (0, import_react.useState)(false);
	const [onionMode, setOnionMode] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [fps, setFps] = (0, import_react.useState)(8);
	const [status, setStatus] = (0, import_react.useState)("Ready.");
	const [, forceRender] = (0, import_react.useReducer)((x) => x + 1, 0);
	const [sym4, setSym4] = (0, import_react.useState)(false);
	const [ditherDensity, setDitherDensity] = (0, import_react.useState)(.5);
	const [refUrl, setRefUrl] = (0, import_react.useState)(null);
	const [refOpacity, setRefOpacity] = (0, import_react.useState)(.5);
	const [showRef, setShowRef] = (0, import_react.useState)(true);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [cmdOpen, setCmdOpen] = (0, import_react.useState)(false);
	const [clipMask, setClipMask] = (0, import_react.useState)(null);
	const [showTimeline, setShowTimeline] = (0, import_react.useState)(true);
	const [selection, setSelection] = (0, import_react.useState)(null);
	const [exportScale, setExportScale] = (0, import_react.useState)(8);
	const [frameMenu, setFrameMenu] = (0, import_react.useState)(null);
	const [activeTag, setActiveTag] = (0, import_react.useState)(null);
	const [hoverCoords, setHoverCoords] = (0, import_react.useState)(null);
	const [showResize, setShowResize] = (0, import_react.useState)(false);
	const [customPrompt, setCustomPrompt] = (0, import_react.useState)(null);
	const refImgRef = (0, import_react.useRef)(null);
	const recorderRef = (0, import_react.useRef)(null);
	const undoRef = (0, import_react.useRef)([]);
	const redoRef = (0, import_react.useRef)([]);
	const canvasRef = (0, import_react.useRef)(null);
	const mainRef = (0, import_react.useRef)(null);
	const panning = (0, import_react.useRef)(false);
	const spaceDown = (0, import_react.useRef)(false);
	const panStartRef = (0, import_react.useRef)({
		x: 0,
		y: 0,
		sx: 0,
		sy: 0
	});
	const drawing = (0, import_react.useRef)(false);
	const baseRef = (0, import_react.useRef)(null);
	const workRef = (0, import_react.useRef)(null);
	const startRef = (0, import_react.useRef)(null);
	const lastRef = (0, import_react.useRef)(null);
	const moveRef = (0, import_react.useRef)(null);
	const { width: W, height: H } = project;
	const frame = project.frames[Math.min(frameIndex, project.frames.length - 1)];
	const activeLayer = frame.layers[Math.min(layerIndex, frame.layers.length - 1)];
	const pushUndo = (0, import_react.useCallback)(() => {
		undoRef.current.push(JSON.stringify(project));
		if (undoRef.current.length > 80) undoRef.current.shift();
		redoRef.current = [];
	}, [project]);
	const undo = (0, import_react.useCallback)(() => {
		if (!undoRef.current.length) return;
		redoRef.current.push(JSON.stringify(project));
		const prev = JSON.parse(undoRef.current.pop());
		setProject(prev);
		setFrameIndex((f) => clamp(f, 0, prev.frames.length - 1));
		setStatus("Undo");
	}, [project]);
	const redo = (0, import_react.useCallback)(() => {
		if (!redoRef.current.length) return;
		undoRef.current.push(JSON.stringify(project));
		setProject(JSON.parse(redoRef.current.pop()));
		setStatus("Redo");
	}, [project]);
	const render = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		canvas.width = W * zoom;
		canvas.height = H * zoom;
		ctx.imageSmoothingEnabled = false;
		const s = Math.max(4, Math.round(zoom / 2));
		for (let y = 0; y < canvas.height; y += s) for (let x = 0; x < canvas.width; x += s) {
			ctx.fillStyle = (x / s + y / s & 1) === 0 ? "#2a2a33" : "#22222a";
			ctx.fillRect(x, y, s, s);
		}
		if (onionMode > 0) {
			const prev = project.frames[frameIndex - 1];
			const next = project.frames[frameIndex + 1];
			const drawTinted = (f, color) => {
				const c = document.createElement("canvas");
				c.width = canvas.width;
				c.height = canvas.height;
				const cx = c.getContext("2d");
				cx.imageSmoothingEnabled = false;
				cx.drawImage(compositeFrame(f, W, H), 0, 0, canvas.width, canvas.height);
				if (onionMode === 2) {
					cx.globalCompositeOperation = "source-in";
					cx.fillStyle = color;
					cx.fillRect(0, 0, canvas.width, canvas.height);
				}
				ctx.globalAlpha = .35;
				ctx.drawImage(c, 0, 0);
			};
			if (prev) drawTinted(prev, "#ff2222");
			if (next) drawTinted(next, "#22ff22");
			ctx.globalAlpha = 1;
		}
		const composed = compositeFrame(frame, W, H, drawing.current ? activeLayer.id : void 0, drawing.current ? workRef.current ?? void 0 : void 0);
		ctx.drawImage(composed, 0, 0, canvas.width, canvas.height);
		if (showRef && refImgRef.current) {
			ctx.globalAlpha = refOpacity;
			ctx.drawImage(refImgRef.current, 0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
		}
		if (showGrid && zoom >= 6) {
			ctx.strokeStyle = "rgba(255,255,255,0.08)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			for (let x = 0; x <= W; x++) {
				ctx.moveTo(x * zoom + .5, 0);
				ctx.lineTo(x * zoom + .5, canvas.height);
			}
			for (let y = 0; y <= H; y++) {
				ctx.moveTo(0, y * zoom + .5);
				ctx.lineTo(canvas.width, y * zoom + .5);
			}
			ctx.stroke();
		}
		if (selection) {
			const sx = Math.min(selection.x0, selection.x1);
			const sy = Math.min(selection.y0, selection.y1);
			const sw = Math.abs(selection.x1 - selection.x0) + 1;
			const sh = Math.abs(selection.y1 - selection.y0) + 1;
			ctx.setLineDash([4, 3]);
			ctx.strokeStyle = "rgba(120,220,255,0.95)";
			ctx.lineWidth = 1.5;
			ctx.strokeRect(sx * zoom + .5, sy * zoom + .5, sw * zoom, sh * zoom);
			ctx.setLineDash([]);
		}
		const hv = moveRef.current;
		if (hv && !drawing.current) {
			ctx.strokeStyle = "rgba(255,255,255,0.7)";
			ctx.lineWidth = 2;
			const half = Math.floor(brushSize / 2);
			ctx.strokeRect((hv[0] - half) * zoom, (hv[1] - half) * zoom, brushSize * zoom, brushSize * zoom);
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
		refOpacity
	]);
	(0, import_react.useEffect)(() => {
		render();
	}, [render]);
	(0, import_react.useEffect)(() => {
		if (!playing || project.frames.length < 2) return;
		let timer;
		const tag = activeTag ? project.tags?.find((t) => t.id === activeTag) : null;
		const loop = () => {
			setFrameIndex((f) => {
				let nf = f + 1;
				if (tag) {
					if (nf > tag.to || nf < tag.from) nf = tag.from;
				} else nf = nf % project.frames.length;
				if (nf >= project.frames.length) nf = 0;
				timer = setTimeout(loop, project.frames[nf].duration || 120);
				return nf;
			});
		};
		timer = setTimeout(loop, project.frames[frameIndex].duration || 120);
		return () => clearTimeout(timer);
	}, [
		playing,
		project.frames,
		frameIndex,
		activeTag,
		project.tags
	]);
	const previewCanvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		let timer = null;
		let pFrame = 0;
		const loop = () => {
			if (cancel || project.frames.length === 0) return;
			const c = previewCanvasRef.current;
			if (c) {
				const ctx = c.getContext("2d");
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
	}, [
		project,
		W,
		H
	]);
	const stampPoints = (0, import_react.useCallback)((target, points, color) => {
		const half = Math.floor(brushSize / 2);
		const isDither = tool === "dither" && color !== null;
		const put = (px, py) => {
			for (let dy = 0; dy < brushSize; dy++) for (let dx = 0; dx < brushSize; dx++) {
				const x = px - half + dx, y = py - half + dy;
				if (x < 0 || y < 0 || x >= W || y >= H) continue;
				if (isDither && !ditherOn(x, y, ditherDensity)) continue;
				if (clipMask && !clipMask.has(y * W + x)) continue;
				target[y * W + x] = color;
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
	}, [
		brushSize,
		W,
		H,
		symX,
		symY,
		sym4,
		tool,
		ditherDensity,
		clipMask
	]);
	const commitWork = (0, import_react.useCallback)((work) => {
		pushUndo();
		setProject((p) => {
			const np = clone(p);
			np.frames[frameIndex].layers[layerIndex].pixels = work;
			return np;
		});
	}, [
		pushUndo,
		frameIndex,
		layerIndex
	]);
	const eventToCell = (e) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const x = Math.floor((e.clientX - rect.left) / rect.width * W);
		const y = Math.floor((e.clientY - rect.top) / rect.height * H);
		return [clamp(x, 0, W - 1), clamp(y, 0, H - 1)];
	};
	(0, import_react.useEffect)(() => {
		const el = mainRef.current;
		if (!el) return;
		const onWheel = (e) => {
			if (e.ctrlKey) {
				e.preventDefault();
				setZoom((z) => clamp(z + (e.deltaY > 0 ? -1 : 1), 1, 128));
			}
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, []);
	const onPointerDown = (e) => {
		if (e.button === 1 || spaceDown.current) {
			e.preventDefault();
			canvasRef.current?.setPointerCapture(e.pointerId);
			panning.current = true;
			panStartRef.current = {
				x: e.clientX,
				y: e.clientY,
				sx: mainRef.current.scrollLeft,
				sy: mainRef.current.scrollTop
			};
			return;
		}
		if (activeLayer.locked || !activeLayer.visible) {
			setStatus("Layer is locked/hidden");
			return;
		}
		canvasRef.current.setPointerCapture(e.pointerId);
		const [x, y] = eventToCell(e);
		const color = e.button === 2 || e.shiftKey ? secondary : primary;
		const erase = tool === "eraser" || e.button === 2;
		if (tool === "wand") {
			const idxs = floodFill(activeLayer.pixels, W, H, x, y, activeLayer.pixels[y * W + x]);
			if (idxs.length) {
				setClipMask(new Set(idxs));
				setStatus(`Mask created (${idxs.length} px). Click 'Clear Mask' to remove.`);
			}
			return;
		}
		if (tool === "pick") {
			const c = compositeFrame(frame, W, H).getContext("2d").getImageData(x, y, 1, 1).data;
			if (c[3] > 0) {
				const hex = "#" + [
					c[0],
					c[1],
					c[2]
				].map((v) => v.toString(16).padStart(2, "0")).join("");
				setPrimary(hex);
				setStatus(`Picked ${hex}`);
			}
			return;
		}
		if (tool === "fill") {
			const idxs = floodFill(activeLayer.pixels, W, H, x, y, erase ? null : color);
			if (idxs.length) {
				const work = activeLayer.pixels.slice();
				for (const i of idxs) work[i] = erase ? null : color;
				commitWork(work);
			}
			return;
		}
		drawing.current = true;
		baseRef.current = activeLayer.pixels.slice();
		workRef.current = activeLayer.pixels.slice();
		startRef.current = [x, y];
		lastRef.current = [x, y];
		if (tool === "brush" || tool === "eraser" || tool === "dither") {
			stampPoints(workRef.current, [[x, y]], erase ? null : color);
			audio.playDraw();
		}
		if (tool === "select") setSelection({
			x0: x,
			y0: y,
			x1: x,
			y1: y
		});
		canvasRef.current._erase = erase;
		canvasRef.current._color = color;
		render();
	};
	const onPointerMove = (e) => {
		if (panning.current) {
			if (mainRef.current) {
				mainRef.current.scrollLeft = panStartRef.current.sx - (e.clientX - panStartRef.current.x);
				mainRef.current.scrollTop = panStartRef.current.sy - (e.clientY - panStartRef.current.y);
			}
			return;
		}
		const [x, y] = eventToCell(e);
		moveRef.current = [x, y];
		setHoverCoords([x, y]);
		if (!drawing.current) {
			render();
			return;
		}
		const base = baseRef.current;
		const work = base.slice();
		workRef.current = work;
		const start = startRef.current;
		const erase = canvasRef.current._erase;
		const color = canvasRef.current._color ?? primary;
		const fillColor = erase ? null : color;
		if (tool === "select") {
			setSelection({
				x0: start[0],
				y0: start[1],
				x1: x,
				y1: y
			});
			return;
		}
		if (tool === "brush" || tool === "eraser" || tool === "dither") {
			const last = lastRef.current;
			stampPoints(work, linePoints(last[0], last[1], x, y), fillColor);
			const prev = baseRef.current;
			lastRef.current = [x, y];
			workRef.current = accumulateBrush(prev, work);
		} else if (tool === "line") stampPoints(work, linePoints(start[0], start[1], x, y), fillColor);
		else if (tool === "rect") stampPoints(work, rectPoints(start[0], start[1], x, y, false), fillColor);
		else if (tool === "circle") stampPoints(work, ellipsePoints(start[0], start[1], x, y, false), fillColor);
		else if (tool === "move") {
			const dx = x - start[0], dy = y - start[1];
			const moved = makePixels(W, H);
			for (let iy = 0; iy < H; iy++) for (let ix = 0; ix < W; ix++) {
				const ny = iy - dy, nx = ix - dx;
				if (nx >= 0 && ny >= 0 && nx < W && ny < H) moved[iy * W + ix] = base[ny * W + nx];
			}
			workRef.current = moved;
		}
		render();
	};
	const brushAccum = (0, import_react.useRef)(null);
	function accumulateBrush(_base, latest) {
		if (!brushAccum.current) brushAccum.current = _base.slice();
		for (let i = 0; i < latest.length; i++) if (latest[i] !== _base[i]) brushAccum.current[i] = latest[i];
		return brushAccum.current;
	}
	const onPointerUp = () => {
		if (panning.current) {
			panning.current = false;
			return;
		}
		if (!drawing.current) return;
		drawing.current = false;
		if (tool === "select") return;
		const work = (tool === "brush" || tool === "eraser") && brushAccum.current ? brushAccum.current : workRef.current;
		if (work) commitWork(work);
		brushAccum.current = null;
		workRef.current = null;
		baseRef.current = null;
		render();
	};
	const kbdRef = (0, import_react.useRef)({});
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === " ") spaceDown.current = true;
			const el = e.target;
			if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
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
			const t = TOOLS.find((tt) => tt.key.toLowerCase() === e.key.toLowerCase());
			if (t) h.setTool?.(t.id);
			if (e.key === "g") h.setShowGrid?.((v) => !v);
			if (e.key === "t") h.setTilePreview?.((v) => !v);
			if (e.key === "[") h.setBrushSize?.((s) => Math.max(1, s - 1));
			if (e.key === "]") h.setBrushSize?.((s) => Math.min(16, s + 1));
			if (e.key === "ArrowLeft") h.setFrameIndex?.((f) => Math.max(0, f - 1));
			if (e.key === "ArrowRight") h.setFrameIndex?.((f) => Math.min((h.project?.frames.length ?? 1) - 1, f + 1));
		};
		const onKeyUp = (e) => {
			if (e.key === " ") spaceDown.current = false;
		};
		window.addEventListener("keydown", onKey);
		window.addEventListener("keyup", onKeyUp);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("keyup", onKeyUp);
		};
	}, []);
	const mutate = (fn, snapshot = true) => {
		if (snapshot) pushUndo();
		setProject((p) => {
			const np = clone(p);
			fn(np);
			return np;
		});
	};
	const newProject = (w, h) => {
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
	const handleResize = (w, h, scale) => {
		if (w > 0 && h > 0) {
			mutate((p) => {
				const np = resizeProject(p, w, h, scale);
				Object.assign(p, np);
			}, true);
			setStatus(`Resized to ${w}x${h}`);
		}
	};
	const [selPalette, setSelPalette] = (0, import_react.useState)(0);
	const [rampA, setRampA] = (0, import_react.useState)("#1d2b53");
	const [rampB, setRampB] = (0, import_react.useState)("#ff004d");
	const [rampSteps, setRampSteps] = (0, import_react.useState)(6);
	const exportPNG = (scale = 8) => {
		const src = compositeFrame(frame, W, H);
		const out = document.createElement("canvas");
		out.width = W * scale;
		out.height = H * scale;
		const c = out.getContext("2d");
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
		const c = out.getContext("2d");
		c.imageSmoothingEnabled = false;
		exportFrames.forEach((f, i) => c.drawImage(compositeFrame(f, W, H), i * W * scale, 0, W * scale, H * scale));
		downloadCanvas(out, tag ? `pixora-spritesheet-${tag.name}.png` : "pixora-spritesheet.png");
		audio.playSuccess();
	};
	const downloadCanvas = (c, name) => {
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
	const loadJSON = (file) => {
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
	const applyToLayer = (fn) => {
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
	const doRotate = () => {
		applyToLayer((px) => rotate90(px, W, H));
		setStatus("Rotated 90°");
	};
	const doOutline = () => {
		applyToLayer((px) => outline(px, W, H, primary));
		setStatus("Outline added");
	};
	const doHueShift = (deg) => {
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
	const selBounds = () => {
		if (!selection) return null;
		return {
			minX: Math.min(selection.x0, selection.x1),
			maxX: Math.max(selection.x0, selection.x1),
			minY: Math.min(selection.y0, selection.y1),
			maxY: Math.max(selection.y0, selection.y1)
		};
	};
	const clipboardRef = (0, import_react.useRef)(null);
	const copySelection = () => {
		const b = selBounds();
		if (!b) return;
		const w = b.maxX - b.minX + 1, h = b.maxY - b.minY + 1;
		const px = makePixels(w, h);
		for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) px[y * w + x] = activeLayer.pixels[(b.minY + y) * W + (b.minX + x)];
		clipboardRef.current = {
			w,
			h,
			px
		};
		setStatus(`Copied ${w}×${h}`);
	};
	const pasteSelection = () => {
		const clip = clipboardRef.current;
		if (!clip) {
			setStatus("Clipboard empty");
			return;
		}
		const b = selBounds();
		const ox = b ? b.minX : 0, oy = b ? b.minY : 0;
		applyToLayer((px) => {
			const out = px.slice();
			for (let y = 0; y < clip.h; y++) for (let x = 0; x < clip.w; x++) {
				const tx = ox + x, ty = oy + y;
				if (tx >= 0 && ty >= 0 && tx < W && ty < H && clip.px[y * clip.w + x]) out[ty * W + tx] = clip.px[y * clip.w + x];
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
			for (let y = b.minY; y <= b.maxY; y++) for (let x = b.minX; x <= b.maxX; x++) out[y * W + x] = null;
			return out;
		});
		setStatus("Cleared selection");
	};
	const loadRef = (file) => {
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
		const cx = c.getContext("2d");
		cx.drawImage(img, 0, 0, 64, 64);
		const d = cx.getImageData(0, 0, 64, 64).data;
		const counts = /* @__PURE__ */ new Map();
		for (let i = 0; i < d.length; i += 4) {
			if (d[i + 3] < 128) continue;
			const q = (v) => Math.round(v / 32) * 32;
			const hex = "#" + [
				q(d[i]),
				q(d[i + 1]),
				q(d[i + 2])
			].map((v) => clamp(v, 0, 255).toString(16).padStart(2, "0")).join("");
			counts.set(hex, (counts.get(hex) ?? 0) + 1);
		}
		const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16).map((e) => e[0]);
		mutate((p) => {
			p.palette = top;
		}, true);
		setStatus(`Extracted ${top.length} colors`);
	};
	const loadPreset = (name) => {
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
	const importPalette = (file) => {
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
	const exportGIF = () => {
		setStatus("Encoding GIF…");
		const gif = GIFEncoder();
		const tag = activeTag ? project.tags?.find((t) => t.id === activeTag) : null;
		(tag ? project.frames.slice(tag.from, tag.to + 1) : project.frames).forEach((f) => {
			const src = compositeFrame(f, W, H);
			const out = document.createElement("canvas");
			out.width = W * exportScale;
			out.height = H * exportScale;
			const c = out.getContext("2d");
			c.imageSmoothingEnabled = false;
			c.drawImage(src, 0, 0, out.width, out.height);
			const data = c.getImageData(0, 0, out.width, out.height).data;
			const palette = quantize(data, 256);
			const index = applyPalette(data, palette);
			gif.writeFrame(index, out.width, out.height, {
				palette,
				delay: f.duration || 120
			});
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
	const exportWebM = async (scale = 8) => {
		setStatus("Rendering Video...");
		const canvas = document.createElement("canvas");
		canvas.width = W * scale;
		canvas.height = H * scale;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.imageSmoothingEnabled = false;
		const stream = canvas.captureStream(0);
		const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
		const recorder = new MediaRecorder(stream, {
			mimeType: mime,
			videoBitsPerSecond: 5e6
		});
		const chunks = [];
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
		for (let loop = 0; loop < 3; loop++) for (let i = 0; i < exportFrames.length; i++) {
			const f = exportFrames[i];
			const comp = compositeFrame(f, W, H);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(comp, 0, 0, canvas.width, canvas.height);
			const track = stream.getVideoTracks()[0];
			if (track.requestFrame) track.requestFrame();
			await new Promise((r) => setTimeout(r, f.duration || 120));
		}
		recorder.stop();
	};
	const toggleRecording = () => {
		if (recording) {
			recorderRef.current?.stop();
			return;
		}
		const canvas = canvasRef.current;
		if (!canvas) return;
		const stream = canvas.captureStream(30);
		const chunks = [];
		const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
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
	const importImageAsLayer = (file) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const c = document.createElement("canvas");
			c.width = W;
			c.height = H;
			const ctx = c.getContext("2d");
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(img, 0, 0, W, H);
			const data = ctx.getImageData(0, 0, W, H).data;
			const pixels = makePixels(W, H);
			for (let i = 0; i < pixels.length; i++) {
				const idx = i * 4;
				if (data[idx + 3] > 127) pixels[i] = "#" + [
					data[idx],
					data[idx + 1],
					data[idx + 2]
				].map((v) => v.toString(16).padStart(2, "0")).join("");
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
		selection
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
		} catch {}
		setQuickTourOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-screen flex-col overflow-hidden bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: `relative z-10 flex h-14 items-center gap-3 border-b border-white/10 bg-card/60 px-5 py-2 backdrop-blur-xl transition ${tourTarget === "topbar" ? "z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mr-4 flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-extrabold tracking-tight",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/pixora-logo.png",
									alt: "Pixora",
									className: "h-6 w-6 rounded"
								}),
								"Pixora ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: "Studio"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/guide",
										"aria-label": "Open user guide",
										className: "ml-1 grid h-5 w-5 place-items-center rounded-full border border-primary/50 text-primary transition hover:bg-primary hover:text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { size: 13 })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "User Guide" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: openQuickTour,
									className: "ml-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary",
									children: "Tour"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative flex h-full cursor-pointer items-center border-r border-border px-3 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
							children: ["File", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute left-0 top-full hidden w-40 flex-col rounded-b-md border border-t-0 border-border bg-card p-1 shadow-xl group-hover:flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onClick: () => newProject(W, H),
										icon: FilePlusCorner,
										label: "New Project"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onClick: saveJSON,
										icon: Save,
										label: "Save Project"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
											as: "span",
											icon: FolderOpen,
											label: "Open JSON..."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: ".json",
											className: "hidden",
											onChange: (e) => e.target.files?.[0] && loadJSON(e.target.files[0])
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px w-full bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onClick: () => {
											localStorage.removeItem("pixora-autosave");
											setStatus("Autosave cleared");
										},
										icon: Trash2,
										label: "Clear Autosave"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative flex h-full cursor-pointer items-center border-r border-border px-3 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
							children: ["Export", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute left-0 top-full hidden w-48 flex-col rounded-b-md border border-t-0 border-border bg-card p-1 shadow-xl group-hover:flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1 flex items-center justify-between px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground",
										children: ["Scale", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 1,
											max: 32,
											value: exportScale,
											onChange: (e) => setExportScale(clamp(+e.target.value, 1, 32)),
											className: "w-12 rounded bg-input px-1 text-foreground",
											onClick: (e) => e.stopPropagation()
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onClick: () => exportPNG(exportScale),
										icon: Download,
										label: "Export PNG"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onClick: () => exportSheet(exportScale),
										icon: Download,
										label: "Export Sprite Sheet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onClick: () => exportGIF(),
										icon: Film,
										label: "Export GIF"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onClick: () => exportWebM(exportScale),
										icon: Video,
										label: "Export Video (WebM)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px w-full bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: (e) => {
											e.stopPropagation();
											toggleRecording();
										},
										className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-xs font-medium transition active:scale-95 ${recording ? "bg-destructive text-destructive-foreground animate-pulse" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
										children: [
											recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleStop, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { size: 14 }),
											" ",
											recording ? "Stop Recording" : "Record Canvas"
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 px-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "View"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setShowTimeline(!showTimeline),
									className: `flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium transition active:scale-95 hover:bg-secondary hover:text-foreground ${showTimeline ? "bg-primary/20 text-primary" : "text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { size: 14 }), " Timeline"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Toggle Timeline" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBtn, {
							onClick: undo,
							icon: Undo2,
							label: "Undo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBtn, {
							onClick: redo,
							icon: Redo2,
							label: "Redo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-3",
							children: [
								clipMask && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setClipMask(null),
									className: "animate-pulse flex items-center gap-1 rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80",
									children: "Clear Mask"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setShowFeedback(true),
									className: "group flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 transition-all hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
										size: 14,
										className: "transition-transform group-hover:scale-110"
									}), " Report Issue"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setCmdOpen(true),
									className: "flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground active:scale-95",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { size: 13 }), " Ctrl + K / ⌘K"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-2 hidden items-center gap-3 border-l border-border pl-4 text-[10px] font-bold text-muted-foreground md:flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-foreground/80",
											children: [
												W,
												"x",
												H,
												"px"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "opacity-30",
											children: "•"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											project.frames.length,
											" frame",
											project.frames.length !== 1 ? "s" : ""
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "opacity-30",
											children: "•"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [zoom, "x"] }),
										hoverCoords && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "opacity-30",
											children: "•"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono tabular-nums text-primary",
											children: [
												"X:",
												hoverCoords[0],
												" Y:",
												hoverCoords[1]
											]
										})] })
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: `z-10 flex w-16 flex-col items-center gap-2 border-r border-white/5 bg-black/40 py-4 backdrop-blur-md transition ${tourTarget === "tools" ? "relative z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`,
							children: [TOOLS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setTool(t.id);
										audio.playDraw();
									},
									className: `grid h-10 w-10 place-items-center rounded-xl transition-all duration-200 active:scale-95 ${tool === t.id ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "text-muted-foreground hover:bg-white/10 hover:text-foreground"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { size: 20 })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipContent, {
								side: "right",
								className: "flex items-center gap-2 rounded-lg border-white/10 bg-card/95 backdrop-blur-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: t.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
									className: "rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground",
									children: t.key
								})]
							})] }, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto flex flex-col items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition hover:scale-105",
									title: "Primary Color",
									style: { background: primary },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "color",
										value: primary,
										onChange: (e) => setPrimary(e.target.value),
										className: "absolute inset-0 h-full w-full cursor-pointer opacity-0"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition hover:scale-105",
									title: "Secondary Color",
									style: { background: secondary },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "color",
										value: secondary,
										onChange: (e) => setSecondary(e.target.value),
										className: "absolute inset-0 h-full w-full cursor-pointer opacity-0"
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							ref: mainRef,
							className: `relative flex flex-1 items-center justify-center overflow-auto bg-[#09090b] transition ${tourTarget === "canvas" ? "z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
								ref: canvasRef,
								style: {
									width: canvasW,
									imageRendering: "pixelated",
									touchAction: "none",
									cursor: tool === "move" ? "grab" : tool === "fill" ? "cell" : tool === "pick" ? "copy" : tool === "eraser" ? "pointer" : tool === "select" ? "default" : tool === "wand" ? "help" : "crosshair"
								},
								className: "shadow-2xl ring-1 ring-white/5",
								onPointerDown,
								onPointerMove,
								onPointerUp,
								onPointerLeave: () => {
									panning.current = false;
									moveRef.current = null;
									setHoverCoords(null);
									render();
								},
								onContextMenu: (e) => e.preventDefault()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: `z-10 flex w-[300px] flex-col overflow-y-auto border-l border-white/5 bg-black/40 text-sm backdrop-blur-md transition custom-scrollbar ${tourTarget === "panels" ? "relative z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Canvas",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-1",
											children: [CANVAS_PRESETS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => newProject(s, s),
												className: "rounded-md bg-secondary px-2 py-1 text-xs hover:bg-primary hover:text-primary-foreground",
												children: [s, "²"]
											}, s)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: promptResize,
												className: "rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground",
												children: "Resize..."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: `Zoom ${zoom}px`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 4,
												max: 40,
												value: zoom,
												onChange: (e) => setZoom(+e.target.value),
												className: "w-full accent-[oklch(0.72_0.19_300)]"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: showGrid,
												onClick: () => setShowGrid((v) => !v),
												icon: Grid3x3,
												children: "Grid"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: onionMode > 0,
												onClick: () => setOnionMode((v) => (v + 1) % 3),
												icon: Layers,
												children: onionMode === 0 ? "Onion: Off" : onionMode === 1 ? "Onion: Normal" : "Onion: Pro"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Animation Preview",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center rounded bg-[#09090b] p-2 ring-1 ring-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
											ref: previewCanvasRef,
											className: "shadow-lg"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-col gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between px-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "Animation Tags"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
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
																	to: Math.max(0, p.frames.length - 1)
																});
															});
														}
													});
												},
												className: "text-xs font-medium text-primary hover:text-primary/80",
												children: "+ Add Tag"
											})]
										}), project.tags?.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `flex items-center justify-between rounded px-2 py-1.5 text-xs cursor-pointer transition ${activeTag === t.id ? "bg-primary/20 ring-1 ring-primary" : "bg-secondary/30 hover:bg-secondary/60"}`,
											onClick: () => setActiveTag(activeTag === t.id ? null : t.id),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-2 w-2 rounded-full",
													style: { backgroundColor: t.color }
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: t.name
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 text-[10px] text-muted-foreground",
												onClick: (e) => e.stopPropagation(),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														min: 1,
														max: project.frames.length,
														value: t.from + 1,
														onChange: (e) => mutate((p) => {
															p.tags[i].from = clamp(+e.target.value - 1, 0, p.frames.length - 1);
														}),
														className: "w-8 rounded bg-input px-1 py-0.5 text-center"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "-" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														min: 1,
														max: project.frames.length,
														value: t.to + 1,
														onChange: (e) => mutate((p) => {
															p.tags[i].to = clamp(+e.target.value - 1, 0, p.frames.length - 1);
														}),
														className: "w-8 rounded bg-input px-1 py-0.5 text-center"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => {
															mutate((p) => {
																p.tags.splice(i, 1);
															});
															if (activeTag === t.id) setActiveTag(null);
														},
														className: "ml-1 text-red-400 hover:text-red-300",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 })
													})
												]
											})]
										}, t.id))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Brush",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: `Size ${brushSize}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 1,
												max: 16,
												value: brushSize,
												onChange: (e) => setBrushSize(+e.target.value),
												className: "w-full accent-[oklch(0.72_0.19_300)]"
											})
										}),
										tool === "dither" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: `Dither density ${ditherDensity * 100 | 0}%`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 0,
												max: 1,
												step: .0625,
												value: ditherDensity,
												onChange: (e) => setDitherDensity(+e.target.value),
												className: "w-full accent-[oklch(0.72_0.19_300)]"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: symX,
												onClick: () => setSymX((v) => !v),
												icon: FlipHorizontal2,
												children: "Mirror X"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: symY,
												onClick: () => setSymY((v) => !v),
												icon: FlipVertical2,
												children: "Mirror Y"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: sym4,
												onClick: () => setSym4((v) => !v),
												icon: Grid3x3,
												children: "Sym 4"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
													active: showGrid,
													onClick: () => setShowGrid((v) => !v),
													icon: Grid3x3,
													children: "Grid"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
													active: tilePreview,
													onClick: () => setTilePreview((v) => !v),
													icon: Layers,
													children: "Tile Preview"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
													active: audioEnabled,
													onClick: () => {
														setAudioEnabled((v) => !v);
														audio.toggle(!audioEnabled);
													},
													icon: audioEnabled ? Volume2 : VolumeX,
													children: "Sound"
												})
											]
										})
									]
								}),
								tilePreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Tile Preview",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TilePreview, {
										frame,
										w: W,
										h: H
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Effects (active layer)",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: doFlipH,
												icon: FlipHorizontal2,
												children: "Flip H"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: doFlipV,
												icon: FlipVertical2,
												children: "Flip V"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: doRotate,
												icon: RotateCw,
												children: "Rotate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: doOutline,
												icon: WandSparkles,
												children: "Outline"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: doGrayscale,
												icon: Circle,
												children: "Grayscale"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: doInvert,
												icon: Square,
												children: "Invert"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Hue shift",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => doHueShift(-30),
													className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
													children: "-30°"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => doHueShift(30),
													className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
													children: "+30°"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => doHueShift(180),
													className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
													children: "180°"
												})
											]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Selection",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: selection ? "Region selected — S tool" : "Use the Select (S) tool to mark a region"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: copySelection,
												icon: Copy,
												children: "Copy"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: pasteSelection,
												icon: Grip,
												children: "Paste"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: clearSelection,
												icon: Trash2,
												children: "Clear"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallBtn, {
												onClick: () => setSelection(null),
												icon: SquareDashed,
												children: "Deselect"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Reference",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex w-full items-center justify-center gap-1.5 rounded-md bg-secondary py-1.5 text-xs hover:bg-secondary/70",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { size: 13 }),
												" ",
												refUrl ? "Replace image" : "Load image"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											className: "hidden",
											onChange: (e) => e.target.files?.[0] && loadRef(e.target.files[0])
										})]
									}), refUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: `Opacity ${refOpacity * 100 | 0}%`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 0,
											max: 1,
											step: .05,
											value: refOpacity,
											onChange: (e) => setRefOpacity(+e.target.value),
											className: "w-full accent-[oklch(0.72_0.19_300)]"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
											active: showRef,
											onClick: () => setShowRef((v) => !v),
											icon: Eye,
											children: "Show"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: extractPalette,
											className: "flex-1 rounded-md bg-primary py-1 text-xs font-medium text-primary-foreground",
											children: "Extract palette"
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Palette",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													onChange: (e) => {
														if (e.target.value) loadPreset(e.target.value);
														e.target.value = "";
													},
													defaultValue: "",
													className: "min-w-0 flex-1 rounded-md bg-input px-2 py-1 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Load preset…"
													}), PALETTE_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: p.name,
														children: p.name
													}, p.name))]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: exportPalette,
													title: "Export palette",
													className: "rounded-md bg-secondary px-2 py-1 text-xs hover:bg-secondary/70",
													children: "↓"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													title: "Import palette",
													className: "cursor-pointer rounded-md bg-secondary px-2 py-1 text-xs hover:bg-secondary/70",
													children: ["↑", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														accept: ".json",
														className: "hidden",
														onChange: (e) => e.target.files?.[0] && importPalette(e.target.files[0])
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-8 gap-1",
											children: project.palette.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setPrimary(c);
													setSelPalette(i);
												},
												onContextMenu: (e) => {
													e.preventDefault();
													setSecondary(c);
												},
												title: c,
												className: `aspect-square rounded ring-offset-1 ring-offset-sidebar transition ${selPalette === i ? "ring-2 ring-primary" : "ring-1 ring-black/40"}`,
												style: { background: c }
											}, i))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => mutate((p) => p.palette.push(primary), false),
												className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
												children: "Add current"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => mutate((p) => p.palette.splice(selPalette, 1), false),
												className: "rounded-md bg-secondary px-2 py-1 text-xs hover:bg-destructive hover:text-destructive-foreground",
												children: "Del"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => mutate((p) => p.palette.sort((a, b) => hueOf(a) - hueOf(b)), false),
												className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
												children: "Sort hue"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => mutate((p) => p.palette.sort((a, b) => luminance(a) - luminance(b)), false),
												className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
												children: "Sort lum"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 border-t border-border pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mb-1 text-xs text-muted-foreground",
												children: "Ramp generator"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "color",
														value: rampA,
														onChange: (e) => setRampA(e.target.value),
														className: "h-7 w-7 rounded"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "color",
														value: rampB,
														onChange: (e) => setRampB(e.target.value),
														className: "h-7 w-7 rounded"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														min: 2,
														max: 16,
														value: rampSteps,
														onChange: (e) => setRampSteps(clamp(+e.target.value, 2, 16)),
														className: "w-14 rounded bg-input px-2 py-1 text-xs"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => mutate((p) => {
															p.palette.push(...rampBetween(rampA, rampB, rampSteps));
														}, false),
														className: "flex-1 rounded-md bg-primary py-1 text-xs font-medium text-primary-foreground",
														children: "Add"
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 border-t border-border pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mb-1 text-xs text-muted-foreground",
												children: "Color Harmony (from Primary)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => mutate((p) => {
															const [h, s, l] = hexToHSL(primary);
															p.palette.push(hslToHex(h + 180, s, l));
														}, false),
														className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
														children: "Complement"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => mutate((p) => {
															const [h, s, l] = hexToHSL(primary);
															p.palette.push(hslToHex(h - 30, s, l), hslToHex(h + 30, s, l));
														}, false),
														className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
														children: "Analogous"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => mutate((p) => {
															const [h, s, l] = hexToHSL(primary);
															p.palette.push(hslToHex(h + 120, s, l), hslToHex(h - 120, s, l));
														}, false),
														className: "flex-1 rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
														children: "Triadic"
													})
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Layers",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
													title: "Add",
													onClick: () => mutate((p) => {
														p.frames[frameIndex].layers.unshift(makeLayer(W, H, `Layer ${p.frames[frameIndex].layers.length + 1}`));
														setLayerIndex(0);
													}),
													icon: Plus
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
													title: "Duplicate",
													onClick: () => mutate((p) => {
														const l = p.frames[frameIndex].layers[layerIndex];
														p.frames[frameIndex].layers.splice(layerIndex, 0, {
															...JSON.parse(JSON.stringify(l)),
															id: uid(),
															name: l.name + " copy"
														});
													}),
													icon: Copy
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
													title: "Merge Down",
													onClick: () => mutate((p) => {
														const a = p.frames[frameIndex].layers;
														if (layerIndex < a.length - 1) {
															const upper = a[layerIndex];
															const lower = a[layerIndex + 1];
															for (let i = 0; i < lower.pixels.length; i++) if (upper.pixels[i]) lower.pixels[i] = upper.pixels[i];
															a.splice(layerIndex, 1);
														}
													}),
													icon: Layers
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
													title: "Up",
													onClick: () => mutate((p) => {
														if (layerIndex > 0) {
															const a = p.frames[frameIndex].layers;
															[a[layerIndex - 1], a[layerIndex]] = [a[layerIndex], a[layerIndex - 1]];
															setLayerIndex(layerIndex - 1);
														}
													}),
													icon: ChevronUp
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
													title: "Down",
													onClick: () => mutate((p) => {
														const a = p.frames[frameIndex].layers;
														if (layerIndex < a.length - 1) {
															[a[layerIndex + 1], a[layerIndex]] = [a[layerIndex], a[layerIndex + 1]];
															setLayerIndex(layerIndex + 1);
														}
													}),
													icon: ChevronDown
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
													title: "Delete",
													danger: true,
													onClick: () => mutate((p) => {
														const a = p.frames[frameIndex].layers;
														if (a.length > 1) {
															a.splice(layerIndex, 1);
															setLayerIndex(Math.max(0, layerIndex - 1));
														}
													}),
													icon: Trash2
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													title: "Import Image",
													className: "flex shrink-0 cursor-pointer items-center justify-center rounded p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { size: 15 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														accept: "image/png, image/jpeg",
														className: "hidden",
														onChange: (e) => e.target.files?.[0] && importImageAsLayer(e.target.files[0])
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-col gap-1",
											children: frame.layers.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => setLayerIndex(i),
												className: `flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 ${i === layerIndex ? "bg-primary/20 ring-1 ring-primary" : "bg-secondary/50 hover:bg-secondary"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: (e) => {
														e.stopPropagation();
														mutate((p) => {
															p.frames[frameIndex].layers[i].visible = !l.visible;
														}, false);
													},
													className: "text-muted-foreground",
													children: l.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 15 })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: l.name,
													onChange: (e) => mutate((p) => {
														p.frames[frameIndex].layers[i].name = e.target.value;
													}, false),
													className: "min-w-0 flex-1 bg-transparent text-xs outline-none"
												})]
											}, l.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: `Opacity ${activeLayer.opacity * 100 | 0}%`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 0,
												max: 1,
												step: .05,
												value: activeLayer.opacity,
												onChange: (e) => mutate((p) => {
													p.frames[frameIndex].layers[layerIndex].opacity = +e.target.value;
												}, false),
												className: "w-full accent-[oklch(0.72_0.19_300)]"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: activeLayer.blendMode,
											onChange: (e) => mutate((p) => {
												p.frames[frameIndex].layers[layerIndex].blendMode = e.target.value;
											}, false),
											className: "w-full rounded-md bg-input px-2 py-1 text-xs",
											children: BLEND_MODES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: b,
												children: b
											}, b))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => mutate((p) => {
												p.frames[frameIndex].layers[layerIndex].pixels = makePixels(W, H);
											}),
											className: "rounded-md bg-secondary py-1 text-xs hover:bg-secondary/70",
											children: "Clear layer"
										})
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: `z-20 flex flex-col border-t border-border bg-card transition-all duration-300 ease-in-out ${showTimeline ? "max-h-[300px] opacity-100" : "pointer-events-none max-h-0 overflow-hidden opacity-0"} ${tourTarget === "timeline" ? "relative z-40 ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 px-3 py-2 border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setPlaying((v) => !v),
								className: "grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground",
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 16 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								title: "Add frame",
								onClick: () => mutate((p) => {
									const nf = makeFrame(W, H, p.frames.length + 1);
									nf.layers = JSON.parse(JSON.stringify(p.frames[frameIndex].layers)).map((l) => ({
										...l,
										id: uid()
									}));
									p.frames.splice(frameIndex + 1, 0, nf);
									setFrameIndex(frameIndex + 1);
								}),
								icon: Plus
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								title: "Duplicate frame",
								onClick: () => mutate((p) => {
									const nf = JSON.parse(JSON.stringify(p.frames[frameIndex]));
									nf.id = uid();
									nf.layers.forEach((l) => l.id = uid());
									p.frames.splice(frameIndex + 1, 0, nf);
									setFrameIndex(frameIndex + 1);
								}),
								icon: Copy
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								title: "Delete frame",
								danger: true,
								onClick: () => mutate((p) => {
									if (p.frames.length > 1) {
										p.frames.splice(frameIndex, 1);
										setFrameIndex(Math.max(0, frameIndex - 1));
									}
								}),
								icon: Trash2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-2 text-xs text-muted-foreground",
								children: [status, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowTimeline(false),
									title: "Hide timeline",
									className: "rounded p-1 hover:bg-secondary hover:text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 14 })
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto px-3 pb-3",
						children: project.frames.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrameThumb, {
							frame: f,
							w: W,
							h: H,
							active: i === frameIndex,
							index: i,
							onClick: () => setFrameIndex(i),
							onContextMenu: (e) => {
								e.preventDefault();
								setFrameMenu({
									i,
									x: e.clientX,
									y: e.clientY
								});
							},
							onDurationChange: (d) => mutate((p) => {
								p.frames[i].duration = d;
							}, false)
						}, f.id))
					})]
				}),
				frameMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50",
					onClick: () => setFrameMenu(null),
					onContextMenu: (e) => {
						e.preventDefault();
						setFrameMenu(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute flex w-44 flex-col rounded-md border border-border bg-card p-1 shadow-2xl",
						style: {
							left: Math.min(frameMenu.x, window.innerWidth - 180),
							top: Math.min(frameMenu.y, window.innerHeight - 200)
						},
						onClick: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border mb-1",
								children: ["Frame ", frameMenu.i + 1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Plus,
								label: "Add Empty Frame",
								onClick: () => {
									mutate((p) => {
										const nf = makeFrame(W, H, p.frames.length + 1);
										nf.layers = JSON.parse(JSON.stringify(p.frames[frameMenu.i].layers)).map((l) => ({
											...l,
											id: uid(),
											pixels: makePixels(W, H)
										}));
										p.frames.splice(frameMenu.i + 1, 0, nf);
										setFrameIndex(frameMenu.i + 1);
									});
									setFrameMenu(null);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Copy,
								label: "Duplicate Frame",
								onClick: () => {
									mutate((p) => {
										const nf = JSON.parse(JSON.stringify(p.frames[frameMenu.i]));
										nf.id = uid();
										nf.layers.forEach((l) => l.id = uid());
										p.frames.splice(frameMenu.i + 1, 0, nf);
										setFrameIndex(frameMenu.i + 1);
									});
									setFrameMenu(null);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px w-full bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: ChevronLeft,
								label: "Move Left",
								onClick: () => {
									mutate((p) => {
										if (frameMenu.i > 0) {
											[p.frames[frameMenu.i - 1], p.frames[frameMenu.i]] = [p.frames[frameMenu.i], p.frames[frameMenu.i - 1]];
											setFrameIndex(frameMenu.i - 1);
										}
									});
									setFrameMenu(null);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: ChevronRight,
								label: "Move Right",
								onClick: () => {
									mutate((p) => {
										if (frameMenu.i < p.frames.length - 1) {
											[p.frames[frameMenu.i + 1], p.frames[frameMenu.i]] = [p.frames[frameMenu.i], p.frames[frameMenu.i + 1]];
											setFrameIndex(frameMenu.i + 1);
										}
									});
									setFrameMenu(null);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px w-full bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Trash2,
								label: "Delete Frame",
								onClick: () => {
									mutate((p) => {
										if (p.frames.length > 1) {
											p.frames.splice(frameMenu.i, 1);
											setFrameIndex(Math.max(0, frameMenu.i - 1));
										}
									});
									setFrameMenu(null);
								}
							})
						]
					})
				}),
				!showTimeline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowTimeline(true),
					title: "Show timeline",
					className: "absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border bg-card p-1.5 text-muted-foreground shadow-lg transition hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { size: 16 })
				}),
				cmdOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {
					onClose: () => setCmdOpen(false),
					actions: [
						...TOOLS.map((t) => ({
							label: `Tool: ${t.label}`,
							hint: t.key,
							run: () => setTool(t.id)
						})),
						{
							label: "Toggle grid",
							hint: "G",
							run: () => setShowGrid((v) => !v)
						},
						{
							label: "Toggle tile preview",
							hint: "T",
							run: () => setTilePreview((v) => !v)
						},
						{
							label: "Flip layer horizontal",
							run: doFlipH
						},
						{
							label: "Flip layer vertical",
							run: doFlipV
						},
						{
							label: "Rotate layer 90°",
							run: doRotate
						},
						{
							label: "Outline layer",
							run: doOutline
						},
						{
							label: "Grayscale layer",
							run: doGrayscale
						},
						{
							label: "Invert layer",
							run: doInvert
						},
						{
							label: "Resize project",
							run: promptResize
						},
						{
							label: "Add layer",
							run: () => mutate((p) => {
								p.frames[frameIndex].layers.unshift(makeLayer(W, H, `Layer ${p.frames[frameIndex].layers.length + 1}`));
								setLayerIndex(0);
							})
						},
						{
							label: "Add frame",
							run: () => mutate((p) => {
								const nf = makeFrame(W, H, p.frames.length + 1);
								nf.layers = JSON.parse(JSON.stringify(p.frames[frameIndex].layers)).map((l) => ({
									...l,
									id: uid()
								}));
								p.frames.splice(frameIndex + 1, 0, nf);
								setFrameIndex(frameIndex + 1);
							})
						},
						{
							label: clipMask ? "Clear magic wand mask" : "Magic wand tool",
							run: () => {
								if (clipMask) setClipMask(null);
								else setTool("wand");
							}
						},
						{
							label: "Toggle audio",
							run: () => audio.toggle(!audio.isEnabled())
						},
						{
							label: "Toggle timeline",
							run: () => setShowTimeline((v) => !v)
						},
						{
							label: "Clear autosave",
							run: () => {
								localStorage.removeItem("pixora-autosave");
								setStatus("Autosave cleared");
							}
						},
						{
							label: "Export PNG",
							run: () => exportPNG(exportScale)
						},
						{
							label: "Export sprite sheet",
							run: () => exportSheet(exportScale)
						},
						{
							label: "Export animated GIF",
							run: () => exportGIF()
						},
						{
							label: recording ? "Stop recording" : "Start recording",
							run: toggleRecording
						},
						{
							label: "Save project (JSON)",
							run: saveJSON
						},
						{
							label: "Undo",
							hint: "Ctrl+Z",
							run: undo
						},
						{
							label: "Redo",
							hint: "Ctrl+Y",
							run: redo
						},
						...PALETTE_PRESETS.map((p) => ({
							label: `Palette: ${p.name}`,
							run: () => loadPreset(p.name)
						}))
					]
				}),
				quickTourOpen && !restorePrompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTour, {
					step: activeTourStep,
					stepIndex: quickTourStep,
					totalSteps: QUICK_TOUR_STEPS.length,
					onBack: () => setQuickTourStep((step) => Math.max(0, step - 1)),
					onNext: () => {
						if (quickTourStep === QUICK_TOUR_STEPS.length - 1) finishQuickTour();
						else setQuickTourStep((step) => step + 1);
					},
					onSkip: finishQuickTour
				}),
				showFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackModal, { onClose: () => setShowFeedback(false) }),
				restorePrompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestoreModal, {
					project: restorePrompt,
					onRestore: () => {
						setProject(restorePrompt);
						setRestorePrompt(null);
					},
					onDiscard: () => {
						localStorage.removeItem("pixora-autosave");
						setRestorePrompt(null);
					}
				}),
				showResize && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResizeModal, {
					width: W,
					height: H,
					onClose: () => setShowResize(false),
					onConfirm: handleResize
				}),
				customPrompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptModal, {
					title: customPrompt.title,
					defaultValue: customPrompt.defaultValue,
					placeholder: customPrompt.placeholder,
					onClose: () => setCustomPrompt(null),
					onConfirm: customPrompt.onConfirm
				})
			]
		})
	});
}
function CommandPalette({ actions, onClose }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [sel, setSel] = (0, import_react.useState)(0);
	const filtered = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, []);
	(0, import_react.useEffect)(() => {
		setSel(0);
	}, [q]);
	const runAt = (i) => {
		const a = filtered[i];
		if (a) {
			a.run();
			onClose();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-32",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				value: q,
				onChange: (e) => setQ(e.target.value),
				onKeyDown: (e) => {
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
				},
				placeholder: "Type a command…",
				className: "w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-80 overflow-y-auto p-1",
				children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 py-6 text-center text-xs text-muted-foreground",
					children: "No matches"
				}), filtered.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onMouseEnter: () => setSel(i),
					onClick: () => runAt(i),
					className: `flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${i === sel ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.label }), a.hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: `rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] ${i === sel ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
						children: a.hint
					})]
				}, a.label))]
			})]
		})
	});
}
function QuickTour({ step, stepIndex, totalSteps, onBack, onNext, onSkip }) {
	const isLastStep = stepIndex === totalSteps - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 z-30 bg-black/45 backdrop-blur-[2px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "quick-tour-title",
		className: "fixed bottom-4 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 rounded-xl border border-primary/30 bg-card p-4 shadow-[0_0_40px_rgba(168,85,247,0.25)] sm:bottom-6 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground",
						children: stepIndex + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground",
						children: "Quick Tour"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "quick-tour-title",
						className: "text-base font-black text-foreground",
						children: step.title
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onSkip,
					className: "rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground",
					children: "Skip"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-6 text-muted-foreground",
				children: step.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs leading-5 text-foreground",
				children: step.hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1.5",
					"aria-label": "Tour progress",
					children: Array.from({ length: totalSteps }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 rounded-full transition-all ${index === stepIndex ? "w-7 bg-primary" : "w-1.5 bg-muted"}` }, index))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onBack,
						disabled: stepIndex === 0,
						className: "rounded-md bg-secondary/60 px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
						children: "Back"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onNext,
						className: "rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90",
						children: isLastStep ? "Start Drawing" : "Next"
					})]
				})]
			})
		]
	})] });
}
function FrameThumb({ frame, w, h, active, index, onClick, onContextMenu, onDurationChange }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const c = ref.current;
		const ctx = c.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.drawImage(compositeFrame(frame, w, h), 0, 0, c.width, c.height);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick,
			onContextMenu,
			className: `relative shrink-0 rounded-md p-1 transition-all ${active ? "bg-primary/20 ring-2 ring-primary scale-110 z-10" : "bg-secondary/40 ring-1 ring-border hover:bg-secondary hover:scale-105"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref,
				width: w,
				height: h,
				style: {
					width: 52,
					height: 52,
					imageRendering: "pixelated"
				},
				className: "rounded checkerboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white",
				children: index + 1
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center mt-1 text-[9px] text-muted-foreground bg-input rounded overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "number",
				min: 10,
				max: 5e3,
				value: frame.duration || 120,
				onChange: (e) => onDurationChange(+e.target.value),
				className: "w-9 bg-transparent px-1 py-0.5 text-center outline-none",
				title: "Duration (ms)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pr-1 opacity-70",
				children: "ms"
			})]
		})]
	});
}
function Panel({ title, children, defaultOpen = true }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(defaultOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-white/5 bg-card/30 px-5 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			onClick: () => setIsOpen(!isOpen),
			className: "mb-3 flex cursor-pointer items-center justify-between font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition hover:text-foreground",
			children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
				size: 14,
				className: `transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `flex flex-col gap-2 transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 overflow-hidden opacity-0"}`,
			children
		})]
	});
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: label
		}), children]
	});
}
function Toggle({ active, onClick, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs transition active:scale-95 ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 13 }),
			" ",
			children
		]
	});
}
function IconBtn({ icon: Icon, onClick, title, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick,
			className: `grid h-8 w-8 place-items-center rounded-md bg-secondary text-muted-foreground transition active:scale-95 hover:text-foreground ${danger ? "hover:bg-destructive hover:text-destructive-foreground" : "hover:bg-secondary/70"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: title })] });
}
function TopBtn({ icon: Icon, label, onClick, as }) {
	const cls = "flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-muted-foreground transition active:scale-95 hover:bg-secondary hover:text-foreground";
	if (as === "span") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cls,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 14 }),
			" ",
			label
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: cls,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 14 }),
			" ",
			label
		]
	});
}
function MenuItem({ icon: Icon, label, onClick, as }) {
	const cls = "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs font-medium text-muted-foreground transition active:scale-95 hover:bg-secondary hover:text-foreground";
	if (as === "span") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cls,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 14 }),
			" ",
			label
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: cls,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 14 }),
			" ",
			label
		]
	});
}
function SmallBtn({ icon: Icon, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "flex items-center justify-center gap-1 rounded-md bg-secondary px-2 py-1.5 text-xs text-muted-foreground transition active:scale-95 hover:bg-secondary/70 hover:text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 13 }),
			" ",
			children
		]
	});
}
function TilePreview({ frame, w, h }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const c = ref.current;
		const ctx = c.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, c.width, c.height);
		const tile = compositeFrame(frame, w, h);
		const cell = Math.floor(c.width / 3);
		for (let ty = 0; ty < 3; ty++) for (let tx = 0; tx < 3; tx++) ctx.drawImage(tile, tx * cell, ty * cell, cell, cell);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		width: 180,
		height: 180,
		style: {
			width: "100%",
			imageRendering: "pixelated"
		},
		className: "rounded-md bg-[#22222a]"
	});
}
function PromptModal({ title, defaultValue = "", placeholder = "", onClose, onConfirm }) {
	const [val, setVal] = (0, import_react.useState)(defaultValue);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		ref.current?.focus();
		ref.current?.select();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm border border-border bg-card p-5 shadow-2xl rounded-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-xs font-bold uppercase tracking-wider text-primary",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref,
					type: "text",
					value: val,
					onChange: (e) => setVal(e.target.value),
					placeholder,
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							onConfirm(val);
							onClose();
						} else if (e.key === "Escape") onClose();
					},
					className: "mb-5 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-md bg-secondary/50 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							onConfirm(val);
							onClose();
						},
						className: "rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition",
						children: "OK"
					})]
				})
			]
		})
	});
}
function ResizeModal({ width, height, onClose, onConfirm }) {
	const [w, setW] = (0, import_react.useState)(width);
	const [h, setH] = (0, import_react.useState)(height);
	const [scale, setScale] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xs border border-border bg-card p-5 shadow-2xl rounded-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-xs font-bold uppercase tracking-wider text-primary",
					children: "Resize Project"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[9px] font-bold text-muted-foreground uppercase",
						children: "Width"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 1,
						max: 512,
						value: w,
						onChange: (e) => setW(Math.max(1, +e.target.value)),
						className: "mt-1 w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[9px] font-bold text-muted-foreground uppercase",
						children: "Height"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 1,
						max: 512,
						value: h,
						onChange: (e) => setH(Math.max(1, +e.target.value)),
						className: "mt-1 w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						id: "scale-pixels",
						checked: scale,
						onChange: (e) => setScale(e.target.checked),
						className: "rounded border-border text-primary focus:ring-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "scale-pixels",
						className: "text-xs text-muted-foreground cursor-pointer select-none",
						children: "Scale pixels (Nearest Neighbor)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-md bg-secondary/50 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							onConfirm(w, h, scale);
							onClose();
						},
						className: "rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition",
						children: "Resize"
					})]
				})
			]
		})
	});
}
function FeedbackModal({ onClose }) {
	const [content, setContent] = (0, import_react.useState)("");
	const [images, setImages] = (0, import_react.useState)([""]);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;
		setSubmitting(true);
		const validUrls = images.map((u) => u.trim()).filter((u) => u.startsWith("http"));
		let finalContent = `**[Pixora Studio Feedback]**\n${content}`;
		if (validUrls.length > 0) finalContent += `\n\n**Attachments / Links:**\n` + validUrls.map((u) => `- ${u}`).join("\n");
		const embeds = validUrls.filter((u) => /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(u)).map((url) => ({ image: { url } }));
		const payload = {
			content: finalContent,
			embeds: embeds.length > 0 ? embeds : void 0
		};
		try {
			if ((await fetch("https://discord.com/api/webhooks/1522267130643611651/VRBK-00befRySEUJBtASQGjP2qewNMxDC5NnVZ3b3y357xCqRNevBuePtL-P3FqUDukq", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			})).ok) {
				setSuccess(true);
				setTimeout(onClose, 2e3);
			} else alert("Failed to send feedback.");
		} catch (err) {
			alert("Error sending feedback.");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-card/95 shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-black/5 backdrop-blur-xl",
			children: success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 28 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold text-foreground",
						children: "Thank You!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Your feedback has been sent successfully."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-white/5 bg-white/5 px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 18 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold uppercase tracking-wider text-foreground",
					children: "Report / Feedback"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mb-1.5 block text-xs font-medium text-muted-foreground",
						children: ["Description ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						autoFocus: true,
						required: true,
						value: content,
						onChange: (e) => setContent(e.target.value),
						placeholder: "Describe the issue, feature request, or share your ideas...",
						className: "h-28 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-foreground transition focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Image URLs (Optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setImages([...images, ""]),
							className: "rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold text-primary transition hover:bg-white/10",
							children: "+ Add URL"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar",
						children: images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "url",
								value: img,
								onChange: (e) => {
									const newImgs = [...images];
									newImgs[i] = e.target.value;
									setImages(newImgs);
								},
								placeholder: "https://...",
								className: "flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-foreground transition focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
							}), images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setImages(images.filter((_, idx) => idx !== i)),
								className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 text-muted-foreground transition hover:bg-rose-500/20 hover:text-rose-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
							})]
						}, i))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3 pt-2 border-t border-white/5 mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-lg px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-white/5 hover:text-foreground",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: submitting,
							className: "rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.4)] transition hover:bg-primary/90 disabled:opacity-50",
							children: submitting ? "Sending..." : "Submit Feedback"
						})]
					})
				]
			})] })
		})
	});
}
function RestoreModal({ project, onRestore, onDiscard }) {
	const savedAt = project.savedAt;
	const timeAgo = savedAt ? (() => {
		const diff = Date.now() - new Date(savedAt).getTime();
		const mins = Math.floor(diff / 6e4);
		const hrs = Math.floor(mins / 60);
		const days = Math.floor(hrs / 24);
		if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
		if (hrs > 0) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
		if (mins > 0) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
		return "just now";
	})() : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm border border-yellow-500/30 bg-card p-6 shadow-2xl rounded-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg",
						children: "⚡"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-bold uppercase tracking-wider text-yellow-400",
						children: "Unsaved Session Found"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm text-muted-foreground leading-relaxed",
					children: "You have an unsaved project from your previous session. Continue where you left off?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-xs space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Canvas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-semibold text-foreground",
								children: [
									project.width,
									"×",
									project.height,
									"px"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Frames"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: project.frames.length
							})]
						}),
						timeAgo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Saved"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: timeAgo
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onDiscard,
						className: "rounded-md bg-secondary/50 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-destructive/80 hover:text-white transition",
						children: "Discard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onRestore,
						className: "rounded-md bg-yellow-500 px-4 py-2 text-xs font-semibold text-black hover:bg-yellow-400 transition",
						children: "✦ Restore"
					})]
				})
			]
		})
	});
}
function Studio() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelStudio, {});
}
//#endregion
export { Studio as component };
