        // Start Yearly Effects
        const FX = (() => {
            const loaded = new Map();
            const active = new Map();

            const CONFETTI_SRC = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js";
            const FIREWORKS_SRC = "https://cdn.jsdelivr.net/npm/fireworks-js@2.10.7/dist/index.umd.js";
            const TSPARTICLES_SRC = "https://cdn.jsdelivr.net/npm/tsparticles@3.9.1/tsparticles.bundle.min.js";

            const prefersReducedMotion = () =>
                window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const validISODate = (v) => {
                if (typeof v !== "string") return false;
                if (v.length !== 10) return false;
                if (v[4] !== "-" || v[7] !== "-") return false;
                const d = new Date(v + "T12:00:00");
                return !isNaN(d.getTime());
            };

            const loadScriptOnce = (src) => {
                if (loaded.has(src)) return loaded.get(src);
                const p = new Promise((resolve, reject) => {
                    const s = document.createElement("script");
                    s.src = src;
                    s.async = true;
                    s.onload = resolve;
                    s.onerror = () => reject(new Error("Failed to load: " + src));
                    document.head.appendChild(s);
                });
                loaded.set(src, p);
                return p;
            };

            const readFxOverride = () => {
                try {
                    const on = localStorage.getItem("mc_fx_override_on") === "1";
                    const date = localStorage.getItem("mc_fx_override_date") || "";
                    return { on, date };
                } catch {
                    return { on: false, date: "" };
                }
            };

            const getNow = () => {
                try {
                    const q = new URLSearchParams(location.search).get("date");
                    if (validISODate(q)) {
                        const d = new Date(q + "T12:00:00");
                        if (!isNaN(d.getTime())) return d;
                    }
                } catch { }

                const o = readFxOverride();
                if (o.on && o.date) {
                    const d = new Date(o.date + "T12:00:00");
                    if (!isNaN(d.getTime())) return d;
                }
                return new Date();
            };

            const inAnnualRange = (now, startMD, endMD) => {
                const m = now.getMonth() + 1;
                const d = now.getDate();

                const a = startMD.m * 100 + startMD.d;
                const b = endMD.m * 100 + endMD.d;
                const x = m * 100 + d;

                if (a <= b) return x >= a && x <= b;
                return x >= a || x <= b;
            };

            const isAnnualDay = (now, md) => (now.getMonth() + 1) === md.m && now.getDate() === md.d;

            const nthWeekdayOfMonth = (now, month, weekday, n) => {
                if ((now.getMonth() + 1) !== month) return false;
                const y = now.getFullYear();
                const first = new Date(y, month - 1, 1);
                const firstWeekday = first.getDay();
                const offset = (weekday - firstWeekday + 7) % 7;
                const day = 1 + offset + (n - 1) * 7;
                return now.getDate() === day;
            };

            const lastWeekdayOfMonth = (now, month, weekday) => {
                if ((now.getMonth() + 1) !== month) return false;
                const y = now.getFullYear();
                const last = new Date(y, month, 0);
                const lastWeekday = last.getDay();
                const offset = (lastWeekday - weekday + 7) % 7;
                const day = last.getDate() - offset;
                return now.getDate() === day;
            };

            const clearEl = (id) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.innerHTML = "";
            };

            const stopParticles = async () => {
                try {
                    if (window.tsParticles?.dom) {
                        const all = window.tsParticles.dom();
                        for (const inst of all) {
                            if (inst?.id === "fxParticles") {
                                try { inst.destroy?.(); } catch { }
                            }
                        }
                    }
                } catch { }
                clearEl("fxParticles");
            };

            const stopVanta = (state) => {
                try { state?.vanta?.destroy?.(); } catch { }
                const el = document.getElementById("fxVanta");
                if (el) el.style.cssText = "";
            };

            const stopFireworks = (state) => {
                try { state?.fw?.stop?.(); } catch { }
                try { state?.fw?.clear?.(); } catch { }
                try { state?.fw?.destroy?.(); } catch { }
                try { state?.fw?.dispose?.(); } catch { }
                clearEl("fxFireworks");
            };

            const getThemePalette = () => {
                const cs = window.getComputedStyle(document.documentElement);
                const keys = ["--accent", "--violet", "--gold", "--red", "--plum"];
                const vals = keys.map((k) => cs.getPropertyValue(k).trim()).filter(Boolean);
                return vals.length ? vals : ["#0088b1", "#7f5e7c", "#ae895c", "#e22428"];
            };

            const confettiState = { conf: null, cleanup: null };

            const ensureConfetti = async () => {
                if (confettiState.conf) return confettiState;

                const canvas = document.getElementById("fxConfetti");
                if (!canvas) return confettiState;

                const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
                const resize = () => {
                    canvas.width = Math.floor(canvas.clientWidth * dpr);
                    canvas.height = Math.floor(canvas.clientHeight * dpr);
                };
                resize();
                window.addEventListener("resize", resize, { passive: true });

                await loadScriptOnce(CONFETTI_SRC);
                const conf = window.confetti?.create?.(canvas, { resize: true, useWorker: true });
                confettiState.conf = conf || null;
                confettiState.cleanup = () => window.removeEventListener("resize", resize);
                return confettiState;
            };

            const mountSnow = async ({ wind = 0.55, flakes = 160 } = {}) => {
                await loadScriptOnce(TSPARTICLES_SRC);

                const el = document.getElementById("fxParticles");
                if (!el || !window.tsParticles?.load) return null;
                el.style.width = "100%";
                el.style.height = "100%";

                // Clean any previous instance mounted on the same element
                try {
                    const existing = window.tsParticles.domItem?.("fxParticles");
                    existing?.destroy?.();
                } catch { }

                const dir =
                    wind > 0.18 ? "bottom-right" :
                        wind < -0.18 ? "bottom-left" :
                            "bottom";

                const speedMin = 0.6 + Math.max(0, Math.abs(wind)) * 0.6;
                const speedMax = 1.6 + Math.max(0, Math.abs(wind)) * 1.2;

                const opts = {
                    fullScreen: { enable: false },
                    background: { color: { value: "transparent" } },
                    fpsLimit: 60,
                    detectRetina: true,
                    particles: {
                        number: { value: flakes, density: { enable: true, area: 900 } },
                        color: { value: ["#ffffff", "#e6f6ff"] },
                        shape: { type: "circle" },
                        opacity: { value: { min: 0.55, max: 0.95 } },
                        size: { value: { min: 1.5, max: 4 } },
                        move: {
                            enable: true,
                            direction: dir,
                            random: true,
                            straight: false,
                            speed: { min: speedMin, max: speedMax },
                            outModes: { default: "out" }
                        }
                    },
                    interactivity: {
                        events: {
                            onHover: { enable: false },
                            onClick: { enable: false }
                        }
                    }
                };
                let container = null;
                try {
                    container = await window.tsParticles.load({ id: "fxParticles", options: opts });
                } catch {
                    try { container = await window.tsParticles.load("fxParticles", opts); } catch { }
                }

                return container;
            };


            const mountFog = async (state) => {
                await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js");
                await loadScriptOnce("https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.fog.min.js");

                const el = document.getElementById("fxVanta");
                if (!el || !window.VANTA?.FOG) return null;

                state.vanta = window.VANTA.FOG({
                    el,
                    mouseControls: false,
                    touchControls: false,
                    gyroControls: false,
                    highlightColor: 0x2a8aa0,
                    midtoneColor: 0x6b4a78,
                    lowlightColor: 0x1a1427,
                    baseColor: 0x0c0b14,
                    blurFactor: 0.6,
                    speed: 0.8,
                    zoom: 0.9
                });

                return state.vanta;
            };

            const mountFireworks = async () => {
                const el = document.getElementById("fxFireworks");
                if (!el) return null;

                await loadScriptOnce("https://cdn.jsdelivr.net/npm/fireworks-js@latest/dist/fireworks.js");

                const FireworksCtor = window.Fireworks;
                if (typeof FireworksCtor !== "function") return null;

                const fw = new FireworksCtor(el, {
                    autoresize: true,
                    opacity: 0.85,
                    acceleration: 1.02,
                    friction: 0.98,
                    gravity: 1.2,
                    particles: 90,
                    traceLength: 2.8,
                    traceSpeed: 6,
                    explosion: 6,
                    intensity: 26,
                    sound: { enabled: false }
                });

                fw.start();

                return async () => {
                    try { fw.stop(); } catch { }
                    el.innerHTML = "";
                };
            };

            const mountRootClass = (cls) => {
                document.documentElement.classList.add(cls);
                return async () => document.documentElement.classList.remove(cls);
            };

            const EFFECTS = [
                {
                    id: "xmas_snow",
                    title: "Winter / Christmas snow",
                    kind: "JS",
                    uses: "tsParticles",
                    whenText: "Dec 10 - Jan 7",
                    desc: "Snowfall overlay.",
                    when: (now) => inAnnualRange(now, { m: 12, d: 10 }, { m: 1, d: 7 }),
                    mount: async () => {
                        await mountSnow();
                        return async () => { await stopParticles(); };
                    }
                },
                {
                    id: "newyear_fireworks",
                    title: "New Year fireworks",
                    kind: "JS",
                    uses: "fireworks-js + canvas-confetti",
                    whenText: "Dec 31 - Jan 1",
                    desc: "Animated fireworks in the background plus a few confetti bursts.",
                    when: (now) => inAnnualRange(now, { m: 12, d: 31 }, { m: 1, d: 1 }),
                    mount: async (state) => {
                        await mountFireworks(state, "high");
                        const c = await ensureConfetti();
                        if (c?.conf) {
                            const colors = getThemePalette();
                            const burst = () => c.conf({
                                particleCount: 160,
                                spread: 80,
                                startVelocity: 55,
                                ticks: 180,
                                origin: { y: 0.7 },
                                colors
                            });
                            burst();
                            setTimeout(burst, 450);
                            setTimeout(burst, 900);
                        }
                        return async () => { stopFireworks(state); };
                    }
                },
                {
                    id: "halloween_fog",
                    title: "Halloween fog",
                    kind: "JS",
                    uses: "Vanta.js (fog) + three.js",
                    whenText: "Oct 20 - Nov 2",
                    desc: "Slow moving fog layer behind the content.",
                    when: (now) => inAnnualRange(now, { m: 10, d: 20 }, { m: 11, d: 2 }),
                    mount: async (state) => {
                        await mountFog(state);
                        return async () => { stopVanta(state); };
                    }
                },
                {
                    id: "pride_sparkle",
                    title: "Pride month sparkle",
                    kind: "JS",
                    uses: "canvas-confetti",
                    whenText: "Jun 1 - Jun 30",
                    desc: "Small, occasional sparkles near the top edge.",
                    when: (now) => inAnnualRange(now, { m: 6, d: 1 }, { m: 6, d: 30 }),
                    mount: async () => {
                        const c = await ensureConfetti();
                        if (!c?.conf) return async () => { };

                        let on = true;
                        const colors = getThemePalette();
                        const tick = () => {
                            if (!on) return;
                            c.conf({
                                particleCount: 14,
                                spread: 120,
                                startVelocity: 24,
                                ticks: 140,
                                origin: { x: Math.random(), y: 0.18 + Math.random() * 0.22 },
                                colors
                            });
                            setTimeout(tick, 260);
                        };
                        tick();

                        return async () => { on = false; };
                    }
                },
                {
                    id: "sant_jordi",
                    title: "Sant Jordi (Catalonia)",
                    kind: "JS",
                    uses: "canvas-confetti",
                    whenText: "Apr 23",
                    desc: "A few rose-like bursts.",
                    when: (now) => isAnnualDay(now, { m: 4, d: 23 }),
                    mount: async () => {
                        const c = await ensureConfetti();
                        if (!c?.conf) return async () => { };

                        const colors = getThemePalette();
                        c.conf({ particleCount: 120, spread: 70, startVelocity: 45, ticks: 160, origin: { x: 0.25, y: 0.62 }, colors });
                        c.conf({ particleCount: 120, spread: 70, startVelocity: 45, ticks: 160, origin: { x: 0.75, y: 0.62 }, colors });
                        return async () => { };
                    }
                },
                {
                    id: "india_republic",
                    title: "India: Republic Day",
                    kind: "JS",
                    uses: "canvas-confetti",
                    whenText: "Jan 26",
                    desc: "Short celebratory bursts.",
                    when: (now) => isAnnualDay(now, { m: 1, d: 26 }),
                    mount: async () => {
                        const c = await ensureConfetti();
                        if (!c?.conf) return async () => { };
                        const colors = getThemePalette();
                        c.conf({ particleCount: 160, spread: 90, startVelocity: 52, ticks: 180, origin: { y: 0.65 }, colors });
                        return async () => { };
                    }
                },
                {
                    id: "india_independence",
                    title: "India: Independence Day",
                    kind: "JS",
                    uses: "canvas-confetti",
                    whenText: "Aug 15",
                    desc: "Short celebratory bursts.",
                    when: (now) => isAnnualDay(now, { m: 8, d: 15 }),
                    mount: async () => {
                        const c = await ensureConfetti();
                        if (!c?.conf) return async () => { };
                        const colors = getThemePalette();
                        c.conf({ particleCount: 170, spread: 95, startVelocity: 54, ticks: 190, origin: { y: 0.66 }, colors });
                        return async () => { };
                    }
                },
                {
                    id: "usa_july4",
                    title: "US: Independence Day",
                    kind: "JS",
                    uses: "fireworks-js",
                    whenText: "Jul 4",
                    desc: "Fireworks in the background.",
                    when: (now) => isAnnualDay(now, { m: 7, d: 4 }),
                    mount: async (state) => {
                        await mountFireworks(state, "high");
                        return async () => { stopFireworks(state); };
                    }
                },
                {
                    id: "thanksgiving",
                    title: "US: Thanksgiving",
                    kind: "JS",
                    uses: "canvas-confetti",
                    whenText: "4th Thu of Nov",
                    desc: "A subtle celebratory burst.",
                    when: (now) => nthWeekdayOfMonth(now, 11, 4, 4),
                    mount: async () => {
                        const c = await ensureConfetti();
                        if (!c?.conf) return async () => { };
                        const colors = getThemePalette();
                        c.conf({ particleCount: 120, spread: 80, startVelocity: 40, ticks: 160, origin: { y: 0.7 }, colors });
                        return async () => { };
                    }
                },
                {
                    id: "europe_day",
                    title: "Europe Day",
                    kind: "CSS",
                    uses: "CSS only",
                    whenText: "May 9",
                    desc: "Slightly richer background glow (no JS).",
                    when: (now) => isAnnualDay(now, { m: 5, d: 9 }),
                    mount: async () => mountRootClass("fx--europeDay")
                },
                {
                    id: "spring_equinox",
                    title: "Spring week",
                    kind: "CSS",
                    uses: "CSS only",
                    whenText: "Mar 18 - Mar 25",
                    desc: "A small boost in saturation/contrast.",
                    when: (now) => inAnnualRange(now, { m: 3, d: 18 }, { m: 3, d: 25 }),
                    mount: async () => mountRootClass("fx--springGlow")
                },
                {
                    id: "memorial_day",
                    title: "US: Memorial Day",
                    kind: "JS",
                    uses: "canvas-confetti",
                    whenText: "Last Mon of May",
                    desc: "A quiet burst.",
                    when: (now) => lastWeekdayOfMonth(now, 5, 1),
                    mount: async () => {
                        const c = await ensureConfetti();
                        if (!c?.conf) return async () => { };
                        const colors = getThemePalette();
                        c.conf({ particleCount: 100, spread: 70, startVelocity: 36, ticks: 150, origin: { y: 0.74 }, colors });
                        return async () => { };
                    }
                }
            ];

            const renderUi = (now) => {
                const activeIds = new Set(active.keys());

                const elDate = document.getElementById("fxDateLabel");
                if (elDate) {
                    const y = now.getFullYear();
                    const m = String(now.getMonth() + 1).padStart(2, "0");
                    const d = String(now.getDate()).padStart(2, "0");
                    elDate.textContent = `${y}-${m}-${d}`;
                }

                const elActive = document.getElementById("fxActiveLabel");
                if (elActive) {
                    const titles = EFFECTS.filter((e) => activeIds.has(e.id)).map((e) => e.title);
                    elActive.textContent = titles.length ? titles.join(", ") : "None";
                }

                const list = document.getElementById("fxCatalog");
                if (!list) return;

                list.textContent = "";
                for (const e of EFFECTS) {
                    const li = document.createElement("li");
                    li.className = "fxItem";
                    li.dataset.active = activeIds.has(e.id) ? "true" : "false";

                    const meta = document.createElement("div");
                    meta.className = "meta";

                    const titleRow = document.createElement("div");
                    titleRow.className = "titleRow";

                    const title = document.createElement("strong");
                    title.textContent = e.title;

                    const b1 = document.createElement("span");
                    b1.className = "fxBadge";
                    b1.textContent = e.kind;

                    const b2 = document.createElement("span");
                    b2.className = "fxBadge";
                    b2.textContent = e.uses;

                    titleRow.appendChild(title);
                    titleRow.appendChild(b1);
                    titleRow.appendChild(b2);

                    const when = document.createElement("div");
                    when.className = "when";
                    when.textContent = e.whenText;

                    const desc = document.createElement("p");
                    desc.className = "desc";
                    desc.textContent = e.desc;

                    meta.appendChild(titleRow);
                    meta.appendChild(when);
                    meta.appendChild(desc);

                    li.appendChild(meta);
                    list.appendChild(li);
                }
            };

            const evaluate = async () => {
                if (prefersReducedMotion()) {
                    for (const [id, unmount] of active.entries()) {
                        try { await unmount(); } catch { }
                        active.delete(id);
                    }
                    renderUi(getNow());
                    return;
                }

                const now = getNow();
                const should = new Set(EFFECTS.filter((e) => e.when(now)).map((e) => e.id));

                for (const [id, unmount] of active.entries()) {
                    if (!should.has(id)) {
                        try { await unmount(); } catch { }
                        active.delete(id);
                    }
                }

                for (const e of EFFECTS) {
                    if (!should.has(e.id)) continue;
                    if (active.has(e.id)) continue;
                    const state = {};
                    const unmount = await e.mount(state);
                    active.set(e.id, unmount || (async () => { }));
                }

                renderUi(now);
            };

            const schedule = () => {
                const now = new Date();
                const next = new Date(now);
                next.setHours(24, 0, 5, 0);
                const ms = Math.max(15_000, next.getTime() - now.getTime());
                setTimeout(async () => {
                    await evaluate();
                    schedule();
                }, ms);
            };

            const initDevControls = () => {
                const debugOn = (() => {
                    try { return localStorage.getItem("mc_fx_debug") === "1"; } catch { return false; }
                })();

                const form = document.getElementById("fxDevControls");
                const inpDate = document.getElementById("fxOverrideDate");
                const chkOn = document.getElementById("fxOverrideOn");
                const btn = document.getElementById("fxOverrideApply");

                if (!form || !inpDate || !chkOn || !btn) return;
                if (!debugOn) return;

                form.classList.add("on");

                const o = readFxOverride();
                if (o.date) inpDate.value = o.date;
                chkOn.checked = !!o.on;

                btn.addEventListener("click", async () => {
                    try {
                        localStorage.setItem("mc_fx_override_date", inpDate.value || "");
                        localStorage.setItem("mc_fx_override_on", chkOn.checked ? "1" : "0");
                    } catch { }
                    await evaluate();
                });
            };

            return { evaluate, schedule, initDevControls };
        })();


        // Close Yearly Effects

        window.MCFX = FX;
