
const THEME_PRESETS = {
    paper: {
        "--ink": "#141224",
        "--paper": "#f4f1ea",
        "--paper-2": "#e8e8df",
        "--slate": "#7f7892",
        "--plum": "#4a3a63",
        "--violet": "#7f5e7c",
        "--gold": "#ae895c",
        "--accent": "#0088b1",
        "--red": "#e22428",
        "--bg1": "#0088b1",
        "--bg2": "#7f5e7c",
        "--bg3": "#ae895c",
        "--art1": "#0088b1",
        "--art2": "#7f5e7c",
        "--border": "1px solid rgba(25,24,47,.14)",
        "--shadow": "0 16px 50px rgba(15,13,25,.18)",
        "--shadow-2": "0 10px 26px rgba(15,13,25,.14)"
    },
    ivory: {
        "--ink": "#1a1427",
        "--paper": "#f7f3e6",
        "--paper-2": "#ece6d6",
        "--slate": "#80788f",
        "--plum": "#43305b",
        "--violet": "#86627f",
        "--gold": "#b09163",
        "--accent": "#0a7f9a",
        "--red": "#d93b44",
        "--bg1": "#0a7f9a",
        "--bg2": "#86627f",
        "--bg3": "#b09163",
        "--art1": "#0a7f9a",
        "--art2": "#86627f",
        "--border": "1px solid rgba(25,24,47,.12)",
        "--shadow": "0 16px 50px rgba(18,15,27,.16)",
        "--shadow-2": "0 10px 26px rgba(18,15,27,.12)"
    },
    mist: {
        "--ink": "#0c1420",
        "--paper": "#eef2f3",
        "--paper-2": "#dfe7ea",
        "--slate": "#5f7383",
        "--plum": "#2b2f58",
        "--violet": "#5f5a86",
        "--gold": "#9f845e",
        "--accent": "#007aa6",
        "--red": "#d4464e",
        "--bg1": "#007aa6",
        "--bg2": "#5f5a86",
        "--bg3": "#9f845e",
        "--art1": "#007aa6",
        "--art2": "#5f5a86",
        "--border": "1px solid rgba(25,24,47,.12)",
        "--shadow": "0 16px 50px rgba(15,13,25,.14)",
        "--shadow-2": "0 10px 26px rgba(15,13,25,.10)"
    },
    sand: {
        "--ink": "#1b1410",
        "--paper": "#f3efe5",
        "--paper-2": "#e6dfd2",
        "--slate": "#7b6f66",
        "--plum": "#4b3b56",
        "--violet": "#7a617f",
        "--gold": "#b08a55",
        "--accent": "#0b7e95",
        "--red": "#d33f47",
        "--bg1": "#0b7e95",
        "--bg2": "#7a617f",
        "--bg3": "#b08a55",
        "--art1": "#0b7e95",
        "--art2": "#7a617f",
        "--border": "1px solid rgba(25,24,47,.12)",
        "--shadow": "0 16px 50px rgba(16,15,21,.14)",
        "--shadow-2": "0 10px 26px rgba(16,15,21,.10)"
    },
    cobalt: {
        "--ink": "#0b1020",
        "--paper": "#eef4f6",
        "--paper-2": "#dde9ee",
        "--slate": "#5f6e8b",
        "--plum": "#22284f",
        "--violet": "#4f4f86",
        "--gold": "#a48961",
        "--accent": "#0088b1",
        "--red": "#d94b50",
        "--bg1": "#0088b1",
        "--bg2": "#5c5b86",
        "--bg3": "#a48961",
        "--art1": "#0088b1",
        "--art2": "#5c5b86",
        "--border": "1px solid rgba(25,24,47,.14)",
        "--shadow": "0 16px 50px rgba(15,13,25,.16)",
        "--shadow-2": "0 10px 26px rgba(15,13,25,.12)"
    },

    ink: {
        "--paper": "#0c0b14",
        "--paper-2": "#121022",
        "--ink": "#f1ecff",
        "--slate": "#cbbfe6",
        "--plum": "#b58be6",
        "--violet": "#d1a0de",
        "--gold": "#c9a57a",
        "--accent": "#62c5dd",
        "--red": "#ff5a63",
        "--bg1": "#62c5dd",
        "--bg2": "#d1a0de",
        "--bg3": "#c9a57a",
        "--art1": "#62c5dd",
        "--art2": "#d1a0de",
        "--border": "1px solid rgba(232,232,223,.12)",
        "--shadow": "0 20px 70px rgba(0,0,0,.35)",
        "--shadow-2": "0 14px 34px rgba(0,0,0,.28)"
    },
    graphite: {
        "--paper": "#10121a",
        "--paper-2": "#151828",
        "--ink": "#eaf0ff",
        "--slate": "#b6c0da",
        "--plum": "#9b8ad0",
        "--violet": "#b38ab6",
        "--gold": "#c2a06d",
        "--accent": "#5fd0d3",
        "--red": "#ff6a6f",
        "--bg1": "#5fd0d3",
        "--bg2": "#9b8ad0",
        "--bg3": "#c2a06d",
        "--art1": "#5fd0d3",
        "--art2": "#9b8ad0",
        "--border": "1px solid rgba(232,232,223,.12)",
        "--shadow": "0 22px 76px rgba(0,0,0,.38)",
        "--shadow-2": "0 14px 34px rgba(0,0,0,.30)"
    },
    midnight: {
        "--paper": "#071018",
        "--paper-2": "#0a1420",
        "--ink": "#e9fbff",
        "--slate": "#99c0c6",
        "--plum": "#8a7fc2",
        "--violet": "#6fa0d7",
        "--gold": "#c3a074",
        "--accent": "#4fd0c8",
        "--red": "#ff6376",
        "--bg1": "#4fd0c8",
        "--bg2": "#6fa0d7",
        "--bg3": "#c3a074",
        "--art1": "#4fd0c8",
        "--art2": "#6fa0d7",
        "--border": "1px solid rgba(232,232,223,.12)",
        "--shadow": "0 24px 86px rgba(0,0,0,.42)",
        "--shadow-2": "0 14px 34px rgba(0,0,0,.32)"
    },
    violetNight: {
        "--paper": "#1b1426",
        "--paper-2": "#211a2f",
        "--ink": "#fff0fa",
        "--slate": "#d3bfe0",
        "--plum": "#c0a4d6",
        "--violet": "#f2b2e3",
        "--gold": "#c8a77a",
        "--accent": "#69c6e6",
        "--red": "#ff5d6a",
        "--bg1": "#69c6e6",
        "--bg2": "#f2b2e3",
        "--bg3": "#c8a77a",
        "--art1": "#69c6e6",
        "--art2": "#f2b2e3",
        "--border": "1px solid rgba(232,232,223,.12)",
        "--shadow": "0 22px 80px rgba(0,0,0,.40)",
        "--shadow-2": "0 14px 34px rgba(0,0,0,.30)"
    },
    gildedNight: {
        "--paper": "#0b0a0f",
        "--paper-2": "#12111a",
        "--ink": "#fff3d6",
        "--slate": "#e6d6a6",
        "--plum": "#b8922f",
        "--violet": "#8a6b2b",
        "--gold": "#DEA101",
        "--accent": "#DEA101",
        "--red": "#ff6a3a",
        "--bg1": "#DEA101",
        "--bg2": "#5f2f1a",
        "--bg3": "#1c6f78",
        "--art1": "#DEA101",
        "--art2": "#1c6f78",
        "--border": "1px solid rgba(246,241,230,.14)",
        "--shadow": "0 26px 94px rgba(0,0,0,.48)",
        "--shadow-2": "0 14px 34px rgba(0,0,0,.36)"
    },

    white: {
        "--ink": "#0a0a0f",
        "--paper": "#ffffff",
        "--paper-2": "#ffffff",
        "--slate": "#2a2a35",
        "--plum": "#0a0a0f",
        "--violet": "#0a0a0f",
        "--gold": "#0a0a0f",
        "--accent": "#0a0a0f",
        "--red": "#0a0a0f",
        "--bg1": "#ffffff",
        "--bg2": "#ffffff",
        "--bg3": "#ffffff",
        "--art1": "#0a0a0f",
        "--art2": "#0a0a0f",
        "--border": "1px solid rgba(0,0,0,.12)",
        "--shadow": "0 16px 50px rgba(0,0,0,.10)",
        "--shadow-2": "0 10px 26px rgba(0,0,0,.08)"
    },
    black: {
        "--ink": "#f5f6f8",
        "--paper": "#000000",
        "--paper-2": "#000000",
        "--slate": "#cfd3da",
        "--plum": "#f5f6f8",
        "--violet": "#f5f6f8",
        "--gold": "#f5f6f8",
        "--accent": "#f5f6f8",
        "--red": "#f5f6f8",
        "--bg1": "#000000",
        "--bg2": "#000000",
        "--bg3": "#000000",
        "--art1": "#f5f6f8",
        "--art2": "#f5f6f8",
        "--border": "1px solid rgba(245,246,248,.14)",
        "--shadow": "0 26px 94px rgba(0,0,0,.62)",
        "--shadow-2": "0 14px 34px rgba(0,0,0,.48)"
    }
};

const THEME_GROUPS = {
    Light: ["white", "paper", "ivory", "mist", "sand", "cobalt"],
    Dark: ["black", "ink", "graphite", "midnight", "violetNight", "gildedNight"]
};

const THEME_LABELS = {
    white: "White",
    paper: "Paper",
    ivory: "Ivory",
    mist: "Mist",
    sand: "Sand",
    cobalt: "Cobalt",
    black: "Black",
    ink: "Ink",
    graphite: "Graphite",
    midnight: "Midnight",
    violetNight: "Violet",
    gildedNight: "Gilded"
};

const THEME_STAGGER = [
    ["--paper", "--paper-2"],
    ["--bg1", "--bg2", "--bg3"],
    ["--ink", "--slate"],
    ["--accent", "--violet", "--plum"],
    ["--gold", "--red"],
    ["--art1", "--art2"],
    ["--border"],
    ["--shadow", "--shadow-2"]
];

function buildThemeMenu() {
    const menu = document.getElementById("themeMenu");
    const list = document.getElementById("themeOptions");
    if (!menu || !list) return;

    list.textContent = "";

    const currentTheme =
        document.documentElement.dataset.theme ||
        localStorage.getItem("mc_theme") ||
        "paper";

    const mkBtn = (key) => {
        const b = document.createElement("button");
        b.className = "themeOption";
        b.type = "button";
        b.dataset.theme = key;

        const pressed = key === currentTheme;
        b.setAttribute("aria-pressed", pressed ? "true" : "false");

        const sw = document.createElement("span");
        sw.className = "optSw";
        sw.setAttribute("style", `background:${THEME_PRESETS[key]["--paper"]}`);

        b.appendChild(sw);
        b.appendChild(document.createTextNode(THEME_LABELS[key] ?? key));
        return b;
    };

    for (const [groupName, keys] of Object.entries(THEME_GROUPS)) {
        const section = document.createElement("div");
        section.className = "themeSection";

        const title = document.createElement("div");
        title.className = "themeSectionTitle";
        title.textContent = groupName;

        section.appendChild(title);
        for (const key of keys) section.appendChild(mkBtn(key));

        list.appendChild(section);
    }
}



function setThemeButtons(active) {
    document.querySelectorAll(".themeOption").forEach((b) => {
        b.setAttribute("aria-pressed", b.dataset.theme === active ? "true" : "false");
    });
}

function applyThemeStaggered(name) {
    const preset = THEME_PRESETS[name];
    if (!preset) return;

    const root = document.documentElement;
    root.dataset.theme = name;
    root.classList.add("themeChanging");
    refreshAboutWordDelays();

    const steps = THEME_STAGGER
        .map((keys) => keys.filter((k) => k in preset))
        .filter((k) => k.length > 0);

    let step = 0;
    const run = () => {
        if (step >= steps.length) return;
        for (const key of steps[step]) root.style.setProperty(key, preset[key]);
        step++;
        window.setTimeout(run, 140);
    };

    run();
    setThemeButtons(name);

    const label = name === "violetNight" ? "Violet" : (name === "gildedNight" ? "Gilded" : (name.charAt(0).toUpperCase() + name.slice(1)));
    const labelEl = document.getElementById("themeLabelText");
    if (labelEl) labelEl.textContent = "Theme: " + label;
    const sw = document.getElementById("themeSwatch");
    if (sw) sw.style.background = preset["--paper"] || "#f4f1ea";

    try { localStorage.setItem("mc_theme", name); } catch { }

    window.setTimeout(() => {
        root.classList.remove("themeChanging");
    }, 1600);
}

function initFooterDock() {
    const footer = document.querySelector("footer");
    const menu = document.getElementById("themeMenu");
    if (!footer || !menu) return;

    const setDocked = (docked) => {
        if (docked) menu.classList.add("docked");
        else menu.classList.remove("docked");
    };

    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
            (entries) => {
                const e = entries && entries[0];
                if (!e) return;
                const footerVisible = e.isIntersecting && e.intersectionRatio > 0.25;
                setDocked(!footerVisible);
            },
            { threshold: [0, 0.25, 0.6, 1.0] }
        );
        io.observe(footer);
    } else {
        const onScroll = () => {
            const r = footer.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const footerVisible = r.top < vh && r.bottom > 0;
            setDocked(!footerVisible);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
    }
}

function initThemePicker() {
    const saved = (() => {
        try { return localStorage.getItem("mc_theme"); } catch { return null; }
    })();

    const initial = saved && THEME_PRESETS[saved] ? saved : "paper";
    applyThemeStaggered(initial);

    const menu = document.getElementById("themeMenu");

    const closeMenu = () => {
        if (!menu || !menu.open) return;
        menu.classList.add("closing");
        window.setTimeout(() => {
            menu.open = false;
            menu.classList.remove("closing");
        }, 110);
    };

    document.querySelectorAll(".themeOption").forEach((btn) => {
        btn.addEventListener("click", () => {
            applyThemeStaggered(btn.dataset.theme);
            closeMenu();
        });
    });

    document.addEventListener("click", (e) => {
        if (!menu || !menu.open) return;
        if (menu.contains(e.target)) return;
        closeMenu();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });
}


window.MCTheme = { buildThemeMenu, applyThemeStaggered, initFooterDock, initThemePicker };
