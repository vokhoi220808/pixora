//#region node_modules/.nitro/vite/services/ssr/assets/audio-BHwBOFKX.js
var AudioSystem = class {
	ctx = null;
	enabled = true;
	constructor() {}
	init() {
		if (!this.ctx) {
			const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
			if (!AudioContextCtor) return;
			this.ctx = new AudioContextCtor();
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	toggle(enable) {
		this.enabled = enable;
	}
	isEnabled() {
		return this.enabled;
	}
	playDraw() {
		if (!this.enabled) return;
		this.init();
		if (!this.ctx) return;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "square";
		osc.frequency.setValueAtTime(200 + Math.random() * 50, this.ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + .05);
		gain.gain.setValueAtTime(.015, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .05);
		osc.connect(gain);
		gain.connect(this.ctx.destination);
		osc.start();
		osc.stop(this.ctx.currentTime + .05);
	}
	playClick() {
		if (!this.enabled) return;
		this.init();
		if (!this.ctx) return;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "square";
		osc.frequency.setValueAtTime(600, this.ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + .05);
		gain.gain.setValueAtTime(.03, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .05);
		osc.connect(gain);
		gain.connect(this.ctx.destination);
		osc.start();
		osc.stop(this.ctx.currentTime + .05);
	}
	playSuccess() {
		if (!this.enabled) return;
		this.init();
		if (!this.ctx) return;
		const t = this.ctx.currentTime;
		const osc1 = this.ctx.createOscillator();
		const gain1 = this.ctx.createGain();
		osc1.type = "square";
		osc1.frequency.setValueAtTime(440, t);
		gain1.gain.setValueAtTime(.05, t);
		gain1.gain.exponentialRampToValueAtTime(.001, t + .1);
		osc1.connect(gain1);
		gain1.connect(this.ctx.destination);
		osc1.start(t);
		osc1.stop(t + .1);
		const osc2 = this.ctx.createOscillator();
		const gain2 = this.ctx.createGain();
		osc2.type = "square";
		osc2.frequency.setValueAtTime(659.25, t + .1);
		gain2.gain.setValueAtTime(.05, t + .1);
		gain2.gain.exponentialRampToValueAtTime(.001, t + .3);
		osc2.connect(gain2);
		gain2.connect(this.ctx.destination);
		osc2.start(t + .1);
		osc2.stop(t + .4);
	}
};
var audio = new AudioSystem();
//#endregion
export { audio as t };
