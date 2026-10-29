// Fotos extras de cada projeto, exibidas no modal depois da capa do card.
// São imagens de banco (Unsplash) usadas como modelo: troque pelas fotos reais (.webp, até 1200px).
// Três delas também aparecem no carrossel da hero.
const GAL = "assets/images/gallery/";

const PROJ_GALLERIES = {
    "residencia-moderna": [
        { src: GAL + "residencia-moderna-2.webp", label: "Vista lateral" },
        { src: GAL + "residencia-moderna-3.webp", label: "Área de lazer" },
    ],
    "residencia-contemporanea": [
        { src: GAL + "residencia-contemporanea-2.webp", label: "Vista lateral" },
        { src: GAL + "residencia-contemporanea-3.webp", label: "Área externa" },
    ],
    "condominio-residencial": [
        { src: GAL + "condominio-residencial-2.webp", label: "Vista das torres" },
        { src: GAL + "condominio-residencial-3.webp", label: "Fachada lateral" },
    ],
    "centro-empresarial": [
        { src: GAL + "centro-empresarial-2.webp", label: "Fachada em vidro" },
        { src: GAL + "centro-empresarial-3.webp", label: "Vista lateral" },
    ],
    "edificio-comercial-misto": [
        { src: GAL + "edificio-comercial-misto-2.webp", label: "Fachada lateral" },
        { src: GAL + "edificio-comercial-misto-3.webp", label: "Detalhe da fachada" },
    ],
    "shopping-center": [
        { src: GAL + "shopping-center-2.webp", label: "Praça central" },
        { src: GAL + "shopping-center-3.webp", label: "Circulação interna" },
    ],
    "complexo-industrial": [
        { src: GAL + "complexo-industrial-2.webp", label: "Vista geral" },
        { src: GAL + "complexo-industrial-3.webp", label: "Pátio de manobras" },
    ],
    "galpao-industrial": [
        { src: GAL + "galpao-industrial-2.webp", label: "Vista externa" },
        { src: GAL + "galpao-industrial-3.webp", label: "Pátio de manobras" },
    ],
    "planta-industrial": [
        { src: GAL + "planta-industrial-2.webp", label: "Bloco industrial" },
        { src: GAL + "planta-industrial-3.webp", label: "Vista lateral" },
    ],
};

// WhatsApp usado no modal de projeto
const WHATSAPP_PHONE = "5561998032220";


(function () {
    "use strict";

    // Utilitários
    const root = document.documentElement;
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[ch]));

    const icon = (name) => '<svg class="ico" aria-hidden="true"><use href="#i-' + name + '"/></svg>';

    // Cada módulo roda isolado: um erro não derruba os demais
    function run(name, fn) {
        try { fn(); } catch (err) { console.error("[L6] Falha no módulo \"" + name + "\":", err); }
    }

    // Fundo inacessível enquanto menu ou modal estão abertos
    function setBackgroundInert(state, except) {
        ["#site-header", "#conteudo", ".site-footer", "#back-to-top"].forEach((sel) => {
            const el = $(sel);
            if (el && el !== except) el.inert = state;
        });
    }


    // Anos desde a fundação e ano do copyright
    run("datas", () => {
        const year = new Date().getFullYear();
        $$("[data-since]").forEach((el) => {
            const diff = year - parseInt(el.dataset.since, 10);
            if (diff > 0) el.textContent = diff;
        });
        const yearEl = $("#footer-year");
        if (yearEl) yearEl.textContent = year;
    });


    // Revelação ao rolar (IntersectionObserver)
    run("revelacao", () => {
        const groups = $$("[data-stagger]");
        groups.forEach((group) => {
            Array.from(group.children).forEach((child, i) => child.style.setProperty("--i", i));
        });

        const targets = $$("[data-reveal], [data-stagger]");

        // Ao terminar, devolve as transições e os hovers de cada componente
        const finish = (el) => {
            el.removeAttribute("data-reveal");
            el.removeAttribute("data-stagger");
            el.classList.remove("is-in");
        };

        if (!("IntersectionObserver" in window) || reduceMotion.matches) {
            targets.forEach(finish);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                observer.unobserve(el);
                el.classList.add("is-in");
                const steps = el.hasAttribute("data-stagger") ? el.children.length : 1;
                setTimeout(() => finish(el), 900 + steps * 70);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

        targets.forEach((el) => observer.observe(el));
    });

    // Avisa o <head> que o script carregou
    window.L6_READY = true;


    // Cabeçalho, progresso de rolagem e voltar ao topo
    run("rolagem", () => {
        const header = $("#site-header");
        const progress = $(".scroll-progress__bar");
        const toTop = $("#back-to-top");

        let lastY = window.scrollY;
        let ticking = false;

        // Um requestAnimationFrame por quadro
        function update() {
            ticking = false;
            const y = window.scrollY;
            const vh = window.innerHeight;
            const max = root.scrollHeight - vh;

            progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1).toFixed(4) : 0) + ")";
            header.classList.toggle("is-scrolled", y > 12);

            if (!root.classList.contains("menu-open") && Math.abs(y - lastY) > 6) {
                header.classList.toggle("is-hidden", y > lastY && y > vh * 0.6);
                lastY = y;
            }

            if (toTop) toTop.classList.toggle("is-visible", y > vh * 0.8);
        }

        window.addEventListener("scroll", () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener("resize", update, { passive: true });
        update();

        if (toTop) {
            toTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
            });
        }
    });


    // Link ativo da navegação conforme a seção visível
    run("nav-ativa", () => {
        const links = $$(".nav__link[data-nav]");
        if (!links.length || !("IntersectionObserver" in window)) return;

        const byId = new Map(links.map((l) => [l.dataset.nav, l]));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((l) => { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
                const link = byId.get(entry.target.id);
                if (link) { link.classList.add("is-active"); link.setAttribute("aria-current", "true"); }
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        byId.forEach((_, id) => { const s = document.getElementById(id); if (s) observer.observe(s); });
    });


    // Menu mobile
    run("menu", () => {
        const btn = $(".menu-btn");
        const menu = $("#mobile-menu");
        if (!btn || !menu) return;
        const cta = $(".header-cta");

        function setMenu(open) {
            root.classList.toggle("menu-open", open);
            root.classList.toggle("is-locked", open);
            btn.setAttribute("aria-expanded", String(open));
            btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
            // Com o menu aberto, só o cabeçalho e o menu recebem foco
            ["#conteudo", ".site-footer", "#back-to-top"].forEach((sel) => { const el = $(sel); if (el) el.inert = open; });
            if (cta) cta.inert = open;
        }

        const isOpen = () => root.classList.contains("menu-open");

        btn.addEventListener("click", () => setMenu(!isOpen()));
        $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && isOpen()) { setMenu(false); btn.focus(); }
        });
        window.addEventListener("resize", () => { if (window.innerWidth >= 1024 && isOpen()) setMenu(false); });
    });


    // Contadores dos indicadores
    run("contadores", () => {
        const els = $$("[data-count]");
        if (!els.length || reduceMotion.matches || !("IntersectionObserver" in window)) return;

        const animate = (el) => {
            const finalText = el.textContent.trim();
            const decimals = parseInt(el.dataset.decimals || "0", 10);
            const target = parseFloat(finalText.replace(/\./g, "").replace(",", "."));
            if (!isFinite(target)) return;

            const fmt = (n) => n.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
            el.style.minWidth = el.offsetWidth + "px"; // evita que o layout "pule"

            const duration = 1400;
            const start = performance.now();
            const step = (now) => {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(2, -10 * t); // ease-out exponencial
                el.textContent = t < 1 ? fmt(target * eased) : finalText;
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                animate(entry.target);
            });
        }, { threshold: 0.6 });

        els.forEach((el) => observer.observe(el));
    });


    // Faixa de serviços: pausa quando está fora da tela
    run("ticker", () => {
        const ticker = $(".ticker");
        if (!ticker || !("IntersectionObserver" in window)) return;
        new IntersectionObserver(([entry]) => {
            ticker.classList.toggle("is-paused", !entry.isIntersecting);
        }).observe(ticker);
    });


    // Projetos: abrir o modal a partir de um card
    function openFromCard(card, opener) {
        if (!card) return;
        const img = $(".proj__img", card);
        const title = $(".proj__title", card).textContent.trim();
        const desc = $(".proj__desc", card).textContent.trim();
        const cat = $(".proj__meta span", card);
        const slug = card.dataset.project || "";

        openProjectModal({
            image: img.getAttribute("src"),
            title: title,
            category: cat ? cat.textContent.trim() : "",
            area: card.dataset.area || "N/A",
            duration: card.dataset.duration || "N/A",
            client: card.dataset.client || "Confidencial",
            sketchfab: card.dataset.sketchfab || "",
            subtitle: card.dataset.subtitle || "",
            fullDescription: card.dataset.fullDescription || desc,
            gallery: PROJ_GALLERIES[slug] || [],
        }, opener);
    }

    run("cards", () => {
        $$(".proj__btn").forEach((btn) => {
            const card = btn.closest(".proj");
            // nome acessível único: "Ver detalhes: <projeto>"
            btn.setAttribute("aria-label", "Ver detalhes: " + $(".proj__title", card).textContent.trim());
            btn.addEventListener("click", () => openFromCard(card, btn));
        });
    });


    // Projetos: filtro por categoria
    run("filtro", () => {
        const wrap = $(".filters");
        const buttons = $$(".filter");
        const cards = $$(".proj");
        const status = $("#proj-status");
        if (!wrap || !buttons.length) return;

        // Contagem por categoria
        buttons.forEach((b) => {
            const f = b.dataset.filter;
            const n = f === "all" ? cards.length : cards.filter((c) => c.dataset.category === f).length;
            const count = $(".filter__count", b);
            if (count) count.textContent = n;
        });

        function moveIndicator() {
            const active = $(".filter.is-active", wrap);
            if (!active) return;
            wrap.style.setProperty("--x", active.offsetLeft + "px");
            wrap.style.setProperty("--y", active.offsetTop + "px");
            wrap.style.setProperty("--w", active.offsetWidth + "px");
            wrap.style.setProperty("--h", active.offsetHeight + "px");
            wrap.classList.add("has-indicator");
        }

        // Desloca o card do meio de cada linha (desktop)
        function setOffsets() {
            cards.filter((c) => !c.hidden).forEach((c, i) => c.classList.toggle("is-offset", i % 3 === 1));
        }

        function announce(filter) {
            if (!status) return;
            const visible = cards.filter((c) => !c.hidden).length;
            const label = $(".filter.is-active", wrap).firstChild.textContent.trim().toLowerCase();
            status.textContent = "Mostrando " + visible + (visible === 1 ? " projeto" : " projetos") +
                (filter === "all" ? "" : " — categoria " + label);
        }

        // Esconde/mostra e faz um fade curto nos cards visíveis
        function apply(filter) {
            cards.forEach((c) => { c.hidden = !(filter === "all" || c.dataset.category === filter); });
            setOffsets();
            announce(filter);

            if (reduceMotion.matches) return;
            cards.filter((c) => !c.hidden).forEach((c, i) => {
                if (c.animate) c.animate(
                    [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
                    { duration: 400, delay: i * 40, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }
                );
            });
        }

        buttons.forEach((b) => {
            b.addEventListener("click", () => {
                if (b.classList.contains("is-active")) return;
                buttons.forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
                b.classList.add("is-active");
                b.setAttribute("aria-pressed", "true");
                moveIndicator();
                apply(b.dataset.filter);
            });
        });

        setOffsets();
        moveIndicator();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
        let raf = 0;
        window.addEventListener("resize", () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(moveIndicator);
        });
    });


    // Hero: carrossel de projetos em destaque
    run("hero-carrossel", () => {
        const show = $("[data-show]");
        if (!show) return;
        const slides = $$(".show__slide", show);
        const dots = $$(".show__dot", show);
        const labelEl = $("[data-show-label]");
        const indexEl = $("[data-show-index]");
        let current = 0;

        // As fotos 2 e 3 só carregam depois da página
        const loadImg = (slide) => {
            const img = $("img", slide);
            if (img && !img.getAttribute("src") && img.dataset.src) img.src = img.dataset.src;
        };
        window.addEventListener("load", () => slides.forEach(loadImg));

        function go(next) {
            if (next === current) return;
            loadImg(slides[next]);
            slides[current].classList.remove("is-active");
            dots.forEach((d, i) => {
                d.classList.toggle("is-active", i === next);
                d.classList.toggle("is-done", i < next);
                if (i === next) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
            });
            slides[next].classList.add("is-active");
            current = next;
            if (labelEl) labelEl.textContent = slides[next].dataset.category || "";
            if (indexEl) indexEl.textContent = String(next + 1).padStart(2, "0");
        }

        dots.forEach((d, i) => d.addEventListener("click", () => go(i)));

        // Avança junto com a barra de progresso (CSS); pausar a barra pausa o carrossel
        if (reduceMotion.matches) {
            show.classList.add("is-static");
        } else {
            dots.forEach((d, i) => {
                const bar = $("span", d);
                bar.addEventListener("animationend", () => { if (i === current) go((current + 1) % slides.length); });
            });
            const pause = () => show.classList.add("is-paused");
            const resume = () => show.classList.remove("is-paused");
            show.addEventListener("mouseenter", pause);
            show.addEventListener("mouseleave", resume);
            show.addEventListener("focusin", pause);
            show.addEventListener("focusout", resume);
            document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));
        }

        // Arrastar no toque
        let startX = null;
        show.addEventListener("pointerdown", (e) => { startX = e.clientX; });
        show.addEventListener("pointerup", (e) => {
            if (startX === null) return;
            const dx = e.clientX - startX;
            startX = null;
            if (Math.abs(dx) < 50) return;
            go((current + (dx < 0 ? 1 : -1) + slides.length) % slides.length);
        });

        // "Ver projeto" abre o modal do card correspondente
        $$("[data-open-project]", show).forEach((btn) => {
            btn.addEventListener("click", () => {
                openFromCard($('.proj[data-project="' + btn.dataset.openProject + '"]'), btn);
            });
        });
    });


    // Contato: selo de disponibilidade dinâmico
    run("disponibilidade", () => {
        const badge = $("#contato-avail-badge");
        const replyMsg = $("#contato-reply-msg");
        if (!badge || !replyMsg) return;

        const now = new Date();
        const day = now.getDay(); // 0 = domingo, 6 = sábado
        const hour = now.getHours();
        const isOpen = day >= 1 && day <= 5 && hour >= 8 && hour < 18;

        if (isOpen) {
            badge.innerHTML = '<span class="avail avail--on"><span class="pulse-dot" aria-hidden="true"></span>Online agora</span>';
            replyMsg.textContent = "Respondemos em até 1h";
        } else {
            const nextDay = (day === 0 || day === 6 || (day === 5 && hour >= 18)) ? "segunda-feira" : (hour < 8 ? "hoje" : "amanhã");
            badge.innerHTML = '<span class="avail avail--off"><span class="pulse-dot" aria-hidden="true"></span>Fora do horário</span>';
            replyMsg.textContent = "Respondemos " + nextDay + " a partir das 8h";
        }
    });


    // Modal de projeto: fotos + modelo 3D
    function openProjectModal(project, opener) {
        if ($(".pm")) return;

        const photos = [{ src: project.image, label: "Fachada" }].concat(project.gallery || []);
        const has3D = !!project.sketchfab;
        const multi = photos.length > 1;
        let current = 0;
        let mode = "photos";
        let iframeLoaded = false;

        const waText = "Olá, vim pelo site da L6 Engenharia e gostaria de falar sobre um projeto como \"" + project.title + "\".";
        const waHref = "https://api.whatsapp.com/send/?phone=" + WHATSAPP_PHONE + "&text=" + encodeURIComponent(waText);

        const stat = (label, value, ico) =>
            '<div class="pm__stat"><dt>' + icon(ico) + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>';

        const modal = document.createElement("div");
        modal.className = "pm";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "pm-title");
        modal.innerHTML =
            '<div class="pm__backdrop" data-pm-close></div>' +
            '<div class="pm__card">' +
                '<button class="pm__close" type="button" aria-label="Fechar" data-pm-close>' + icon("close") + '</button>' +
                '<div class="pm__media">' +
                    '<div class="pm__stage">' +
                        '<img class="pm__photo" src="' + esc(photos[0].src) + '" alt="' + esc(project.title + " — " + photos[0].label) + '">' +
                        '<div class="pm__3d" hidden></div>' +
                        (multi
                            ? '<button class="pm__arrow pm__arrow--prev" type="button" aria-label="Foto anterior">' + icon("chev-left") + '</button>' +
                                '<button class="pm__arrow pm__arrow--next" type="button" aria-label="Próxima foto">' + icon("chev-right") + '</button>'
                            : '') +
                        '<span class="pm__counter" aria-live="polite"></span>' +
                    '</div>' +
                    '<div class="pm__bar">' +
                        (has3D
                            ? '<div class="pm__tabs" role="group" aria-label="Tipo de visualização">' +
                                    '<button class="pm__tab" type="button" data-mode="photos" aria-pressed="true">' + icon("image") + 'Fotos</button>' +
                                    '<button class="pm__tab" type="button" data-mode="3d" aria-pressed="false">' + icon("cube") + 'Modelo 3D</button>' +
                                '</div>'
                            : '') +
                        '<div class="pm__thumbs" role="group" aria-label="Fotos do projeto">' +
                            photos.map((p, i) =>
                                '<button class="pm__thumb" type="button" data-index="' + i + '" aria-label="Foto ' + (i + 1) + ': ' + esc(p.label) + '">' +
                                    '<img src="' + esc(p.src) + '" alt="" loading="lazy">' +
                                '</button>').join("") +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="pm__info">' +
                    '<div>' +
                        (project.category ? '<p class="pm__cat">' + esc(project.category) + '</p>' : '') +
                        '<h2 class="pm__title" id="pm-title">' + esc(project.title) + '</h2>' +
                        (project.subtitle ? '<p class="pm__subtitle">' + esc(project.subtitle) + '</p>' : '') +
                    '</div>' +
                    '<dl class="pm__stats">' +
                        stat("Área", project.area, "home") +
                        stat("Duração", project.duration, "calendar") +
                        stat("Cliente", project.client, "user") +
                    '</dl>' +
                    '<div>' +
                        '<h3 class="pm__about-h">Sobre o projeto</h3>' +
                        '<p class="pm__about-t">' + esc(project.fullDescription) + '</p>' +
                    '</div>' +
                    '<a class="btn btn--primary pm__cta" href="' + esc(waHref) + '" target="_blank" rel="noopener">' +
                        icon("whatsapp") + 'Falar sobre este projeto' +
                    '</a>' +
                '</div>' +
            '</div>';

        document.body.appendChild(modal);
        root.classList.add("is-locked");
        setBackgroundInert(true);

        const card = $(".pm__card", modal);
        const photoEl = $(".pm__photo", modal);
        const wrap3d = $(".pm__3d", modal);
        const prevBtn = $(".pm__arrow--prev", modal);
        const nextBtn = $(".pm__arrow--next", modal);
        const counter = $(".pm__counter", modal);
        const thumbs = $$(".pm__thumb", modal);
        const tabs = $$(".pm__tab", modal);
        const closeBtn = $(".pm__close", modal);

        // Pré-carrega as fotos da galeria
        photos.slice(1).forEach((p) => { const im = new Image(); im.src = p.src; });

        function ensureIframe() {
            if (iframeLoaded) return;
            wrap3d.innerHTML = '<iframe src="https://sketchfab.com/models/' + encodeURIComponent(project.sketchfab) +
                '/embed?autostart=1&ui_theme=dark&preload=1" title="' + esc(project.title) +
                ' — Modelo 3D" allow="autoplay; fullscreen; xr-spatial-tracking"></iframe>';
            iframeLoaded = true;
        }

        function showPhoto(i) {
            const item = photos[i];
            const alt = project.title + " — " + item.label;
            if (photoEl.getAttribute("src") === item.src) { photoEl.alt = alt; return; }

            if (reduceMotion.matches) { photoEl.src = item.src; photoEl.alt = alt; return; }
            photoEl.classList.add("is-swapping");
            setTimeout(() => {
                const done = () => photoEl.classList.remove("is-swapping");
                photoEl.addEventListener("load", done, { once: true });
                photoEl.addEventListener("error", done, { once: true });
                photoEl.src = item.src;
                photoEl.alt = alt;
                if (photoEl.complete) done();
            }, 160);
        }

        function render() {
            const is3D = mode === "3d";
            if (is3D) ensureIframe();
            wrap3d.hidden = !is3D;
            if (!is3D) showPhoto(current);

            if (prevBtn) prevBtn.hidden = nextBtn.hidden = is3D;
            counter.hidden = is3D || !multi;
            counter.textContent = photos[current].label + " · " + (current + 1) + " / " + photos.length;

            thumbs.forEach((t, i) => {
                if (!is3D && i === current) t.setAttribute("aria-current", "true");
                else t.removeAttribute("aria-current");
            });
            tabs.forEach((t) => t.setAttribute("aria-pressed", String((t.dataset.mode === "3d") === is3D)));
        }

        function go(delta) {
            mode = "photos";
            current = (current + delta + photos.length) % photos.length;
            render();
        }

        if (prevBtn) prevBtn.addEventListener("click", () => go(-1));
        if (nextBtn) nextBtn.addEventListener("click", () => go(1));
        thumbs.forEach((t) => t.addEventListener("click", () => {
            mode = "photos";
            current = parseInt(t.dataset.index, 10);
            render();
        }));
        tabs.forEach((t) => t.addEventListener("click", () => { mode = t.dataset.mode; render(); }));

        // Arrastar a foto no toque
        const stage = $(".pm__stage", modal);
        let startX = null;
        stage.addEventListener("pointerdown", (e) => { if (mode === "photos") startX = e.clientX; });
        stage.addEventListener("pointerup", (e) => {
            if (startX === null) return;
            const dx = e.clientX - startX;
            startX = null;
            if (multi && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        });

        // Fechar e devolver o foco
        function close() {
            modal.classList.remove("is-open");
            document.removeEventListener("keydown", onKey);
            const remove = () => {
                if (modal.parentNode) modal.parentNode.removeChild(modal);
                root.classList.remove("is-locked");
                setBackgroundInert(false);
                if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
            };
            if (reduceMotion.matches) remove(); else setTimeout(remove, 380);
        }

        function focusables() {
            return $$('button, a[href], iframe, [tabindex]:not([tabindex="-1"])', card)
                .filter((el) => !el.hidden && el.getClientRects().length > 0);
        }

        function onKey(e) {
            if (e.key === "Escape") { e.preventDefault(); close(); return; }
            if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && mode === "photos" && multi &&
                !(document.activeElement && document.activeElement.tagName === "IFRAME")) {
                go(e.key === "ArrowLeft" ? -1 : 1);
                return;
            }
            if (e.key === "Tab") {
                const items = focusables();
                if (!items.length) return;
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        }

        $$("[data-pm-close]", modal).forEach((el) => el.addEventListener("click", close));
        document.addEventListener("keydown", onKey);

        render();
        requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("is-open")));
        closeBtn.focus({ preventScroll: true });
    }
})();
