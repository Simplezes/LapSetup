// ═══════════════════════════════════════════════════════════════════════════
// app_ui.js — App mode, game selector, dropdowns, tracks, tooltips, view
// ═══════════════════════════════════════════════════════════════════════════

// ── App Mode ───────────────────────────────────────────────────────────────

function setAppMode(mode) {
    if (mode === 'advanced') {
        document.body.classList.remove('mode-basic');
        if (els.modeAdvanced) els.modeAdvanced.classList.add('active');
        if (els.modeBasic) els.modeBasic.classList.remove('active');
    } else {
        document.body.classList.add('mode-basic');
        if (els.modeBasic) els.modeBasic.classList.add('active');
        if (els.modeAdvanced) els.modeAdvanced.classList.remove('active');
    }
    localStorage.setItem('lma_mode', mode);
}

if (els.modeBasic) els.modeBasic.onclick = () => setAppMode('basic');
if (els.modeAdvanced) els.modeAdvanced.onclick = () => setAppMode('advanced');

const savedMode = localStorage.getItem('lma_mode') || 'basic';
setAppMode(savedMode);

// ── Game Selector ──────────────────────────────────────────────────────────

const gameLMUBtn = document.getElementById('gameLMU');
const gameACBtn = document.getElementById('gameAC');

function setActiveGame(game) {
    if (gameLMUBtn) gameLMUBtn.classList.toggle('active', game === 'lmu');
    if (gameACBtn) gameACBtn.classList.toggle('active', game === 'ac');
    document.body.setAttribute('data-game', game);
    localStorage.setItem('lma_game', game);

    if (game === 'ac') {
        if (els.currentCar) els.currentCar.innerText = 'MAZDA MX-5 CUP';
        if (els.currentCarClass) els.currentCarClass.innerText = 'TOURING';
        if (window.AC_App) window.AC_App.init();
    } else {
        if (CAR) {
            if (els.currentCar) els.currentCar.innerText = CAR.name.toUpperCase();
            for (const [cls, { ids }] of Object.entries(CAR_CATEGORIES)) {
                if (ids.includes(CAR.id)) {
                    if (els.currentCarClass) els.currentCarClass.innerText = cls;
                    break;
                }
            }
        }
    }
}

if (gameLMUBtn) gameLMUBtn.onclick = () => setActiveGame('lmu');
if (gameACBtn) gameACBtn.onclick = () => setActiveGame('ac');

const savedGame = localStorage.getItem('lma_game') || 'lmu';
setActiveGame(savedGame);

// ── Tire Link ──────────────────────────────────────────────────────────────

let tiresLinked = true;
if (els.linkTiresBtn) {
    els.linkTiresBtn.onclick = () => {
        tiresLinked = !tiresLinked;
        const linkIcon = els.linkTiresBtn.querySelector('.link-icon');
        const unlinkIcon = els.linkTiresBtn.querySelector('.unlink-icon');
        if (tiresLinked) {
            linkIcon.classList.remove('hidden');
            unlinkIcon.classList.add('hidden');
            els.linkTiresBtn.classList.add('border-slate-600', 'bg-slate-800');
            els.linkTiresBtn.classList.remove('border-slate-500', 'bg-panel');
        } else {
            linkIcon.classList.add('hidden');
            unlinkIcon.classList.remove('hidden');
            els.linkTiresBtn.classList.remove('border-slate-600', 'bg-slate-800');
            els.linkTiresBtn.classList.add('border-slate-500', 'bg-panel');
        }
    };
}

if (els.tpressure_f && els.tpressure_r) {
    els.tpressure_f.addEventListener('input', (e) => {
        if (tiresLinked && !e.isTrusted === false) {
            els.tpressure_r.value = els.tpressure_f.value;
            updateSliderFill(els.tpressure_r);
            if (typeof window.update === "function") window.update();
        }
    });

    els.tpressure_r.addEventListener('input', (e) => {
        if (tiresLinked && !e.isTrusted === false) {
            els.tpressure_f.value = els.tpressure_r.value;
            updateSliderFill(els.tpressure_f);
            if (typeof window.update === "function") window.update();
        }
    });
}

// ── Track Data & Dropdown ──────────────────────────────────────────────────

function getTrackData(id) {
    const track = window.GLOBAL_TRACKS[id];
    if (!track) return null;

    if (track.parent && window.GLOBAL_TRACKS[track.parent]) {
        const parent = window.GLOBAL_TRACKS[track.parent];
        return {
            ...parent,
            ...track,
            characteristics: {
                ...(parent.characteristics || {}),
                ...(track.characteristics || {})
            }
        };
    }
    return track;
}

function initTracks() {
    if (!window.GLOBAL_TRACKS || !els.openTrackBtn || !els.trackDropdown) return;

    if (els.openTrackBtn) {
        els.openTrackBtn.onclick = (e) => {
            e.stopPropagation();
            const isShown = els.trackDropdown.classList.contains('show');
            if (isShown) {
                els.trackDropdown.classList.remove('show');
            } else {
                renderTrackDropdown();
                els.trackDropdown.classList.add('show');
            }
        };
    }

    window.addEventListener('click', (e) => {
        if (!els.trackDropdown.contains(e.target) && e.target !== els.openTrackBtn) {
            els.trackDropdown.classList.remove('show');
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            els.trackDropdown.classList.remove('show');
        }
    });
}

// ── Machine Dropdown ───────────────────────────────────────────────────────

function renderMachineDropdown() {
    if (!els.machineDropdown || !window.CARS) return;
    els.machineDropdown.innerHTML = '';

    // ── Assetto Corsa: show only AC cars ──────────────────────────────────────
    if (document.body.getAttribute('data-game') === 'ac' && window.AC_CARS) {
        const header = document.createElement('div');
        header.className = 'dropdown-category';
        header.style.color = '#ff6b35';
        header.innerText = 'TOURING';
        els.machineDropdown.appendChild(header);

        Object.entries(window.AC_CARS).forEach(([id, acCar]) => {
            const isActive = window.AC_App && window.AC_App.currentCarId === id;
            const btn = document.createElement('button');
            btn.className = `dropdown-item ${isActive ? 'active' : ''}`;
            btn.innerHTML = `<span class="track-name">${acCar.name}</span>`;
            btn.onclick = () => {
                if (window.AC_App) window.AC_App.loadCar(id);
                if (els.currentCar) els.currentCar.innerText = acCar.name.toUpperCase();
                if (els.currentCarClass) els.currentCarClass.innerText = acCar.class;
                els.machineDropdown.classList.remove('show');
            };
            els.machineDropdown.appendChild(btn);
        });
        return;
    }

    // ── LMU: show by class ────────────────────────────────────────────────────
    Object.entries(CAR_CATEGORIES).forEach(([className, { ids, color }]) => {
        const availableIds = ids.filter(id => window.CARS[id]);
        if (availableIds.length === 0) return;

        const header = document.createElement('div');
        header.className = 'dropdown-category';
        header.style.setProperty('color', color);
        header.innerText = className;
        els.machineDropdown.appendChild(header);

        availableIds.forEach(id => {
            const car = window.CARS[id];
            const isActive = CAR && CAR.id === id;
            const btn = document.createElement('button');
            btn.className = `dropdown-item ${isActive ? 'active' : ''}`;
            btn.innerHTML = `
                <span class="track-name">${car.name}</span>
            `;
            btn.onclick = () => {
                loadCar(id);
                if (els.currentCar) els.currentCar.innerText = car.name.toUpperCase();
                if (els.currentCarClass) els.currentCarClass.innerText = className;
                els.machineDropdown.classList.remove('show');
            };
            els.machineDropdown.appendChild(btn);
        });
    });
}

function initMachineDropdown() {
    if (!els.openGarageBtn || !els.machineDropdown) return;

    if (els.openGarageBtn) {
        els.openGarageBtn.onclick = (e) => {
            e.stopPropagation();
            const isShown = els.machineDropdown.classList.contains('show');
            if (isShown) {
                els.machineDropdown.classList.remove('show');
            } else {
                if (els.trackDropdown) els.trackDropdown.classList.remove('show');
                renderMachineDropdown();
                els.machineDropdown.classList.add('show');
            }
        };
    }

    window.addEventListener('click', (e) => {
        if (!els.machineDropdown.contains(e.target) && e.target !== els.openGarageBtn) {
            els.machineDropdown.classList.remove('show');
        }
    });
}

// ── Track Dropdown ─────────────────────────────────────────────────────────

function renderTrackDropdown() {
    if (!els.trackDropdown || !window.GLOBAL_TRACKS) return;
    els.trackDropdown.innerHTML = '';

    const tracks = window.GLOBAL_TRACKS;

    const categories = {
        "WEC World Championship": ['portimao', 'imola', 'interlagos', 'bahrain', 'cota', 'sarthe', 'fuji', 'lusail', 'monza', 'sebring', 'spa'],
        "European Le Mans Series": ['barcelona', 'paul_ricard', 'silverstone'],
        "Extra Layouts": []
    };

    const categorizedIds = new Set([...categories["WEC World Championship"], ...categories["European Le Mans Series"]]);

    Object.keys(tracks).forEach(id => {
        if (!categorizedIds.has(id) && !tracks[id].parent) {
            categories["Extra Layouts"].push(id);
        }
    });

    Object.entries(categories).forEach(([catName, ids]) => {
        if (ids.length === 0) return;

        const header = document.createElement('div');
        header.className = 'dropdown-category';
        header.innerText = catName;
        els.trackDropdown.appendChild(header);

        ids.forEach(id => {
            if (!tracks[id]) return;
            renderTrackItem(id, true);
            Object.entries(tracks).forEach(([childId, childTrack]) => {
                if (childTrack.parent === id) {
                    renderTrackItem(childId, false);
                }
            });
        });
    });

    function renderTrackItem(id, isParent) {
        const track = getTrackData(id);
        const isActive = SELECTED_TRACK_ID === id;
        const btn = document.createElement('button');
        btn.className = `dropdown-item ${isParent ? '' : 'nested'} ${isActive ? 'active' : ''}`;

        const stats = track.characteristics || {};

        const renderPips = (val, isWarn = false) => {
            const count = Math.round(val / 2);
            return `<div class="pip-row">${Array(5).fill(0).map((_, i) => `<div class="mini-pip ${i < count ? 'active' : ''} ${isWarn && i < count ? 'warn' : ''}"></div>`).join('')}</div>`;
        };

        btn.innerHTML = `
            <div class="flex items-center gap-2">
                ${!isParent ? '<span class="track-branch text-slate-600 font-mono">└───</span>' : ''}
                <span class="track-name ${!isParent ? 'text-[11px] opacity-90' : ''}">${track.shortName || track.name}</span>
            </div>
            <div class="flex items-center gap-3 mt-0.5 ${!isParent ? 'ml-12' : ''}">
                <span class="track-info">${track.location || ''}</span>
                <div class="track-indicators">
                    ${stats.technicality ? `<div class="pip-labeled"><span class="pip-label">TECH</span>${renderPips(stats.technicality)}</div>` : ''}
                    ${stats.bumps ? `<div class="pip-labeled"><span class="pip-label warn">BUMP</span>${renderPips(stats.bumps, true)}</div>` : ''}
                </div>
            </div>
        `;

        btn.onclick = () => {
            selectTrack(id);
            els.trackDropdown.classList.remove('show');
        };
        els.trackDropdown.appendChild(btn);
    }
}

function selectTrack(id) {
    SELECTED_TRACK_ID = id;
    const track = getTrackData(id);
    if (track && els.currentTrack) {
        els.currentTrack.innerText = (track.shortName || track.name).toUpperCase();

        const locationSpan = document.querySelector('.location-subtext');
        if (locationSpan) {
            locationSpan.innerText = (track.location || 'FRANCE').toUpperCase();
        }

        update();
    }
}

// ── Generic Hover Tooltips ─────────────────────────────────────────────────

function initTooltips() {
    const tooltip = document.createElement('div');
    tooltip.id = 'lma-tooltip';
    tooltip.className = 'lma-tooltip hide';
    document.body.appendChild(tooltip);

    document.querySelectorAll('.cursor-help[title]').forEach(el => {
        el.dataset.tooltip = el.getAttribute('title');
        el.removeAttribute('title');
    });

    let activeEl = null;

    const show = (el, ev) => {
        const txt = el.dataset.tooltip || el.getAttribute('data-tooltip');
        if (!txt) return;
        activeEl = el;
        tooltip.innerHTML = txt;
        tooltip.classList.remove('hide');
        tooltip.classList.add('show');
        position(ev);
    };

    const position = (ev) => {
        if (!tooltip || !activeEl) return;
        const mouseX = ev.clientX || (ev.touches && ev.touches[0] && ev.touches[0].clientX) || window.innerWidth / 2;
        const mouseY = ev.clientY || (ev.touches && ev.touches[0] && ev.touches[0].clientY) || window.innerHeight / 2;
        tooltip.style.display = 'block';
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';
        const rect = tooltip.getBoundingClientRect();
        let x = mouseX + 12;
        let y = mouseY + 12;
        if (x + rect.width > window.innerWidth - 8) x = mouseX - rect.width - 12;
        if (y + rect.height > window.innerHeight - 8) y = mouseY - rect.height - 12;
        if (x < 8) x = 8;
        if (y < 8) y = 8;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    };

    const hide = (el) => {
        activeEl = null;
        tooltip.classList.remove('show');
        tooltip.classList.add('hide');
        setTimeout(() => { if (!activeEl) tooltip.style.display = 'none'; }, 120);
    };

    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest('.cursor-help, [data-tooltip]');
        if (el) show(el, e);
    });

    document.addEventListener('mousemove', (e) => {
        if (activeEl) position(e);
    });

    document.addEventListener('mouseout', (e) => {
        const el = e.target.closest('.cursor-help, [data-tooltip]');
        if (el) hide(el);
    });

    document.addEventListener('touchstart', (e) => {
        const el = e.target.closest('.cursor-help, [data-tooltip]');
        if (el) {
            show(el, e.touches[0]);
            setTimeout(() => hide(el), 2200);
        }
    });
}

// ── View Switcher ──────────────────────────────────────────────────────────

function switchView(target) {
    const views = ['radar', 'bars'];
    views.forEach(v => {
        const btn = els[`view${v.charAt(0).toUpperCase() + v.slice(1)}`];
        const view = els[`${v}View`];
        if (!btn || !view) return;

        if (v === target) {
            view.classList.remove('hidden');
            if (v === 'bars' || v === 'radar') view.classList.add('flex');

            btn.classList.remove('text-slate-500', 'hover:text-slate-300', 'border-transparent', 'hover:border-white/10');
            btn.classList.add('text-white', 'font-bold', 'bg-blue-500/20', 'border-blue-500/50', 'hover:bg-blue-500/40');
        } else {
            view.classList.add('hidden');
            if (v === 'bars' || v === 'radar') view.classList.remove('flex');

            btn.classList.add('text-slate-500', 'hover:text-slate-300', 'border-transparent', 'hover:border-white/10');
            btn.classList.remove('text-white', 'font-bold', 'bg-blue-500/20', 'border-blue-500/50', 'hover:bg-blue-500/40');
        }
    });
}

if (els.viewRadar) els.viewRadar.onclick = () => switchView('radar');
if (els.viewBars) els.viewBars.onclick = () => switchView('bars');
