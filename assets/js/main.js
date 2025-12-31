document.documentElement.classList.add("tAll");

const GH_USER = "MarcCrusellas";
        const README_OWNER = "MarcCrusellas";
        const README_REPO = "MarcCrusellas";
        const README_BRANCH = "main";
        const README_PATH = "README.md";

        const LF = String.fromCharCode(10);
        const CR = String.fromCharCode(13);

        const elYear = document.getElementById("year");
        if (elYear) elYear.textContent = String(new Date().getFullYear());

        document.addEventListener("click", (e) => {
            const a = e.target.closest("a[href^='#']");
            if (!a) return;
            const id = a.getAttribute("href");
            const el = document.querySelector(id);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", id);
        });

        function isExternalHref(href) {
            try {
                const u = new URL(href, window.location.href);
                if (u.protocol !== "http:" && u.protocol !== "https:") return false;
                return u.origin !== window.location.origin;
            } catch {
                return false;
            }
        }

        function hardenExternalLink(a) {
            if (!a) return;
            const href = a.getAttribute("href") || "";
            if (!href) return;
            if (!isExternalHref(href)) return;
            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noreferrer noopener");
        }

        function escapeHtml(s) {
            return String(s)
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#39;");
        }

        function safeUrl(url) {
            try {
                const u = new URL(url, window.location.href);
                if (u.protocol !== "http:" && u.protocol !== "https:") return null;
                return u.toString();
            } catch {
                return null;
            }
        }

        async function fetchProfile(user) {
            const res = await fetch("https://api.github.com/users/" + user, {
                headers: { "Accept": "application/vnd.github+json" }
            });
            if (!res.ok) throw new Error("GitHub API: " + res.status);
            return res.json();
        }

        async function fetchReadmeRaw(owner, repo, branch, path) {
            const url = "https://raw.githubusercontent.com/" + owner + "/" + repo + "/" + branch + "/" + path;
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error("README fetch: " + res.status);
            return res.text();
        }

        function applyInline(md) {
            let out = "";
            let i = 0;

            while (i < md.length) {
                if (md[i] === '`') {
                    const j = md.indexOf('`', i + 1);
                    if (j !== -1) {
                        out += "<code>" + escapeHtml(md.slice(i + 1, j)) + "</code>";
                        i = j + 1;
                        continue;
                    }
                }

                if (md[i] === '!' && md[i + 1] === '[') {
                    const a = md.indexOf(']', i + 2);
                    const b = a === -1 ? -1 : md.indexOf('(', a + 1);
                    const c = b === -1 ? -1 : md.indexOf(')', b + 1);
                    if (a !== -1 && b !== -1 && c !== -1) {
                        const alt = md.slice(i + 2, a);
                        const url = safeUrl(md.slice(b + 1, c).trim());
                        if (url) out += "<img src=\"" + escapeHtml(url) + "\" alt=\"" + escapeHtml(alt) + "\" loading=\"lazy\" decoding=\"async\" />";
                        i = c + 1;
                        continue;
                    }
                }

                if (md[i] === '[') {
                    const a = md.indexOf(']', i + 1);
                    const b = a === -1 ? -1 : md.indexOf('(', a + 1);
                    const c = b === -1 ? -1 : md.indexOf(')', b + 1);
                    if (a !== -1 && b !== -1 && c !== -1) {
                        const label = md.slice(i + 1, a);
                        const url = safeUrl(md.slice(b + 1, c).trim());
                        if (url) out += "<a href=\"" + escapeHtml(url) + "\" rel=\"noreferrer noopener\" target=\"_blank\">" + escapeHtml(label) + "</a>";
                        else out += escapeHtml(label);
                        i = c + 1;
                        continue;
                    }
                }

                if (md[i] === '*' && md[i + 1] === '*') {
                    const j = md.indexOf('**', i + 2);
                    if (j !== -1) {
                        out += "<strong>" + escapeHtml(md.slice(i + 2, j)) + "</strong>";
                        i = j + 2;
                        continue;
                    }
                }

                if (md[i] === '*') {
                    const j = md.indexOf('*', i + 1);
                    if (j !== -1) {
                        out += "<em>" + escapeHtml(md.slice(i + 1, j)) + "</em>";
                        i = j + 1;
                        continue;
                    }
                }

                out += escapeHtml(md[i]);
                i++;
            }

            return out;
        }

        function renderMarkdown(md) {
            const raw = String(md ?? "");
            const text = raw.split(CR + LF).join(LF).split(CR).join(LF);
            const lines = text.split(LF);

            let html = "";
            let i = 0;

            const eatBlank = () => {
                while (i < lines.length && lines[i].trim() === "") i++;
            };

            const isHr = (t) => {
                const s = t.trim();
                if (s.length < 3) return false;
                let allDash = true;
                let allStar = true;
                for (let k = 0; k < s.length; k++) {
                    const c = s[k];
                    if (c !== '-') allDash = false;
                    if (c !== '*') allStar = false;
                }
                return allDash || allStar;
            };

            const isUnordered = (t) => t.startsWith("- ") || t.startsWith("* ") || t.startsWith("+ ");

            const isOrdered = (t) => {
                const dot = t.indexOf(". ");
                if (dot <= 0) return false;
                const n = t.slice(0, dot);
                return !isNaN(parseInt(n, 10));
            };

            const renderParagraph = () => {
                const buf = [];
                while (i < lines.length) {
                    const t = lines[i].trim();
                    if (t === "") break;
                    if (t.startsWith("```")) break;
                    if (t.startsWith("#")) break;
                    if (t.startsWith(">")) break;
                    if (isHr(t)) break;
                    if (isUnordered(t)) break;
                    if (isOrdered(t)) break;
                    buf.push(t);
                    i++;
                }

                if (buf.length === 0) {
                    i++;
                    return;
                }

                const para = buf.join(" ").split("  ").join(" ").trim();
                if (para) html += "<p>" + applyInline(para) + "</p>";
            };

            const renderCode = () => {
                const fence = lines[i].trim();
                const lang = fence.slice(3).trim();
                i++;
                const buf = [];
                while (i < lines.length && !lines[i].trim().startsWith("```")) {
                    buf.push(lines[i]);
                    i++;
                }
                if (i < lines.length) i++;
                const cls = lang ? " class=\"language-" + escapeHtml(lang) + "\"" : "";
                html += "<pre><code" + cls + ">" + escapeHtml(buf.join(LF)) + "</code></pre>";
            };

            const renderList = (ordered) => {
                html += ordered ? "<ol>" : "<ul>";
                while (i < lines.length) {
                    const t = lines[i].trim();
                    let item = null;

                    if (!ordered) {
                        if (t.startsWith("- ") || t.startsWith("* ") || t.startsWith("+ ")) item = t.slice(2);
                    } else {
                        const dot = t.indexOf(". ");
                        if (dot > 0) {
                            const n = t.slice(0, dot);
                            if (!isNaN(parseInt(n, 10))) item = t.slice(dot + 2);
                        }
                    }

                    if (item === null) break;
                    html += "<li>" + applyInline(item) + "</li>";
                    i++;
                }
                html += ordered ? "</ol>" : "</ul>";
            };

            const renderBlockquote = () => {
                const buf = [];
                while (i < lines.length && lines[i].trim().startsWith(">")) {
                    buf.push(lines[i].trim().replace(">", "").trim());
                    i++;
                }
                html += "<blockquote>" + applyInline(buf.join(LF)) + "</blockquote>";
            };

            while (i < lines.length) {
                const t = lines[i].trim();

                if (t === "") {
                    i++;
                    continue;
                }

                if (t.startsWith("```")) {
                    renderCode();
                    continue;
                }

                if (t.startsWith("#")) {
                    let level = 0;
                    while (level < t.length && t[level] === '#') level++;
                    if (level > 3) level = 3;
                    const title = t.slice(level).trim();
                    html += "<h" + level + ">" + applyInline(title) + "</h" + level + ">";
                    i++;
                    continue;
                }

                if (t.startsWith(">")) {
                    renderBlockquote();
                    continue;
                }

                if (isHr(t)) {
                    html += "<hr />";
                    i++;
                    continue;
                }

                if (isUnordered(t)) {
                    renderList(false);
                    eatBlank();
                    continue;
                }

                if (isOrdered(t)) {
                    renderList(true);
                    eatBlank();
                    continue;
                }

                renderParagraph();
                eatBlank();
            }

            return html;
        }

        function enhanceAboutWords() {
            const root = document.getElementById("aboutMd");
            if (!root) return;

            const wrapIn = new Set(["P", "LI", "BLOCKQUOTE", "H1", "H2", "H3"]);
            const skipTags = new Set(["A", "CODE", "PRE", "SCRIPT", "STYLE"]);

            const walk = (el) => {
                if (!el || el.nodeType !== 1) return;
                if (skipTags.has(el.tagName)) return;

                const nodes = Array.from(el.childNodes);
                for (const n of nodes) {
                    if (n.nodeType === 1) {
                        walk(n);
                        continue;
                    }

                    if (n.nodeType !== 3) continue;
                    const text = n.nodeValue;
                    if (!text || !text.trim()) continue;
                    const parent = n.parentElement;
                    if (!parent || !wrapIn.has(parent.tagName)) continue;
                    if (skipTags.has(parent.tagName)) continue;

                    const frag = document.createDocumentFragment();
                    let buf = "";
                    for (let k = 0; k < text.length; k++) {
                        const ch = text[k];
                        const ws = ch === " " || ch === "	" || ch === LF;
                        if (ws) {
                            if (buf) {
                                const s = document.createElement("span");
                                s.className = "w";
                                s.textContent = buf;
                                frag.appendChild(s);
                                buf = "";
                            }
                            frag.appendChild(document.createTextNode(" "));
                        } else {
                            buf += ch;
                        }
                    }
                    if (buf) {
                        const s = document.createElement("span");
                        s.className = "w";
                        s.textContent = buf;
                        frag.appendChild(s);
                    }

                    parent.replaceChild(frag, n);
                }
            };

            walk(root);
            refreshAboutWordDelays();
        }

        function refreshAboutWordDelays() {
            const root = document.getElementById("aboutMd");
            if (!root) return;
            const words = root.querySelectorAll(".w");
            if (!words || words.length === 0) return;
            for (const w of words) w.style.transitionDelay = (Math.random() * 0.55).toFixed(3) + "s";
        }

        function applyProfile(p) {
            const name = (p.name && p.name.trim()) ? p.name.trim() : p.login;
            const bio = (p.bio && p.bio.trim()) ? p.bio.trim() : "Software Developer";
            const avatar = p.avatar_url || "";
            const ghUrl = p.html_url || ("https://github.com/" + GH_USER);

            const avatarImg = document.getElementById("avatarImg");
            if (avatarImg && avatar) {
                avatarImg.src = avatar;
                avatarImg.alt = name + " avatar";
            }

            const dn = document.getElementById("displayName");
            if (dn) dn.textContent = name;
            const bl = document.getElementById("bioLine");
            if (bl) bl.textContent = bio;
            const fn = document.getElementById("footerName");
            if (fn) fn.textContent = name;

            const ghNav = document.getElementById("ghNavLink");
            if (ghNav) { ghNav.href = ghUrl; hardenExternalLink(ghNav); }

            const ghCta = document.getElementById("ghCtaLink");
            if (ghCta) { ghCta.href = ghUrl; hardenExternalLink(ghCta); }

            const ghFooter = document.getElementById("footerGitHub");
            if (ghFooter) { ghFooter.href = ghUrl; hardenExternalLink(ghFooter); }

            const tileName = document.getElementById("tileName");
            if (tileName) tileName.textContent = name;
            const tileBio = document.getElementById("tileBio");
            if (tileBio) tileBio.textContent = bio;

            document.querySelectorAll("a[href]").forEach(hardenExternalLink);
        }

        function applyReadme(md) {
            const about = document.getElementById("aboutMd");
            if (about) {
                about.innerHTML = renderMarkdown(md);
                enhanceAboutWords();
                about.querySelectorAll("a[href]").forEach(hardenExternalLink);
            }
        }



        if (window.MCTheme?.buildThemeMenu) {
            window.MCTheme.buildThemeMenu();
            window.MCTheme.initFooterDock();
            window.MCTheme.initThemePicker();
        }

        if (window.MCFX?.initDevControls) {
            window.MCFX.initDevControls();
            window.MCFX.evaluate();
            window.MCFX.schedule();
        }

        Promise.all([
            fetchProfile(GH_USER).then(applyProfile).catch(() => { }),
            fetchReadmeRaw(README_OWNER, README_REPO, README_BRANCH, README_PATH).then(applyReadme).catch(() => {
                const about = document.getElementById("aboutMd");
                if (about) about.innerHTML = "<p>Unable to load README content.</p>";
            })
        ]);
