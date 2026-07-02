import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { $ as BookOpen, H as Cloud, P as Film, S as MoveRight, T as Layers, g as Play, n as WandSparkles, t as Zap, u as Sparkles, z as Download } from "../_libs/lucide-react.mjs";
import { t as audio } from "./audio-BHwBOFKX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSLULUOg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pixelFont = { fontFamily: "'Press Start 2P', monospace" };
var landingStars = Array.from({ length: 40 }, (_, i) => {
	const seed = i + 1;
	const rand = (n) => {
		const x = Math.sin(seed * n) * 1e4;
		return x - Math.floor(x);
	};
	const size = rand(31) * 3 + 1;
	return {
		id: i,
		top: rand(11) * 100,
		left: rand(17) * 100,
		size,
		animationDuration: rand(23) * 3 + 2,
		animationDelay: rand(29) * 2,
		opacity: rand(37) * .7 + .3
	};
});
function CosmicTrail() {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let width = window.innerWidth;
		let height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		const resize = () => {
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = width;
			canvas.height = height;
		};
		window.addEventListener("resize", resize);
		const particles = [];
		const colors = [
			"#a855f7",
			"#ec4899",
			"#3b82f6",
			"#eab308",
			"#ffffff"
		];
		const mouse = {
			x: -100,
			y: -100
		};
		const onMouseMove = (e) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
			for (let i = 0; i < 3; i++) particles.push({
				x: mouse.x + (Math.random() - .5) * 20,
				y: mouse.y + (Math.random() - .5) * 20,
				life: 0,
				maxLife: Math.random() * 40 + 20,
				color: colors[Math.floor(Math.random() * colors.length)],
				vx: (Math.random() - .5) * 2,
				vy: (Math.random() - .5) * 2 + 1,
				size: Math.random() > .8 ? 6 : 3
			});
		};
		window.addEventListener("mousemove", onMouseMove);
		let animationId;
		const draw = () => {
			ctx.clearRect(0, 0, width, height);
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.life++;
				p.x += p.vx;
				p.y += p.vy;
				if (p.life >= p.maxLife) {
					particles.splice(i, 1);
					continue;
				}
				ctx.fillStyle = p.color;
				const alpha = 1 - p.life / p.maxLife;
				ctx.globalAlpha = alpha;
				ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
			}
			ctx.globalAlpha = 1;
			animationId = requestAnimationFrame(draw);
		};
		draw();
		return () => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", onMouseMove);
			cancelAnimationFrame(animationId);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "pointer-events-none fixed inset-0 z-50 mix-blend-screen opacity-70"
	});
}
function InteractiveCanvas() {
	const [pixels, setPixels] = (0, import_react.useState)({});
	const [isDrawing, setIsDrawing] = (0, import_react.useState)(false);
	const colors = [
		"#a855f7",
		"#3b82f6",
		"#ec4899",
		"#22c55e",
		"#eab308"
	];
	const [colorIndex, setColorIndex] = (0, import_react.useState)(0);
	const color = colors[colorIndex];
	const handlePointerDown = (e) => {
		setIsDrawing(true);
		e.target.releasePointerCapture(e.pointerId);
		draw(e);
	};
	const handlePointerMove = (e) => {
		if (isDrawing) draw(e);
	};
	const handlePointerUp = () => {
		setIsDrawing(false);
		setColorIndex((c) => (c + 1) % colors.length);
	};
	const draw = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = Math.floor((e.clientX - rect.left) / (rect.width / 32));
		const y = Math.floor((e.clientY - rect.top) / (rect.height / 16));
		if (x >= 0 && x < 32 && y >= 0 && y < 16) setPixels((prev) => ({
			...prev,
			[`${x},${y}`]: color
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 ml-16 cursor-crosshair z-20",
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		onPointerLeave: handlePointerUp,
		style: { touchAction: "none" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-4 left-4 animate-pulse text-[10px] text-white drop-shadow-[0_0_5px_currentColor]",
				style: pixelFont,
				children: "CLICK & DRAW HERE!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-4 right-4 flex gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setPixels({});
						audio.playClick();
					},
					className: "rounded bg-primary px-2 py-1 text-[10px] font-bold text-white hover:bg-primary/80",
					style: pixelFont,
					children: "CLEAR"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full h-full grid grid-cols-[repeat(32,1fr)] grid-rows-[repeat(16,1fr)]",
				children: Array.from({ length: 512 }).map((_, i) => {
					const x = i % 32;
					const y = Math.floor(i / 32);
					const c = pixels[`${x},${y}`];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-r border-b border-white/[0.03]",
						style: { backgroundColor: c || "transparent" }
					}, i);
				})
			})
		]
	});
}
function LandingPage() {
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && "modelContext" in navigator) navigator.modelContext.provideContext({ tools: [{
			name: "open_studio",
			description: "Open the Pixora Pixel Art Studio",
			inputSchema: {
				type: "object",
				properties: {}
			},
			execute: async () => {
				window.location.href = "/studio";
				return { success: true };
			}
		}] });
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-[#02010a] text-slate-200 selection:bg-purple-500/50 overflow-x-clip font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CosmicTrail, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#02010a]/80 to-[#02010a]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] animate-pulse" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px] animate-pulse",
				style: { animationDelay: "2s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-0 overflow-hidden pointer-events-none",
				children: landingStars.map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bg-white rounded-full animate-ping",
					style: {
						top: `${star.top}%`,
						left: `${star.left}%`,
						width: `${star.size}px`,
						height: `${star.size}px`,
						animationDuration: `${star.animationDuration}s`,
						animationDelay: `${star.animationDelay}s`,
						opacity: star.opacity
					}
				}, star.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "fixed top-0 w-full z-40 flex items-center justify-between border-b border-white/5 bg-[#02010a]/60 px-6 py-4 backdrop-blur-xl transition-all duration-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-cyan-500 blur-lg opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/pixora-logo.png",
							alt: "Pixora",
							className: "relative h-10 w-10 border border-white/10 rounded-xl pixelated shadow-xl",
							style: { imageRendering: "pixelated" }
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-sm",
						style: pixelFont,
						children: "PIXORA"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/studio",
						className: "group flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
						style: pixelFont,
						children: ["START ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveRight, {
							size: 14,
							className: "transition-transform group-hover:translate-x-1 text-cyan-400"
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 flex flex-col items-center w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "flex flex-col items-center justify-center px-4 pt-32 sm:pt-40 pb-20 overflow-hidden w-full max-w-7xl mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both flex flex-col items-center w-full text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-8 flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-[10px] font-bold text-purple-300 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]",
									style: pixelFont,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										size: 12,
										className: "text-pink-400 animate-pulse"
									}), " Beta Verison v5.1"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "max-w-4xl text-5xl sm:text-6xl lg:text-8xl leading-tight text-white drop-shadow-lg",
									style: pixelFont,
									children: [
										"CRAFT",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500",
											children: "PIXELS."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"BUILD",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500",
											children: "WORLDS."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-8 max-w-2xl text-base sm:text-xl text-slate-400 leading-relaxed font-medium",
									children: "Experience a blazingly fast, privacy-first, web-based Pixel Art Studio. Packed with professional tools, smart dithering, and seamless animation workflows."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-10 flex flex-wrap justify-center gap-4 relative z-20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/studio",
										onClick: () => audio.playClick(),
										className: "group relative flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[2px] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95",
										style: pixelFont,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex h-full w-full items-center gap-3 rounded-xl bg-[#02010a]/50 px-8 py-4 backdrop-blur-md transition-colors group-hover:bg-transparent",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
													size: 18,
													className: "fill-white"
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs",
													children: "LAUNCH STUDIO"
												})
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/guide",
										onClick: () => audio.playClick(),
										className: "group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-xs font-bold text-slate-300 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white active:scale-95",
										style: pixelFont,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 18 }), " USER GUIDE"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-20 w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both perspective-[1000px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 bg-gradient-to-b from-cyan-500/20 via-purple-500/10 to-transparent blur-2xl rounded-[2rem]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative rounded-2xl border border-white/10 bg-[#0a0a10]/80 p-2 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-x-[5deg] hover:rotate-x-0 transition-transform duration-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40 rounded-t-xl",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-rose-500 border border-white/10" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-amber-500 border border-white/10" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-emerald-500 border border-white/10" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mx-auto flex items-center gap-2 text-[10px] font-mono text-slate-500",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 12 }), " TRY DRAWING BELOW"]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative h-[300px] sm:h-[400px] overflow-hidden rounded-b-xl bg-[#02010a]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveCanvas, {})]
										})]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "w-full max-w-7xl px-6 py-24 relative z-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-16 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-sm",
								style: pixelFont,
								children: "COSMIC POWER."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-slate-400 max-w-2xl mx-auto",
								children: "Everything you need to create stunning pixel art and sprite animations directly in your browser."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 auto-rows-fr",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative col-span-1 md:col-span-2 row-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.04] hover:border-white/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px] transition-all group-hover:bg-cyan-500/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 flex h-full flex-col justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "mb-6 h-12 w-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mb-3 text-xl text-white font-bold tracking-wide",
												children: "Pro Onion Skinning"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-400 leading-relaxed text-sm max-w-md",
												children: "Tinted onion skinning with distinct colors for past (red) and future (green) frames. Time your animations perfectly."
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative col-span-1 row-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.04] hover:border-white/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/10 blur-[60px] transition-all group-hover:bg-purple-500/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 flex h-full flex-col justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "mb-6 h-10 w-10 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mb-3 text-lg text-white font-bold tracking-wide",
												children: "Live Preview"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-400 leading-relaxed text-sm",
												children: "A dedicated panel loops your animation in real-time as you draw."
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative col-span-1 row-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.04] hover:border-white/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-pink-500/10 blur-[60px] transition-all group-hover:bg-pink-500/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 flex h-full flex-col justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "mb-6 h-10 w-10 text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mb-3 text-lg text-white font-bold tracking-wide",
												children: "Smart Tools & Wand"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-400 leading-relaxed text-sm",
												children: "Dithering, symmetry, hue shifting, and intelligent Magic Wand masking."
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative col-span-1 row-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.04] hover:border-white/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/10 blur-[60px] transition-all group-hover:bg-green-500/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 flex h-full flex-col justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mb-6 h-10 w-10 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mb-3 text-lg text-white font-bold tracking-wide",
												children: "Pro Export"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-400 leading-relaxed text-sm",
												children: "Export Sprite Sheets, GIFs, and smooth WebM Video."
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative col-span-1 row-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.04] hover:border-white/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-yellow-500/10 blur-[60px] transition-all group-hover:bg-yellow-500/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 flex h-full flex-col items-center justify-center text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "mb-4 h-10 w-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mb-2 text-lg text-white font-bold tracking-wide",
												children: "Cloud-like Autosave"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-400 text-xs px-2",
												children: "Projects automatically save to persistent browser storage."
											})
										]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "w-full relative z-20 my-24 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900/20 to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-20 text-center border-y border-white/5 backdrop-blur-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mb-6 h-16 w-16 text-cyan-400 fill-cyan-400/20 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500",
									style: pixelFont,
									children: "BLAZING FAST. FREE."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed",
									children: "Pixora runs entirely in your browser using standard HTML5 Canvas. Your files remain local, your privacy is respected, and the performance is desktop-class."
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex w-full flex-col items-center justify-center px-6 py-20 mb-20 text-center relative z-20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group mb-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-8 bg-cyan-500 opacity-20 blur-2xl transition-all duration-700 group-hover:opacity-40 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/pixora-logo.png",
									alt: "Pixora",
									className: "relative h-20 w-20 pixelated drop-shadow-xl",
									style: { imageRendering: "pixelated" }
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl sm:text-3xl text-white",
								style: pixelFont,
								children: "READY TO CREATE?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/studio",
								onClick: () => audio.playClick(),
								className: "mt-10 group flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 text-xs font-bold text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(34,211,238,0.5)] active:scale-95",
								style: pixelFont,
								children: ["START NOW ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveRight, {
									size: 18,
									className: "transition-transform group-hover:translate-x-1"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "relative z-20 border-t border-white/5 bg-[#02010a]/90 py-12 px-6 text-center backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/pixora-logo.png",
							alt: "Logo",
							className: "w-6 h-6 pixelated",
							style: { imageRendering: "pixelated" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold tracking-widest text-white/80",
							style: pixelFont,
							children: "PIXORA"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6 text-sm font-medium text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/guide",
							className: "hover:text-cyan-400 transition-colors",
							children: "Documentation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://github.com/vokhoi220808/pixora",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "hover:text-cyan-400 transition-colors",
							children: "GitHub"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-5xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									size: 12,
									className: "text-purple-400"
								}),
								" Made with ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-500 mx-0.5",
									children: "♥"
								}),
								" for Pixel Artists"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center max-w-md leading-relaxed",
							children: "This product is generated by AI. By using it, you assume all risks. We bear no responsibility."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono tracking-wider",
							children: "© 2026 PIXORA STUDIO V5.1."
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { LandingPage as component };
