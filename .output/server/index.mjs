globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/auth.md": {
		"type": "text/markdown; charset=utf-8",
		"etag": "\"111-xpJTdbRPoJIJhOWD3tgjNqETqmo\"",
		"mtime": "2026-07-02T17:20:08.956Z",
		"size": 273,
		"path": "../public/auth.md"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-02T10:21:25.000Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"190-BaSxfgNmaxpM+p9BnMzf1k7tKEQ\"",
		"mtime": "2026-07-02T17:19:35.636Z",
		"size": 400,
		"path": "../public/robots.txt"
	},
	"/.well-known/api-catalog": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"19e-mus6q5w5GQQepP6n0NJ5uwCVxFk\"",
		"mtime": "2026-07-02T17:19:49.653Z",
		"size": 414,
		"path": "../public/.well-known/api-catalog"
	},
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"276-8I3+SkZ9aLy9QBynD30sjWz58ss\"",
		"mtime": "2026-07-02T17:16:37.513Z",
		"size": 630,
		"path": "../public/sitemap.xml"
	},
	"/.well-known/oauth-authorization-server": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"21a-STXw6Ob1xh61REpdp9FcXFsrSb4\"",
		"mtime": "2026-07-02T17:19:57.683Z",
		"size": 538,
		"path": "../public/.well-known/oauth-authorization-server"
	},
	"/assets/audio-DPrhiYto.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98b-eJw5NkMcHo7okXy4bahsd34zYiY\"",
		"mtime": "2026-07-02T17:20:57.183Z",
		"size": 2443,
		"path": "../public/assets/audio-DPrhiYto.js"
	},
	"/assets/guide-DDxu1YiQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c8b2-j3iFDn8FldxqYbpOVDjhoHyRQVQ\"",
		"mtime": "2026-07-02T17:20:57.183Z",
		"size": 51378,
		"path": "../public/assets/guide-DDxu1YiQ.js"
	},
	"/.well-known/oauth-protected-resource": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"b3-SsM/CCSFMjU7ZadTDMcoFOWYnhc\"",
		"mtime": "2026-07-02T17:20:03.070Z",
		"size": 179,
		"path": "../public/.well-known/oauth-protected-resource"
	},
	"/assets/routes-Da0NDg38.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4772-2UnvCCrAletagYkgauJRjtCjZe4\"",
		"mtime": "2026-07-02T17:20:57.193Z",
		"size": 18290,
		"path": "../public/assets/routes-Da0NDg38.js"
	},
	"/assets/index-Bj8TX3JG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"543eb-hsN/BFaRt0Xz2hoBNctAXIWDwRw\"",
		"mtime": "2026-07-02T17:20:57.182Z",
		"size": 345067,
		"path": "../public/assets/index-Bj8TX3JG.js"
	},
	"/assets/layers-EvZeWreP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"81b-Cq3zTNdWpXt+sYrLhBAcqd+F4KE\"",
		"mtime": "2026-07-02T17:20:57.192Z",
		"size": 2075,
		"path": "../public/assets/layers-EvZeWreP.js"
	},
	"/assets/save-BK9TiA-F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a6-3drPTQ1T4VP1hW2Fra8NdhSqwsI\"",
		"mtime": "2026-07-02T17:20:57.193Z",
		"size": 934,
		"path": "../public/assets/save-BK9TiA-F.js"
	},
	"/assets/studio-Brh3LPCG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27fe7-X9c/RqwzR0QZhsEDphljj3TqK/c\"",
		"mtime": "2026-07-02T17:20:57.194Z",
		"size": 163815,
		"path": "../public/assets/studio-Brh3LPCG.js"
	},
	"/.well-known/agent-skills/index.json": {
		"type": "application/json",
		"etag": "\"143-SWC33VT/4RFl877iIEe38PtSzIQ\"",
		"mtime": "2026-07-02T17:20:21.936Z",
		"size": 323,
		"path": "../public/.well-known/agent-skills/index.json"
	},
	"/assets/zap-Du_aBSvg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38d-ef2xOiHKIbdLr8Fp+2etMhJ6sS4\"",
		"mtime": "2026-07-02T17:20:57.194Z",
		"size": 909,
		"path": "../public/assets/zap-Du_aBSvg.js"
	},
	"/assets/styles-zenhZWPa.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1e77a-YGhKcIZlB2xhPGj5gTAvaMlsRLg\"",
		"mtime": "2026-07-02T17:20:57.195Z",
		"size": 124794,
		"path": "../public/assets/styles-zenhZWPa.css"
	},
	"/.well-known/mcp/server-card.json": {
		"type": "application/json",
		"etag": "\"e5-0FHrSSN/Tdp7zmw9quuLPSX24TU\"",
		"mtime": "2026-07-02T17:20:15.992Z",
		"size": 229,
		"path": "../public/.well-known/mcp/server-card.json"
	},
	"/pixora-logo.png": {
		"type": "image/png",
		"etag": "\"9dd2d-xxNfr1EBZXsq6yySZu9utI/XVUQ\"",
		"mtime": "2026-07-02T12:41:14.284Z",
		"size": 646445,
		"path": "../public/pixora-logo.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_vdc7dM = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_vdc7dM
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
