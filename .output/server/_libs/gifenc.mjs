//#region node_modules/gifenc/dist/gifenc.esm.js
var X = {
	signature: "GIF",
	version: "89a",
	trailer: 59,
	extensionIntroducer: 33,
	applicationExtensionLabel: 255,
	graphicControlExtensionLabel: 249,
	imageSeparator: 44,
	signatureSize: 3,
	versionSize: 3,
	globalColorTableFlagMask: 128,
	colorResolutionMask: 112,
	sortFlagMask: 8,
	globalColorTableSizeMask: 7,
	applicationIdentifierSize: 8,
	applicationAuthCodeSize: 3,
	disposalMethodMask: 28,
	userInputFlagMask: 2,
	transparentColorFlagMask: 1,
	localColorTableFlagMask: 128,
	interlaceFlagMask: 64,
	idSortFlagMask: 32,
	localColorTableSizeMask: 7
};
function F(t = 256) {
	let e = 0, s = new Uint8Array(t);
	return {
		get buffer() {
			return s.buffer;
		},
		reset() {
			e = 0;
		},
		bytesView() {
			return s.subarray(0, e);
		},
		bytes() {
			return s.slice(0, e);
		},
		writeByte(r) {
			n(e + 1), s[e] = r, e++;
		},
		writeBytes(r, o = 0, i = r.length) {
			n(e + i);
			for (let c = 0; c < i; c++) s[e++] = r[c + o];
		},
		writeBytesView(r, o = 0, i = r.byteLength) {
			n(e + i), s.set(r.subarray(o, o + i), e), e += i;
		}
	};
	function n(r) {
		var o = s.length;
		if (o >= r) return;
		r = Math.max(r, o * (o < 1024 * 1024 ? 2 : 1.125) >>> 0), o != 0 && (r = Math.max(r, 256));
		let c = s;
		s = new Uint8Array(r), e > 0 && s.set(c.subarray(0, e), 0);
	}
}
var O = 12, J = 5003, lt = [
	0,
	1,
	3,
	7,
	15,
	31,
	63,
	127,
	255,
	511,
	1023,
	2047,
	4095,
	8191,
	16383,
	32767,
	65535
];
function at(t, e, s, n, r = F(512), o = /* @__PURE__ */ new Uint8Array(256), i = new Int32Array(J), c = new Int32Array(J)) {
	let x = i.length, a = Math.max(2, n);
	o.fill(0), c.fill(0), i.fill(-1);
	let l = 0, f = 0, g = a + 1, h = g, b = !1, w = h, _ = (1 << w) - 1, u = 1 << g - 1, k = u + 1, B = u + 2, p = 0, A = s[0], z = 0;
	for (let y = x; y < 65536; y *= 2) ++z;
	z = 8 - z, r.writeByte(a), I(u);
	let d = s.length;
	for (let y = 1; y < d; y++) t: {
		let m = s[y], v = (m << O) + A, M = m << z ^ A;
		if (i[M] === v) {
			A = c[M];
			break t;
		}
		let V = M === 0 ? 1 : x - M;
		for (; i[M] >= 0;) if (M -= V, M < 0 && (M += x), i[M] === v) {
			A = c[M];
			break t;
		}
		I(A), A = m, B < 1 << O ? (c[M] = B++, i[M] = v) : (i.fill(-1), B = u + 2, b = !0, I(u));
	}
	return I(A), I(k), r.writeByte(0), r.bytesView();
	function I(y) {
		for (l &= lt[f], f > 0 ? l |= y << f : l = y, f += w; f >= 8;) o[p++] = l & 255, p >= 254 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0), l >>= 8, f -= 8;
		if ((B > _ || b) && (b ? (w = h, _ = (1 << w) - 1, b = !1) : (++w, _ = w === O ? 1 << w : (1 << w) - 1)), y == k) {
			for (; f > 0;) o[p++] = l & 255, p >= 254 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0), l >>= 8, f -= 8;
			p > 0 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0);
		}
	}
}
var $ = at;
function ct(t = {}) {
	let { initialCapacity: e = 4096, auto: s = !0 } = t, n = F(e), r = 5003, o = /* @__PURE__ */ new Uint8Array(256), i = new Int32Array(r), c = new Int32Array(r), x = !1;
	return {
		reset() {
			n.reset(), x = !1;
		},
		finish() {
			n.writeByte(X.trailer);
		},
		bytes() {
			return n.bytes();
		},
		bytesView() {
			return n.bytesView();
		},
		get buffer() {
			return n.buffer;
		},
		get stream() {
			return n;
		},
		writeHeader: a,
		writeFrame(l, f, g, h = {}) {
			let { transparent: b = !1, transparentIndex: w = 0, delay: _ = 0, palette: u = null, repeat: k = 0, colorDepth: B = 8, dispose: p = -1 } = h, A = !1;
			if (s ? x || (A = !0, a(), x = !0) : A = Boolean(h.first), f = Math.max(0, Math.floor(f)), g = Math.max(0, Math.floor(g)), A) {
				if (!u) throw new Error("First frame must include a { palette } option");
				pt(n, f, g, u, B), it(n, u), k >= 0 && dt(n, k);
			}
			let z = Math.round(_ / 10);
			wt(n, p, z, b, w);
			let d = Boolean(u) && !A;
			ht(n, f, g, d ? u : null), d && it(n, u), yt(n, l, f, g, B, o, i, c);
		}
	};
	function a() {
		ft(n, "GIF89a");
	}
}
function wt(t, e, s, n, r) {
	t.writeByte(33), t.writeByte(249), t.writeByte(4), r < 0 && (r = 0, n = !1);
	var o, i;
	n ? (o = 1, i = 2) : (o = 0, i = 0), e >= 0 && (i = e & 7), i <<= 2;
	t.writeByte(i | 0 | o), S(t, s), t.writeByte(r || 0), t.writeByte(0);
}
function pt(t, e, s, n, r = 8) {
	let c = Z(n.length) - 1, x = r - 1 << 4 | 128 | c;
	S(t, e), S(t, s), t.writeBytes([
		x,
		0,
		0
	]);
}
function dt(t, e) {
	t.writeByte(33), t.writeByte(255), t.writeByte(11), ft(t, "NETSCAPE2.0"), t.writeByte(3), t.writeByte(1), S(t, e), t.writeByte(0);
}
function it(t, e) {
	let s = 1 << Z(e.length);
	for (let n = 0; n < s; n++) {
		let r = [
			0,
			0,
			0
		];
		n < e.length && (r = e[n]), t.writeByte(r[0]), t.writeByte(r[1]), t.writeByte(r[2]);
	}
}
function ht(t, e, s, n) {
	if (t.writeByte(44), S(t, 0), S(t, 0), S(t, e), S(t, s), n) {
		let i = Z(n.length) - 1;
		t.writeByte(128 | i);
	} else t.writeByte(0);
}
function yt(t, e, s, n, r = 8, o, i, c) {
	$(s, n, e, r, t, o, i, c);
}
function S(t, e) {
	t.writeByte(e & 255), t.writeByte(e >> 8 & 255);
}
function ft(t, e) {
	for (var s = 0; s < e.length; s++) t.writeByte(e.charCodeAt(s));
}
function Z(t) {
	return Math.max(Math.ceil(Math.log2(t)), 1);
}
var Bt = ct;
//#endregion
export { Bt as t };
