let CAR = (window.CARS && window.CARS['bmw_m4_lmgt3']) ? window.CARS['bmw_m4_lmgt3'] : null;
if (!CAR && window.CARS) CAR = Object.values(window.CARS)[0];
const gatherDefaults = (structure) => {
    const defs = {};
    structure.forEach(group => {
        group.items.forEach(item => {
            defs[item.id] = item.default;
        });
    });
    return defs;
};
let DEFAULTS = CAR.setupStructure ? gatherDefaults(CAR.setupStructure) : CAR.defaults;
let PRESETS = CAR.presets;
let PHYSICS_DATA = null;
let SELECTED_TRACK_ID = 'sarthe';

async function initPhysics() {
    try {
        const [lmgt3Res, lmp2Res, lmp3Res] = await Promise.all([
            fetch('js/cars/lmgt3/physics_lmgt3.json'),
            fetch('js/cars/lmp2/physics_lmp2.json'),
            fetch('js/cars/lmp3/physics_lmp3.json')
        ]);

        const lmgt3Data = await lmgt3Res.json();
        const lmp2Data = await lmp2Res.json();
        const lmp3Data = await lmp3Res.json();

        PHYSICS_DATA = {
            cars: [...(lmgt3Data.cars || []), ...(lmp2Data.cars || []), ...(lmp3Data.cars || [])]
        };

        if (CAR && CAR.id && PHYSICS_DATA.cars) {
            const p = PHYSICS_DATA.cars.find(c => c.id === CAR.id);
            if (p) CAR.physics = { ...CAR.physics, ...p };
        }
        update();
    } catch (e) {
        console.error("Failed to load physics JSON files", e);
    }
}
initPhysics();

const els = {
    tpressure_f: document.getElementById('tpressure_f'),
    tpressure_r: document.getElementById('tpressure_r'),
    fcam: document.getElementById('fcam'),
    rcam: document.getElementById('rcam'),
    bias: document.getElementById('bias'),
    fbd: document.getElementById('fbd'),
    rbd: document.getElementById('rbd'),
    fs: document.getElementById('fs'),
    rs: document.getElementById('rs'),
    fpk: document.getElementById('fpk'),
    rpk: document.getElementById('rpk'),
    third_Fspring: document.getElementById('third_Fspring'),
    third_fpk: document.getElementById('third_fpk'),
    third_Rspring: document.getElementById('third_Rspring'),
    third_rpk: document.getElementById('third_rpk'),
    fh: document.getElementById('fh'),
    rh: document.getElementById('rh'),
    fsb: document.getElementById('fsb'),
    fsr: document.getElementById('fsr'),
    ffb: document.getElementById('ffb'),
    ffr: document.getElementById('ffr'),
    rsb: document.getElementById('rsb'),
    rsr: document.getElementById('rsr'),
    rfb: document.getElementById('rfb'),
    rfr: document.getElementById('rfr'),
    ftoe: document.getElementById('ftoe'),
    rtoe: document.getElementById('rtoe'),
    farb: document.getElementById('farb'),
    rarb: document.getElementById('rarb'),
    wing: document.getElementById('wing'),
    tender_f: document.getElementById('tender_f'),

    // Radar Targets
    ghostPoly: document.getElementById('ghostPoly'),
    barTargetDf: document.getElementById('barTargetDf'),
    barTargetGr: document.getElementById('barTargetGr'),
    barTargetTu: document.getElementById('barTargetTu'),
    barTargetBu: document.getElementById('barTargetBu'),
    barTargetTs: document.getElementById('barTargetTs'),

    // Readouts
    tp_fV: document.getElementById('tp_fV'),
    tp_rV: document.getElementById('tp_rV'),
    fcV: document.getElementById('fcV'),
    rcV: document.getElementById('rcV'),
    bV: document.getElementById('bV'),
    fbdV: document.getElementById('fbdV'),
    rbdV: document.getElementById('rbdV'),
    fsV: document.getElementById('fsV'),
    rsV: document.getElementById('rsV'),
    fpkV: document.getElementById('fpkV'),
    rpkV: document.getElementById('rpkV'),
    third_FspringV: document.getElementById('third_FspringV'),
    third_fpkV: document.getElementById('third_fpkV'),
    third_RspringV: document.getElementById('third_RspringV'),
    third_rpkV: document.getElementById('third_rpkV'),
    fhV: document.getElementById('fhV'),
    rhV: document.getElementById('rhV'),
    ftoeV: document.getElementById('ftoeV'),
    rtoeV: document.getElementById('rtoeV'),
    farbV: document.getElementById('farbV'),
    rarbV: document.getElementById('rarbV'),
    wingV: document.getElementById('wingV'),
    tender_fV: document.getElementById('tender_fV'),
    rakeV: document.getElementById('rakeV'),
    recoBias: document.getElementById('recoBias'),

    // Dampers Values
    fsbV: document.getElementById('fsbV'),
    fsrV: document.getElementById('fsrV'),
    ffbV: document.getElementById('ffbV'),
    ffrV: document.getElementById('ffrV'),
    rsbV: document.getElementById('rsbV'),
    rsrV: document.getElementById('rsrV'),
    rfbV: document.getElementById('rfbV'),
    rfrV: document.getElementById('rfrV'),

    // Clicks (now bound to labels)
    tp_fC: document.getElementById('tp_fC_label'),
    tp_rC: document.getElementById('tp_rC_label'),
    fcC: document.getElementById('fcC_label'),
    rcC: document.getElementById('rcC_label'),
    bC: document.getElementById('bC_label'),
    fbdC: document.getElementById('fbdC_label'),
    rbdC: document.getElementById('rbdC_label'),
    fsC: document.getElementById('fsC_label'),
    rsC: document.getElementById('rsC_label'),
    fpkC: document.getElementById('fpkC_label'),
    rpkC: document.getElementById('rpkC_label'),
    third_FspringC: document.getElementById('third_FspringC_label'),
    third_fpkC: document.getElementById('third_fpkC_label'),
    third_RspringC: document.getElementById('third_RspringC_label'),
    third_rpkC: document.getElementById('third_rpkC_label'),
    fhC: document.getElementById('fhC_label'),
    rhC: document.getElementById('rhC_label'),
    fsbC: document.getElementById('fsbC_label'),
    fsrC: document.getElementById('fsrC_label'),
    ffbC: document.getElementById('ffbC_label'),
    ffrC: document.getElementById('ffrC_label'),
    rsbC: document.getElementById('rsbC_label'),
    rsrC: document.getElementById('rsrC_label'),
    rfbC: document.getElementById('rfbC_label'),
    rfrC: document.getElementById('rfrC_label'),
    ftoeC: document.getElementById('ftoeC_label'),
    rtoeC: document.getElementById('rtoeC_label'),
    farbC: document.getElementById('farbC_label'),
    rarbC: document.getElementById('rarbC_label'),
    wingC: document.getElementById('wingC_label'),
    tender_fC: document.getElementById('tender_fC_label'),

    // Chart & Aero
    spider: document.getElementById('spiderPoly'),
    ghost: document.getElementById('ghostPoly'),
    cop: document.getElementById('cop'),
    fP: document.getElementById('fP'),
    rP: document.getElementById('rP'),
    steerStatus: document.getElementById('steerStatus'),
    sync: document.getElementById('sync'),
    linkTiresBtn: document.getElementById('linkTiresBtn'),

    viewRadarBtn: document.getElementById('viewRadar'),
    viewBarsBtn: document.getElementById('viewBars'),
    radarView: document.getElementById('radarView'),
    barsView: document.getElementById('barsView'),

    modeBasic: document.getElementById('modeBasic'),
    modeAdvanced: document.getElementById('modeAdvanced'),
    carName: document.getElementById('carName'),

    // Environment UI
    trackTemp: document.getElementById('trackTemp'),
    trackTempV: document.getElementById('trackTempV'),
    weatherChips: document.getElementById('weatherChips'),
    tempPresets: document.getElementById('tempPresets'),

    // Garage
    openGarageBtn: document.getElementById('openGarageBtn'),
    closeGarageBtn: document.getElementById('closeGarageBtn'),
    garageOverlay: document.getElementById('garageOverlay'),
    garageGrid: document.getElementById('garageGrid'),
    currentCar: document.getElementById('currentCar'),
    currentCarClass: document.getElementById('currentCarClass'),
    machineDropdown: document.getElementById('machineDropdown'),

    // Thermal Grid
    tyreFL: document.getElementById('tyreFL'),
    tyreFR: document.getElementById('tyreFR'),
    tyreRL: document.getElementById('tyreRL'),
    tyreRR: document.getElementById('tyreRR'),
    dampFL: document.getElementById('dampFL'),
    dampFR: document.getElementById('dampFR'),
    dampRL: document.getElementById('dampRL'),
    dampRR: document.getElementById('dampRR'),

    // Fuel Calculator
    fuelModeTime: document.getElementById('fuelModeTime'),
    fuelModeLaps: document.getElementById('fuelModeLaps'),
    fuelTimeInputs: document.getElementById('fuelTimeInputs'),
    fuelLapsInput: document.getElementById('fuelLapsInput'),
    fuelHours: document.getElementById('fuelHours'),
    fuelMinutes: document.getElementById('fuelMinutes'),
    fuelTotalLaps: document.getElementById('fuelTotalLaps'),
    fuelLapMin: document.getElementById('fuelLapMin'),
    fuelLapSec: document.getElementById('fuelLapSec'),
    fuelLapMs: document.getElementById('fuelLapMs'),
    fuelPerLapInput: document.getElementById('fuelPerLapInput'),
    fuelResultLaps: document.getElementById('fuelResultLaps'),
    fuelResultFuel: document.getElementById('fuelResultFuel'),
    fuelResultSafety: document.getElementById('fuelResultSafety'),

    // Track Selection
    openTrackBtn: document.getElementById('openTrackBtn'),
    trackDropdown: document.getElementById('trackDropdown'),
    currentTrack: document.getElementById('currentTrack'),
    trackAdvice: document.getElementById('trackAdvice'),
};

let currentCompound = 'MEDIUM';
let targetB = DEFAULTS.bias;

if (CAR.setupStructure) {
    CAR.setupStructure.forEach(group => {
        group.items.forEach(item => {
            if (els[item.id]) {
                const input = els[item.id];
                if (item.type === 'labeled') {
                    input.min = 0;
                    input.max = item.options.length - 1;
                    input.step = 1;
                } else {
                    input.min = item.min;
                    input.max = item.max;
                    input.step = item.step;
                }
                input.value = item.default;
                updateSliderFill(input);
            }
        });
    });
} else if (CAR.ranges) {
    Object.entries(CAR.ranges).forEach(([key, range]) => {
        if (els[key]) {
            els[key].min = range.min;
            els[key].max = range.max;
            els[key].step = range.step;
            els[key].value = DEFAULTS[key];
            updateSliderFill(els[key]);
        }
    });
}


function setAppMode(mode) {
    if (mode === 'advanced') {
        document.body.classList.remove('mode-basic');
        els.modeAdvanced.classList.add('active');
        els.modeBasic.classList.remove('active');
    } else {
        document.body.classList.add('mode-basic');
        els.modeBasic.classList.add('active');
        els.modeAdvanced.classList.remove('active');
    }
    localStorage.setItem('lma_mode', mode);
}

els.modeBasic.onclick = () => setAppMode('basic');
els.modeAdvanced.onclick = () => setAppMode('advanced');

const savedMode = localStorage.getItem('lma_mode') || 'basic';
setAppMode(savedMode);

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

const CAR_CATEGORIES = {
    'LMGT3': { ids: ['bmw_m4_lmgt3', 'chevrolet_corvette_Z06_r', 'ferrari_296_lmgt3', 'ford_mustang_lmgt3', 'lamborghini_huracan_lmgt3_evo2', 'lexus_rcf_lmgt3', 'mclaren_720s_lmgt3_evo', 'mercedes_amg_lmgt3'], color: '#0ea5e9' },
    'LMP2': { ids: ['oreca_07_gibson_lmp2'], color: '#10b981' },
    'LMP3': { ids: ['ginetta_g61_lmp3', 'ligier_js_p325_lmp3'], color: '#f59e0b' },
};

const CLASS_GHOST_SCALE = {
    'LMGT3': 0.6,
    'LMP2': 0.8,
    'LMP3': 0.7
};

function getCarGhostScale() {
    if (!CAR) return 1;
    for (const [cls, { ids }] of Object.entries(CAR_CATEGORIES)) {
        if (ids.includes(CAR.id)) {
            return CLASS_GHOST_SCALE[cls] ?? 1;
        }
    }
    return 1;
}


function renderMachineDropdown() {
    if (!els.machineDropdown || !window.CARS) return;
    els.machineDropdown.innerHTML = '';

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
                <div class="flex items-center gap-2 mt-0.5">
                    <span class="track-info">${className}</span>
                </div>
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

    window.addEventListener('click', (e) => {
        if (!els.machineDropdown.contains(e.target) && e.target !== els.openGarageBtn) {
            els.machineDropdown.classList.remove('show');
        }
    });
}

initMachineDropdown();

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

initTracks();

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

initTooltips();

function updateSliderFill(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.setProperty('--val', pct + '%');
}

function getPt(angle, val) {
    const r = (val / 100) * 80;
    const rad = (angle - 90) * Math.PI / 180;
    return `${100 + r * Math.cos(rad)},${100 + r * Math.sin(rad)}`;
}

const clamp = (v, min = 5, max = 100) => Math.min(max, Math.max(min, v));

const getItemConfig = (id) => window.LMA_Utils.getItemConfig(CAR, id);
const getParamRange = (id) => window.LMA_Utils.getParamRange(CAR, id);

const getArbLabel = (val, type = 'farb') => {
    const config = getItemConfig(type);
    if (config && config.type === 'labeled') {
        const opt = config.options[val];
        return typeof opt === 'object' ? opt.label : opt;
    }
    if (CAR.ranges && CAR.ranges[type] && CAR.ranges[type].labels) {
        return CAR.ranges[type].labels[val] || val;
    }
    return val === 0 ? 'Detached' : `P${val}`;
};

function update() {
    if (els.carName && CAR) {
        els.carName.innerText = CAR.name.toUpperCase();
    }

    const vals = {};
    Object.keys(DEFAULTS).forEach(key => {
        vals[key] = Math.round(parseFloat(els[key].value) * 10000000) / 10000000;
    });

    const setLabel = (readoutId, val, setupId = null) => {
        if (els[readoutId + 'V']) {
            let displayVal = val;
            const config = getItemConfig(setupId || readoutId);
            if (config) {
                if (config.reverse && typeof val === 'number') {
                    displayVal = (config.max + config.min) - val;
                }

                if (config.type === 'labeled') {
                    const opt = config.options[val];
                    displayVal = opt !== undefined ? (typeof opt === 'object' ? opt.label : opt) : val;
                } else if (typeof displayVal === 'number') {
                    let decimals = 0;
                    if (config.step !== undefined) {
                        const stepStr = config.step.toString();
                        decimals = stepStr.indexOf('.') > -1 ? stepStr.split('.')[1].length : 0;
                    }
                    const unit = config.unit || '';
                    if (unit === 'mm' || unit === 'cm') decimals = Math.min(decimals, 1);
                    else decimals = Math.min(decimals, 3);
                    displayVal = displayVal.toFixed(decimals);
                }

                if (config.unit && typeof displayVal === 'string' && !displayVal.includes(config.unit)) {
                    let unit = config.unit;
                    if (unit === 'deg') unit = '°';
                    displayVal = parseFloat(displayVal).toFixed(2) + unit;
                }

                if (config.prefix && typeof displayVal === 'string' && !displayVal.startsWith(config.prefix)) {
                    displayVal = config.prefix + displayVal;
                }
            } else if (CAR.ranges && CAR.ranges[readoutId]) {
                const range = CAR.ranges[readoutId];
                if (range.labelPrefix) displayVal = range.labelPrefix + val;
                if (range.labels) displayVal = range.labels[val] || val;
            }
            els[readoutId + 'V'].innerText = displayVal;
        }
    };

    // Wheels & Brakes
    setLabel('tp_f', vals.tpressure_f, 'tpressure_f');
    setLabel('tp_r', vals.tpressure_r, 'tpressure_r');
    setLabel('fc', vals.fcam, 'fcam');
    setLabel('rc', vals.rcam, 'rcam');
    els.bV.innerText = `${vals.bias.toFixed(1)}:${(100 - vals.bias).toFixed(1)}%`;

    const getDuctLabels = (id) => {
        const config = getItemConfig(id);
        if (config && config.type === 'labeled') {
            return config.options.map(o => typeof o === 'object' ? o.label : o);
        }
        return (CAR.ranges && CAR.ranges[id] && CAR.ranges[id].labels)
            ? CAR.ranges[id].labels
            : ['Open', '33%', '67%', 'Closed'];
    };
    setLabel('fbd', vals.fbd);
    setLabel('rbd', vals.rbd);

    // Suspension
    let fsVal = CAR.formatters && CAR.formatters.fs ? CAR.formatters.fs(vals.fs) : vals.fs;
    let rsVal = CAR.formatters && CAR.formatters.rs ? CAR.formatters.rs(vals.rs) : vals.rs;

    setLabel('fs', fsVal, 'fs');
    setLabel('rs', rsVal, 'rs');
    setLabel('fpk', vals.fpk, 'fpk');
    setLabel('rpk', vals.rpk, 'rpk');

    if (vals.third_Fspring !== undefined) {
        let third_FspringVal = CAR.formatters && CAR.formatters.third_Fspring ? CAR.formatters.third_Fspring(vals.third_Fspring) : vals.third_Fspring;
        let third_RspringVal = CAR.formatters && CAR.formatters.third_Rspring ? CAR.formatters.third_Rspring(vals.third_Rspring) : vals.third_Rspring;
        setLabel('third_Fspring', third_FspringVal, 'third_Fspring');
        setLabel('third_Rspring', third_RspringVal, 'third_Rspring');
        setLabel('third_fpk', vals.third_fpk, 'third_fpk');
        setLabel('third_rpk', vals.third_rpk, 'third_rpk');
    }
    setLabel('fh', vals.fh, 'fh');
    setLabel('rh', vals.rh, 'rh');

    // Dampers
    setLabel('fsb', vals.fsb);
    setLabel('fsr', vals.fsr);
    setLabel('ffb', vals.ffb);
    setLabel('ffr', vals.ffr);
    setLabel('rsb', vals.rsb);
    setLabel('rsr', vals.rsr);
    setLabel('rfb', vals.rfb);
    setLabel('rfr', vals.rfr);

    // Chassis & Aero
    setLabel('ftoe', vals.ftoe, 'ftoe');
    setLabel('rtoe', vals.rtoe, 'rtoe');
    setLabel('farb', vals.farb, 'farb');
    setLabel('rarb', vals.rarb, 'rarb');
    setLabel('wing', vals.wing, 'wing');
    setLabel('tender_f', vals.tender_f, 'tender_f');

    // Rake calculation
    const rhConfig = getItemConfig('rh');
    const rhUnit = (rhConfig && rhConfig.unit) ? rhConfig.unit : 'cm';
    const rake = parseFloat((vals.rh - vals.fh).toFixed(8));
    let rakeDecimals = 1;
    if (rhConfig && rhConfig.step !== undefined) {
        const stepStr = rhConfig.step.toString();
        rakeDecimals = stepStr.indexOf('.') > -1 ? stepStr.split('.')[1].length : 0;
    }
    els.rakeV.innerText = `${rake >= 0 ? '+' : ''}${rake.toFixed(rakeDecimals)}${rhUnit}`;

    const defRake = DEFAULTS.rh - DEFAULTS.fh;
    const rhRange = getParamRange('rh');
    const fhRange = getParamRange('fh');
    const maxPossibleRake = rhRange.max - fhRange.min;
    const minPossibleRake = rhRange.min - fhRange.max;
    const rakeSpan = Math.abs(maxPossibleRake - minPossibleRake) || 1;
    const nRakeDelta = ((rake - defRake) / rakeSpan);
    const wingRange = getParamRange('wing');
    const wingSpan = Math.abs(wingRange.max - wingRange.min) || 1;
    const nWingDelta = (vals.wing - DEFAULTS.wing) / wingSpan;
    const bRange = getParamRange('bias');
    const biasSpan = Math.abs(bRange.max - bRange.min) || 1;
    targetB = DEFAULTS.bias
        + nRakeDelta * (biasSpan * 0.20)
        - nWingDelta * (biasSpan * 0.08);
    targetB = Math.round(targetB * 10) / 10;
    targetB = Math.min(bRange.max, Math.max(bRange.min, targetB));
    els.recoBias.innerText = `${targetB.toFixed(1)}:${(100 - targetB).toFixed(1)}`;

    if (window.GLOBAL_TRACKS && SELECTED_TRACK_ID) {
        let track = getTrackData(SELECTED_TRACK_ID);

        if (els.trackAdvice) {
            els.trackAdvice.innerText = track.setupAdvice || "Focus on a balanced setup for this track's specific layout.";
        }
    }

    const phys = CAR.physics || {};
    const weightDistF = phys.weight_dist_f ?? 0.50;
    const wheelbase = phys.wheelbase_m ?? 2.7;
    const motionRatioF = phys.motion_ratio?.front ?? 0.8;
    const motionRatioR = phys.motion_ratio?.rear ?? 0.8;
    const aero = phys.aero || {};
    const baseCl = aero.base_cl ?? -3.0;
    const baseCd = aero.base_cd ?? 0.7;
    const copFront = aero.cop_front ?? 0.40;

    const naturalBalance = phys.naturalBalance ?? 0.0;
    const mechanicalBias = weightDistF;
    const aeroSensitivity = phys.aeroSensitivity ?? 1.0;
    const damperCurve = phys.damperCurve || 'linear';
    const tyreWindow = phys.tyreWindow || [80, 90];

    const getRangeDelta = (id) => {
        const r = getParamRange(id);
        return Math.abs(r.max - r.min) || 1;
    };

    const getPhysVal = (id, sliderVal) => {
        const config = getItemConfig(id);
        if (config && config.type === 'labeled') {
            const opt = config.options[sliderVal];
            return (typeof opt === 'object' && opt.value !== undefined) ? opt.value : sliderVal;
        }
        return sliderVal;
    };

    const norm = (id, v) => {
        const physV = getPhysVal(id, v);
        let defaultVal = DEFAULTS[id];
        if (defaultVal === undefined) {
            const df = DEFAULTS[`${id}_f`] ?? 0;
            const dr = DEFAULTS[`${id}_r`] ?? 0;
            defaultVal = (df + dr) / 2;
        }
        return (physV - defaultVal) / getRangeDelta(id);
    };

    const optPress = (CAR.physics?.tyre_physics?.compound_medium?.optimal_pressure_kpa) || 190;

    const fsbRange = getParamRange('fsb');
    const fsrRange = getParamRange('fsr');
    const ffbRange = getParamRange('ffb');
    const ffrRange = getParamRange('ffr');

    const rsbRange = getParamRange('rsb');
    const rsrRange = getParamRange('rsr');
    const rfbRange = getParamRange('rfb');
    const rfrRange = getParamRange('rfr');

    const fSlowRange = (fsbRange.max + fsrRange.max) / 2;
    const fFastRange = (ffbRange.max + ffrRange.max) / 2;
    const rSlowRange = (rsbRange.max + rsrRange.max) / 2;
    const rFastRange = (rfbRange.max + rfrRange.max) / 2;

    const fDampRange = (fsbRange.max + fsrRange.max + ffbRange.max + ffrRange.max) / 4;
    const rDampRange = (rsbRange.max + rsrRange.max + rfbRange.max + rfrRange.max) / 4;

    const nWing = norm('wing', vals.wing);
    const nFARB = norm('farb', vals.farb);
    const nRARB = norm('rarb', vals.rarb);
    const nFS = norm('fs', vals.fs);
    const nRS = norm('rs', vals.rs);
    const nFH = norm('fh', vals.fh);
    const nRH = norm('rh', vals.rh);
    const nFToe = norm('ftoe', vals.ftoe);
    const nRToe = norm('rtoe', vals.rtoe);
    const nFCam = norm('fcam', vals.fcam);
    const nRCam = norm('rcam', vals.rcam);
    const nBias = norm('bias', vals.bias);
    const nPressF = (vals.tpressure_f - optPress) / (getRangeDelta('tpressure_f') || 1);
    const nPressR = (vals.tpressure_r - optPress) / (getRangeDelta('tpressure_r') || 1);
    const nFBD = norm('fbd', vals.fbd);
    const nRBD = norm('rbd', vals.rbd);

    const nFSB = (vals.fsb - DEFAULTS.fsb) / (fSlowRange || 1);
    const nFSR = (vals.fsr - DEFAULTS.fsr) / (fSlowRange || 1);
    const nRSB = (vals.rsb - DEFAULTS.rsb) / (rSlowRange || 1);
    const nRSR = (vals.rsr - DEFAULTS.rsr) / (rSlowRange || 1);
    const nFFB = (vals.ffb - DEFAULTS.ffb) / (fFastRange || 1);
    const nFFR = (vals.ffr - DEFAULTS.ffr) / (fFastRange || 1);
    const nRFB = (vals.rfb - DEFAULTS.rfb) / (rFastRange || 1);
    const nRFR = (vals.rfr - DEFAULTS.rfr) / (rFastRange || 1);

    const nFSlow = (nFSB + nFSR) / 2;
    const nRSlow = (nRSB + nRSR) / 2;
    const nFFast = (nFFB + nFFR) / 2;
    const nRFast = (nRFB + nRFR) / 2;

    const shapeDamp = (v) => {
        if (damperCurve === 'progressive') return v > 0 ? Math.min(v * v * 2.5, 1) : v;
        if (damperCurve === 'digressive') return v > 0 ? Math.min(Math.sqrt(v) * 1.2, 1) : v;
        return v;
    };
    const sFSlow = shapeDamp(nFSlow);
    const sRSlow = shapeDamp(nRSlow);
    const sFFast = shapeDamp(nFFast);
    const sRFast = shapeDamp(nRFast);

    let nHSS = 0;
    const fpkRange = getParamRange('fpk');
    const rpkRange = getParamRange('rpk');

    let nPkr = ((vals.fpk + vals.rpk) - (DEFAULTS.fpk + DEFAULTS.rpk)) /
        ((Math.abs(fpkRange.max - fpkRange.min) + Math.abs(rpkRange.max - rpkRange.min)) / 2 || 1);

    if (vals.third_Fspring !== undefined) {
        const tfRange = getParamRange('third_Fspring');
        const trRange = getParamRange('third_Rspring');
        const tfpkRange = getParamRange('third_fpk');
        const trpkRange = getParamRange('third_rpk');

        const f3 = (vals.third_Fspring - DEFAULTS.third_Fspring) / (Math.abs(tfRange.max - tfRange.min) || 1);
        const r3 = (vals.third_Rspring - DEFAULTS.third_Rspring) / (Math.abs(trRange.max - trRange.min) || 1);
        nHSS = (f3 + r3) / 2;
        const f3pk = (vals.third_fpk - DEFAULTS.third_fpk) / (Math.abs(tfpkRange.max - tfpkRange.min) || 1);
        const r3pk = (vals.third_rpk - DEFAULTS.third_rpk) / (Math.abs(trpkRange.max - trpkRange.min) || 1);
        nPkr = (nPkr + (f3pk + r3pk) / 2) / 2;
    }

    const fhConfig = getItemConfig('fh');
    const fhAbs = (fhConfig && fhConfig.unit === 'mm') ? vals.fh / 10 : vals.fh;
    const stallThreshold = 4.8;
    const groundEffect = fhAbs < stallThreshold
        ? Math.max(0.5, 1 - ((stallThreshold - fhAbs) * 1.5))
        : Math.min(1 + (6.5 - Math.max(fhAbs, 4.8)) * 0.15, 1.25);

    const rhConfigAero = getItemConfig('rh');
    const normRake = (rhConfigAero && rhConfigAero.unit === 'mm') ? (vals.rh - vals.fh) / 10 : (vals.rh - vals.fh);
    const normDefRake = (rhConfigAero && rhConfigAero.unit === 'mm') ? (DEFAULTS.rh - DEFAULTS.fh) / 10 : (DEFAULTS.rh - DEFAULTS.fh);

    const nRakeRaw = (normRake - normDefRake) / 5.0;
    const nRake = nRakeRaw * (wheelbase / 2.7);

    const diffuserLoad = nRake * 0.35 * aeroSensitivity;

    const totalDownforceRaw = clamp(50
        + (baseCl / -3.0) * 20
        + nWing * 34 * aeroSensitivity
        + diffuserLoad * 20
        + nHSS * 7
        + nPkr * 4
        - Math.max(0, nRake - 1.2) * 45
    );
    const totalDownforce = clamp(totalDownforceRaw * groundEffect);

    const copShift = nWing * 20 * aeroSensitivity
        + nRake * (-25)
        + nFH * 10
        + (0.40 - copFront) * 50;

    const fRollStiff = (nFARB * 26 + nFS * 11) * motionRatioF;
    const rRollStiff = (nRARB * 26 + nRS * 11) * motionRatioR;
    const lltd = (fRollStiff - rRollStiff) * (0.4 + mechanicalBias);

    const trackTemp = parseFloat(els.trackTemp.value);
    const weatherVal = document.querySelector('.weather-chip.active')?.dataset.value || 'clear';
    const weatherFactors = { 'clear': 0, 'cloudy': -5, 'drizzle': -12, 'rain': -20, 'storm': -30 };
    const weatherFactor = weatherFactors[weatherVal] ?? 0;
    const baseHeat = trackTemp + weatherFactor;

    const fDuctHeat = getPhysVal('fbd', vals.fbd) * 26;
    const rDuctHeat = getPhysVal('rbd', vals.rbd) * 20;

    const fSpringHeatMod = nFS * 5;
    const rSpringHeatMod = nRS * 5;

    const fHystHeat = Math.max(0, (optPress + 5 - vals.tpressure_f) * 0.35);
    const rHystHeat = Math.max(0, (optPress + 5 - vals.tpressure_r) * 0.35);


    const fBaseHeat = Math.max(trackTemp, baseHeat + fDuctHeat + fSpringHeatMod + fHystHeat + 30);
    const rBaseHeat = Math.max(trackTemp, baseHeat + rDuctHeat + rSpringHeatMod + rHystHeat + 26);

    const fSlipProxy = Math.abs(vals.fcam) * 0.7 + Math.abs(vals.ftoe) * 0.3;
    const rSlipProxy = Math.abs(vals.rcam) * 0.7 + Math.abs(vals.rtoe) * 0.3;
    const fSlipHeat = fSlipProxy * 10;
    const rSlipHeat = rSlipProxy * 10;

    const fCamberLoadShift = -vals.fcam * 5;
    const rCamberLoadShift = -vals.rcam * 5;

    const heatF_O = fBaseHeat
        + fSlipHeat * (vals.fcam > -1 ? 1.0 : 0.5)
        + Math.max(0, vals.fcam) * 2;
    const heatR_O = rBaseHeat
        + rSlipHeat * (vals.rcam > -1 ? 1.0 : 0.5)
        + Math.max(0, vals.rcam) * 2;

    const heatF_I = fBaseHeat
        + fSlipHeat * (vals.fcam < 0 ? 0.6 : 0.2)
        + Math.max(0, fCamberLoadShift);
    const heatR_I = rBaseHeat
        + rSlipHeat * (vals.rcam < 0 ? 0.6 : 0.2)
        + Math.max(0, rCamberLoadShift);

    const fPressShift = (vals.tpressure_f - optPress) * 0.43;
    const rPressShift = (vals.tpressure_r - optPress) * 0.43;

    const heatF_C = Math.max(trackTemp, (heatF_I + heatF_O) * 0.5 + fPressShift);
    const heatR_C = Math.max(trackTemp, (heatR_I + heatR_O) * 0.5 + rPressShift);

    const heatF = heatF_C;
    const heatR = heatR_C;

    const compoundProfiles = {
        'SOFT': { peak: 1.06, lo: 70, hi: 85, degrade: 0.022, wetGrip: 0.44 },
        'MEDIUM': { peak: 1.00, lo: tyreWindow[0], hi: tyreWindow[1], degrade: 0.013, wetGrip: 0.50 },
        'HARD': { peak: 0.96, lo: 75, hi: 96, degrade: 0.008, wetGrip: 0.52 },
        'WET': { peak: 0.88, lo: 40, hi: 68, degrade: 0.032, wetGrip: 1.00 },
        'INTER': { peak: 0.93, lo: 55, hi: 78, degrade: 0.020, wetGrip: 0.88 }
    };
    const cmpProfile = compoundProfiles[currentCompound] || compoundProfiles['MEDIUM'];

    const moistureLevel = { 'clear': 0, 'cloudy': 0.04, 'drizzle': 0.35, 'rain': 0.75, 'storm': 1.0 };
    const moisture = moistureLevel[weatherVal] ?? 0;
    const effectiveCmpGrip = cmpProfile.peak * (1 - moisture) + cmpProfile.peak * cmpProfile.wetGrip * moisture;
    const getThermalGrip = (t, profile) => {
        const { lo, hi, degrade, peak } = profile;
        if (t < 50) return 0.68;
        if (t < lo) return 0.68 + ((t - 50) / Math.max(lo - 50, 1)) * (peak - 0.68);
        if (t <= hi) return peak;
        const over = t - hi;
        return Math.max(0.55, peak - over * degrade - (over > 12 ? (over - 12) * degrade * 1.8 : 0));
    };

    const tGripF = getThermalGrip(heatF, cmpProfile);
    const tGripR = getThermalGrip(heatR, cmpProfile);
    const avgThermalGrip = (tGripF + tGripR) / 2;

    let thermalRotEffect = 0;
    let thermalStabEffect = 0;

    if (heatF < cmpProfile.lo) {
        thermalRotEffect -= (cmpProfile.lo - heatF) * 0.50;
    }
    else if (heatF > cmpProfile.hi + 5) {
        thermalRotEffect -= (heatF - cmpProfile.hi - 5) * 0.82;
    }
    if (heatR < cmpProfile.lo) {
        thermalStabEffect += (cmpProfile.lo - heatR) * 0.18;
    }
    else if (heatR > cmpProfile.hi + 3) {
        thermalStabEffect -= (heatR - cmpProfile.hi - 3) * 1.20;
    }

    const pressSpikeThreshold = optPress - 5;
    const pressSpike = (vals.tpressure_f > pressSpikeThreshold && (heatF > cmpProfile.hi || heatR > cmpProfile.hi))
        ? (vals.tpressure_f - pressSpikeThreshold) * 0.12 : 0;

    const finalStab = clamp(50
        + copShift * 0.85
        + lltd * 0.40
        + nRToe * 22
        + nFToe * 8
        + sRSlow * 13
        + sFSlow * 5
        + naturalBalance * 10
        + (nFH + nRH) * (-4)
    ) + thermalStabEffect;

    const camberGripF = 1 + (nFCam * -0.15);
    const camberGripR = 1 + (nRCam * -0.10);
    const springComply = -(nFS + nRS) * 9;
    const fProfileErr = Math.abs(heatF_C - (heatF_I + heatF_O) / 2);
    const rProfileErr = Math.abs(heatR_C - (heatR_I + heatR_O) / 2);
    const profilePenalty = (fProfileErr + rProfileErr) * 0.4;

    const gripBase = clamp(50
        + totalDownforce * 0.38
        + (camberGripF - 1) * 20
        + (camberGripR - 1) * 15
        + springComply
        - Math.abs(nPressF) * 2 - Math.abs(nPressR) * 2
        - nHSS * 7
        - Math.max(0, nPkr - 0.2) * 15
        - profilePenalty
    );
    const finalGrip = clamp((gripBase * effectiveCmpGrip * avgThermalGrip) - pressSpike);

    const finalRot = clamp(50
        - copShift * 0.90
        - lltd * 0.42
        + nFToe * (-25)
        + nRToe * (-12)
        + nRake * 6
        + sFSlow * 9
        + sRFast * 5
        - naturalBalance * 8
    ) + thermalRotEffect;

    const finalAbs = clamp(50
        - (nFS + nRS) * 22
        - nHSS * 18
        - (sFFast + sRFast) * 20
        - nPkr * 14
        + (nFH + nRH) * 18
    );

    const finalSpd = clamp(50
        + (0.7 - baseCd) * 25
        + nWing * (-48)
        + ((nPressF + nPressR) / 2) * 8
        + (nFH + nRH) * (-6)
        + (Math.abs(nFToe) + Math.abs(nRToe)) * (-14)
        + (nFBD + nRBD) * 10
        - Math.abs(nRake) * 5
    );

    els.spider.setAttribute('points',
        `${getPt(0, finalStab)} ${getPt(72, finalGrip)} ${getPt(144, finalRot)} ${getPt(216, finalAbs)} ${getPt(288, finalSpd)}`
    );

    if (window.GLOBAL_TRACKS && SELECTED_TRACK_ID) {
        const track = getTrackData(SELECTED_TRACK_ID);
        if (track && track.characteristics) {
            const c = track.characteristics;

            const carBaseDf = clamp(50 + (baseCl / -3.0) * 20);
            const carBaseTs = clamp(50 + (0.7 - baseCd) * 25);
            const carBaseGr = clamp(50 + (baseCl / -3.0) * 10);
            const carBaseTu = clamp(50 + (0.40 - copFront) * 50);
            const carBaseBu = 50;

            const technicalityMod = (c.technicality - 5) / 5;
            const speedMod = (c.speed - 5) / 5;
            const bumpMod = ((c.bumps || 5) - 5) / 5;

            // adjust how much the track characteristics influence the ghost curve
            // based on the selected car's category. slower/less-aero cars get a
            // reduced effect so their suggested "ideal" setup stays realistic.
            const trackScale = getCarGhostScale();

            const tDf = clamp(carBaseDf + ((technicalityMod * 25) - (speedMod * 15)) * trackScale);
            const tTs = clamp(carBaseTs + ((speedMod * 30) - (technicalityMod * 20)) * trackScale);
            const tGr = clamp(carBaseGr + ((technicalityMod * 15) + (speedMod * 10)) * trackScale);
            const tTu = clamp(carBaseTu + (technicalityMod * 20) * trackScale);
            const tBu = clamp(carBaseBu + (bumpMod * 40) * trackScale);

            if (els.ghostPoly) {
                els.ghostPoly.setAttribute('points',
                    `${getPt(0, tDf)} ${getPt(72, tGr)} ${getPt(144, tTu)} ${getPt(216, tBu)} ${getPt(288, tTs)}`
                );
            }

            const updateTarget = (id, val) => {
                const el = els[`barTarget${id}`];
                if (el) el.style.left = `${val}%`;
            };
            updateTarget('Df', tDf);
            updateTarget('Gr', tGr);
            updateTarget('Tu', tTu);
            updateTarget('Bu', tBu);
            updateTarget('Ts', tTs);
        }
    }

    const updateMetrics = (id, val) => {
        const barAtv = document.getElementById(`barActive${id}`);
        const barVal = document.getElementById(`barVal${id}`);
        if (barAtv) barAtv.style.width = `${val}%`;
        if (barVal) barVal.innerText = `${Math.round(val)}%`;
    };

    updateMetrics('Df', totalDownforce);
    updateMetrics('Gr', finalGrip);
    updateMetrics('Tu', finalRot);
    updateMetrics('Bu', finalAbs);
    updateMetrics('Ts', finalSpd);

    let copPos = 50 + copShift;
    copPos = Math.max(10, Math.min(90, copPos));
    els.cop.style.left = copPos + "%";
    els.fP.innerText = (100 - copPos).toFixed(0) + "%";
    els.rP.innerText = copPos.toFixed(0) + "%";

    const balanceRaw = finalRot - finalStab;
    const balanceLevel = Math.round(balanceRaw / 3.5);
    const clampedLevel = Math.max(-10, Math.min(10, balanceLevel));

    if (clampedLevel < 0) {
        const level = Math.abs(clampedLevel);
        const colorClass = level >= 8 ? "text-blue-500 bg-blue-500/20" : "text-blue-400 bg-blue-400/10";
        els.steerStatus.innerText = `UNDERSTEER ${level}/10`;
        els.steerStatus.className = `text-[10px] inline-block ${colorClass} font-bold px-3 py-1 rounded`;
    } else if (clampedLevel > 0) {
        const level = clampedLevel;
        const colorClass = level >= 8 ? "text-red-500 bg-red-500/20" : "text-orange-400 bg-orange-400/10";
        els.steerStatus.innerText = `OVERSTEER ${level}/10`;
        els.steerStatus.className = `text-[10px] inline-block ${colorClass} font-bold px-3 py-1 rounded`;
    } else {
        els.steerStatus.innerText = "BALANCED";
        els.steerStatus.className = "text-[10px] inline-block text-slate-400 font-bold bg-slate-400/10 px-3 py-1 rounded";
    }

    const getZoneColor = (temp) => {
        let hue = 220;
        if (temp > 40) hue = 220 - ((temp - 40) * 4);
        hue = Math.max(0, hue);
        const saturation = temp < 50 ? 30 : 70;
        const lightness = temp < 40 ? 20 : 40;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const updateTyreSingle = (id, temp) => {
        const hEl = document.getElementById(`heat${id}`);
        if (hEl) hEl.style.backgroundColor = getZoneColor(temp);
    };

    updateTyreSingle('FL', heatF_C + 2);
    updateTyreSingle('FR', heatF_C);
    updateTyreSingle('RL', heatR_C + 1);
    updateTyreSingle('RR', heatR_C);

    const updateDamperColor = (el, intensity, maxRange) => {
        if (!el) return;
        const ratio = intensity / maxRange;
        let r, g, b;
        if (ratio < 0.5) {
            const factor = ratio * 2;
            r = Math.round(10 + (0 - 10) * factor);
            g = Math.round(20 + (132 - 20) * factor);
            b = Math.round(60 + (255 - 60) * factor);
        } else {
            const factor = (ratio - 0.5) * 2;
            r = Math.round(0 + (255 - 0) * factor);
            g = Math.round(132 + (220 - 132) * factor);
            b = Math.round(255 + (0 - 255) * factor);
        }
        el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        el.style.boxShadow = `inset 0 0 15px rgba(${r}, ${g}, ${b}, 0.3)`;
    };

    const dampF_val = (vals.fsb + vals.fsr + vals.ffb + vals.ffr) / 4;
    const dampR_val = (vals.rsb + vals.rsr + vals.rfb + vals.rfr) / 4;
    updateDamperColor(els.dampFL, dampF_val, fDampRange);
    updateDamperColor(els.dampFR, dampF_val, fDampRange);
    updateDamperColor(els.dampRL, dampR_val, rDampRange);
    updateDamperColor(els.dampRR, dampR_val, rDampRange);

    els.trackTempV.innerText = `${trackTemp}°C`;
}

document.querySelectorAll('.comp-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.comp-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCompound = btn.dataset.type;
        update();
    };
});

function switchView(target) {
    const views = ['radar', 'bars'];
    views.forEach(v => {
        const btn = els[`view${v.charAt(0).toUpperCase() + v.slice(1)}Btn`];
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
if (els.viewRadarBtn) els.viewRadarBtn.onclick = () => switchView('radar');
if (els.viewBarsBtn) els.viewBarsBtn.onclick = () => switchView('bars');

function getStorageKey() {
    return `lma_saved_setup_${CAR.id}`;
}

function gatherCurrentSetup() {
    const values = {};
    const allInputIds = [
        'tpressure_f', 'tpressure_r', 'fcam', 'rcam', 'bias', 'fbd', 'rbd',
        'fs', 'rs', 'fpk', 'rpk', 'third_Fspring', 'third_fpk', 'third_Rspring', 'third_rpk',
        'fh', 'rh', 'fsb', 'fsr', 'ffb', 'ffr', 'rsb', 'rsr', 'rfb', 'rfr',
        'ftoe', 'rtoe', 'farb', 'rarb', 'wing', 'tender_f'
    ];
    allInputIds.forEach(id => {
        if (els[id]) values[id] = parseFloat(els[id].value);
    });
    return values;
}

function saveCurrentSetup() {
    const setup = gatherCurrentSetup();
    localStorage.setItem(getStorageKey(), JSON.stringify(setup));
    renderPresets();
    const btn = document.getElementById('saveSetupBtn');
    if (btn) {
        btn.textContent = '✓ SAVED';
        btn.classList.add('!bg-green-500/30', '!text-green-300');
        setTimeout(() => {
            btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> SAVE SETUP`;
            btn.classList.remove('!bg-green-500/30', '!text-green-300');
        }, 1500);
    }
}

function deleteSavedSetup() {
    localStorage.removeItem(getStorageKey());
    renderPresets();
}

const presetContainer = document.getElementById('presetContainer');

function renderPresets() {
    presetContainer.innerHTML = '';

    const savedRaw = localStorage.getItem(getStorageKey());
    if (savedRaw) {
        const savedValues = JSON.parse(savedRaw);
        const savedBtn = document.createElement('button');
        savedBtn.className = 'preset-btn preset-btn--saved';
        savedBtn.title = 'Your saved setup for this car';
        savedBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" class="w-3.5 h-3.5 opacity-80">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            </svg>
            <span class="flex-1">MY SETUP</span>
        `;
        savedBtn.onclick = () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            savedBtn.classList.add('active');
            Object.entries(savedValues).forEach(([key, val]) => {
                if (els[key]) {
                    els[key].value = val;
                    updateSliderFill(els[key]);
                }
            });
            update();
        };
        presetContainer.appendChild(savedBtn);

        const sep = document.createElement('div');
        sep.className = 'border-t border-white/5 my-1 mx-1';
        presetContainer.appendChild(sep);
    }

    Object.entries(PRESETS).forEach(([name, preset]) => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        btn.title = preset.desc;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5 opacity-50"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="flex-1">${name.toUpperCase()}</span>
        `;
        btn.onclick = () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            Object.entries(preset.values).forEach(([key, val]) => {
                if (els[key]) {
                    els[key].value = val;
                    updateSliderFill(els[key]);
                }
            });
            update();
        };
        presetContainer.appendChild(btn);
    });

    const deleteBtn = document.getElementById('deleteSetupBtn');
    if (deleteBtn) {
        if (savedRaw) {
            deleteBtn.classList.remove('opacity-30', 'cursor-not-allowed');
            deleteBtn.disabled = false;
        } else {
            deleteBtn.classList.add('opacity-30', 'cursor-not-allowed');
            deleteBtn.disabled = true;
        }
    }
}
renderPresets();

const saveSetupBtn = document.getElementById('saveSetupBtn');
const deleteSetupBtn = document.getElementById('deleteSetupBtn');
if (saveSetupBtn) saveSetupBtn.onclick = saveCurrentSetup;
if (deleteSetupBtn) deleteSetupBtn.onclick = () => {
    if (localStorage.getItem(getStorageKey())) {
        deleteSavedSetup();
    }
};


function loadCar(carId) {
    if (!window.CARS || !window.CARS[carId]) return;

    CAR = window.CARS[carId];
    DEFAULTS = CAR.setupStructure ? gatherDefaults(CAR.setupStructure) : CAR.defaults;
    PRESETS = CAR.presets;

    if (PHYSICS_DATA && PHYSICS_DATA.cars) {
        const p = PHYSICS_DATA.cars.find(c => c.id.toLowerCase() === carId.toLowerCase());
        if (p) CAR.physics = { ...CAR.physics, ...p };
    }

    if (CAR.setupStructure) {
        CAR.setupStructure.forEach(group => {
            group.items.forEach(item => {
                if (els[item.id] && els[item.id].tagName === 'INPUT') {
                    const input = els[item.id];
                    if (item.type === 'labeled') {
                        input.min = 0;
                        input.max = item.options.length - 1;
                        input.step = 1;
                    } else {
                        input.min = item.min;
                        input.max = item.max;
                        input.step = item.step;
                    }
                    input.value = item.default;
                    updateSliderFill(input);
                }
            });
        });
    } else if (CAR.ranges) {
        Object.entries(CAR.ranges).forEach(([key, range]) => {
            if (els[key] && els[key].tagName === 'INPUT') {
                els[key].min = range.min;
                els[key].max = range.max;
                els[key].step = range.step;
                els[key].value = DEFAULTS[key];
                updateSliderFill(els[key]);
            }
        });
    }

    const hasSetting = (id) => {
        if (CAR.setupStructure) {
            return CAR.setupStructure.some(g => g.items.some(i => i.id === id));
        }
        return !!(CAR.ranges && CAR.ranges[id]);
    };

    const tenderEls = document.querySelectorAll('.tender-setting');
    if (hasSetting('tender_f')) {
        tenderEls.forEach(el => el.classList.remove('hidden'));
    } else {
        tenderEls.forEach(el => el.classList.add('hidden'));
    }

    const thirdSpringEls = document.querySelectorAll('.third-spring-setting');
    if (hasSetting('third_Fspring')) {
        thirdSpringEls.forEach(el => el.classList.remove('hidden'));
    } else {
        thirdSpringEls.forEach(el => el.classList.add('hidden'));
    }

    renderPresets();

    update();
}

document.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('mousedown', () => window.getSelection().removeAllRanges());
    input.addEventListener('input', () => {
        if (input.id === 'trackTemp') return;
        updateSliderFill(input);
        update();
    });
    updateSliderFill(input);
});

els.sync.onclick = () => {
    els.bias.value = targetB;
    updateSliderFill(els.bias);
    update();
};

els.trackTemp.oninput = () => {
    els.trackTempV.innerText = els.trackTemp.value + "°C";
    updateSliderFill(els.trackTemp);
    update();
};

if (els.tempPresets) {
    els.tempPresets.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
            const temp = btn.dataset.temp;
            els.trackTemp.value = temp;
            els.trackTempV.innerText = temp + "°C";
            updateSliderFill(els.trackTemp);
            update();
        };
    });
}

if (els.weatherChips) {
    els.weatherChips.querySelectorAll('.weather-chip').forEach(chip => {
        chip.onclick = () => {
            els.weatherChips.querySelectorAll('.weather-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            update();
        };
    });
}

const resetMap = {
    tp_fC_label: 'tpressure_f', tp_rC_label: 'tpressure_r', fcC_label: 'fcam', rcC_label: 'rcam', bC_label: 'bias',
    fbdC_label: 'fbd', rbdC_label: 'rbd',
    fsC_label: 'fs', rsC_label: 'rs', fpkC_label: 'fpk', rpkC_label: 'rpk', fhC_label: 'fh', rhC_label: 'rh',
    third_FspringC_label: 'third_Fspring', third_fpkC_label: 'third_fpk', third_RspringC_label: 'third_Rspring', third_rpkC_label: 'third_rpk',
    fsbC_label: 'fsb', fsrC_label: 'fsr', ffbC_label: 'ffb', ffrC_label: 'ffr',
    rsbC_label: 'rsb', rsrC_label: 'rsr', rfbC_label: 'rfb', rfrC_label: 'rfr',
    ftoeC_label: 'ftoe', rtoeC_label: 'rtoe', farbC_label: 'farb', rarbC_label: 'rarb', wingC_label: 'wing',
    tender_fC_label: 'tender_f'
};

Object.entries(resetMap).forEach(([clickId, slideId]) => {
    const clickEl = document.getElementById(clickId);
    if (clickEl) {
        clickEl.onclick = (e) => {
            e.stopPropagation();
            els[slideId].value = DEFAULTS[slideId];
            updateSliderFill(els[slideId]);
            update();
        };
    }
});

document.querySelectorAll('.setup-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.setup-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.setup-tab-content').forEach(c => c.classList.add('hidden'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.remove('hidden');
        }
    });
});

let fuelMode = 'time';

function calculateFuel() {
    if (!els.fuelLapMin) return;
    const min = parseInt(els.fuelLapMin.value) || 0;
    const sec = parseInt(els.fuelLapSec.value) || 0;
    const ms = parseInt(els.fuelLapMs.value) || 0;
    const lapTimeSec = (min * 60) + sec + (ms / 1000);

    const fuelPerLap = parseFloat(els.fuelPerLapInput.value) || 0;

    let totalLaps = 0;
    if (fuelMode === 'time') {
        const hrs = parseInt(els.fuelHours.value) || 0;
        const mins = parseInt(els.fuelMinutes.value) || 0;
        const totalSec = (hrs * 3600) + (mins * 60);
        if (lapTimeSec > 0) {
            totalLaps = totalSec / lapTimeSec;
        }
    } else {
        totalLaps = parseInt(els.fuelTotalLaps.value) || 0;
    }

    const reqFuel = totalLaps * fuelPerLap;
    const safetyFuel = (Math.ceil(totalLaps) + 1) * fuelPerLap;

    els.fuelResultLaps.innerText = Math.ceil(totalLaps);
    els.fuelResultFuel.innerText = reqFuel.toFixed(1) + ' L';
    els.fuelResultSafety.innerText = safetyFuel.toFixed(1) + ' L';
}

function initFuelCalculator() {
    const inputs = [
        els.fuelHours, els.fuelMinutes, els.fuelTotalLaps,
        els.fuelLapMin, els.fuelLapSec, els.fuelLapMs, els.fuelPerLapInput
    ];

    inputs.forEach(input => {
        if (input) {
            input.oninput = calculateFuel;
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.value = input.id === 'fuelPerLapInput' ? '0.1' : '0';
                    calculateFuel();
                }
            });
        }
    });

    if (els.fuelModeTime) {
        els.fuelModeTime.onclick = () => {
            fuelMode = 'time';
            els.fuelModeTime.classList.add('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            els.fuelModeTime.classList.remove('text-slate-500');
            els.fuelModeLaps.classList.add('text-slate-500');
            els.fuelModeLaps.classList.remove('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            els.fuelTimeInputs.classList.remove('hidden');
            els.fuelLapsInput.classList.add('hidden');
            calculateFuel();
        };
    }

    if (els.fuelModeLaps) {
        els.fuelModeLaps.onclick = () => {
            fuelMode = 'laps';
            els.fuelModeLaps.classList.add('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            els.fuelModeLaps.classList.remove('text-slate-500');
            els.fuelModeTime.classList.add('text-slate-500');
            els.fuelModeTime.classList.remove('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            els.fuelLapsInput.classList.remove('hidden');
            els.fuelTimeInputs.classList.add('hidden');
            calculateFuel();
        };
    }

    calculateFuel();
}

update();
initFuelCalculator();

function setMode(mode) {
    if (mode === 'advanced') {
        document.body.classList.remove('mode-basic');
        els.modeAdvanced.classList.add('active');
        els.modeBasic.classList.remove('active');
    } else {
        document.body.classList.add('mode-basic');
        els.modeAdvanced.classList.remove('active');
        els.modeBasic.classList.add('active');
    }
}

if (els.modeBasic && els.modeAdvanced) {
    els.modeBasic.onclick = () => setMode('basic');
    els.modeAdvanced.onclick = () => setMode('advanced');
}

setMode('advanced');
const TOOLTIP_DATA = {
    'tpressure_f': {
        title: 'Front Tire Pressure',
        desc: 'Internal air pressure of the front tires.',
        inc: 'Increases front carcass stiffness, reduces rolling resistance, and raises center temperature.',
        dec: 'Increases mechanical grip via a larger contact patch and generates more carcass heat.'
    },
    'tp_f': {
        title: 'Front Tire Pressure',
        desc: 'Internal air pressure of the front tires.',
        inc: 'Increases front carcass stiffness, reduces rolling resistance, and raises center temperature.',
        dec: 'Increases mechanical grip via a larger contact patch and generates more carcass heat.'
    },
    'tpressure_r': {
        title: 'Rear Tire Pressure',
        desc: 'Internal air pressure of the rear tires.',
        inc: 'Increases rear carcass stiffness, reduces rolling resistance, and raises center temperature.',
        dec: 'Increases mechanical grip via a larger contact patch and generates more carcass heat.'
    },
    'tp_r': {
        title: 'Rear Tire Pressure',
        desc: 'Internal air pressure of the rear tires.',
        inc: 'Increases rear carcass stiffness, reduces rolling resistance, and raises center temperature.',
        dec: 'Increases mechanical grip via a larger contact patch and generates more carcass heat.'
    },
    'fcam': {
        title: 'Front Camber',
        desc: 'The inward tilt of the front wheels. Optimizes the contact patch of the outside tire during cornering.',
        inc: 'More negative camber improves mid-corner lateral grip but reduces braking stability and increases inner tire wear/heat.',
        dec: 'More positive (closer to zero) camber improves braking and longitudinal traction at the cost of peak cornering grip.'
    },
    'fc': {
        title: 'Front Camber',
        desc: 'The inward tilt of the front wheels. Optimizes the contact patch of the outside tire during cornering.',
        inc: 'More negative camber improves mid-corner lateral grip but reduces braking stability and increases inner tire wear/heat.',
        dec: 'More positive (closer to zero) camber improves braking and longitudinal traction at the cost of peak cornering grip.'
    },
    'rcam': {
        title: 'Rear Camber',
        desc: 'The inward tilt of the rear wheels. Balances cornering traction against exit stability.',
        inc: 'Increases cornering grip and helps the rear follow the front. Too much can cause snap oversteer on exit.',
        dec: 'Improves traction out of slow corners and increases rear stability under power.'
    },
    'rc': {
        title: 'Rear Camber',
        desc: 'The inward tilt of the rear wheels. Balances cornering traction against exit stability.',
        inc: 'Increases cornering grip and helps the rear follow the front. Too much can cause snap oversteer on exit.',
        dec: 'Improves traction out of slow corners and increases rear stability under power.'
    },
    'fbd': {
        title: 'Front Brake Duct',
        desc: 'Controls airflow to the front brakes and tires.',
        inc: 'Closing the duct (higher value) increases brake/tire temperature and reduces aerodynamic drag.',
        dec: 'Opening the duct (lower value) cools brakes and tires but increases drag.'
    },
    'rbd': {
        title: 'Rear Brake Duct',
        desc: 'Controls airflow to the rear brakes and tires.',
        inc: 'Increases rear tire temperature, helping with warm-up. Reduces drag.',
        dec: 'Reduces rear brake/tire temperatures at the cost of slight drag increase.'
    },
    'bias': {
        title: 'Brake Bias',
        desc: 'The distribution of braking force between the front and rear axles, heavily influencing stability and turn-in.',
        inc: 'Shifting bias forward (+) provides stable, predictable braking in straights but causes severe understeer (plow) into corners as the front tires lock up early.',
        dec: 'Shifting bias rearward (-) makes the car agile and easy to rotate into corners but becomes unstable and squirrelly, with high risk of rear-end oversteer and spin (especially when trail braking).'
    },
    'b': {
        title: 'Brake Bias',
        desc: 'The distribution of braking force between the front and rear axles, heavily influencing stability and turn-in.',
        inc: 'Shifting bias forward (+) provides stable, predictable braking in straights but causes severe understeer (plow) into corners as the front tires lock up early.',
        dec: 'Shifting bias rearward (-) makes the car agile and easy to rotate into corners but becomes unstable and squirrelly, with high risk of rear-end oversteer and spin (especially when trail braking).'
    },
    'fs': {
        title: 'Front Springs',
        desc: 'Determines the stiffness of the front suspension.',
        inc: 'Stiffening reduces body roll and pitch, making the car more responsive (sharper turn-in) but increases understeer.',
        dec: 'Softening improves mechanical grip and compliance over bumps but makes the front end lazy and less precise.'
    },
    'rs': {
        title: 'Rear Springs',
        desc: 'Determines the stiffness of the rear suspension.',
        inc: 'Stiffening increases rotation and oversteer, helping the car pivot in slow corners.',
        dec: 'Softening improves rear traction and stability on exit, making the car more "planted".'
    },
    'fpk': {
        title: 'Front Packers',
        desc: 'Limit the travel of the front suspension. Prevents the floor from bottoming out.',
        inc: 'Increases the effective spring rate at high aero loads, protecting the splitter but can cause mid-corner understeer.',
        dec: 'Allows for more suspension travel, improving compliance on bumpy entries.'
    },
    'rpk': {
        title: 'Rear Packers',
        desc: 'Limit the travel of the rear suspension.',
        inc: 'Maintains rear ride height under high aero loads, supporting the diffuser. Can cause snap oversteer if the car hits the stops.',
        dec: 'Provides more compliance and predictable rear grip over big kerbs.'
    },
    'fh': {
        title: 'Front Ride Height',
        desc: 'The distance between the front splitter and the ground.',
        inc: 'Reduces front downforce and increases drag but provides more suspension travel for bumpy tracks.',
        dec: 'Significantly increases front downforce (ground effect). Too low causes the floor to stall or hit the ground.'
    },
    'rh': {
        title: 'Rear Ride Height',
        desc: 'The distance between the rear diffuser and the ground.',
        inc: 'Increases rake, shifting aerodynamic balance forward for better rotation. Too high increases drag.',
        dec: 'Reduces drag and increases rear stability at high speed but can lead to understeer.'
    },
    'fsb': {
        title: 'Front Slow Bump',
        desc: 'Controls how fast the front suspension compresses during body movements (roll/dive).',
        inc: 'Resists dive under braking and roll during turn-in, making the car feel more direct.',
        dec: 'Allows faster weight transfer to the front tires, improving initial turn-in bite.'
    },
    'fsr': {
        title: 'Front Slow Rebound',
        desc: 'Controls how fast the front suspension extends after being compressed.',
        inc: 'Keeps the nose down longer after braking, helping with mid-corner rotation.',
        dec: 'Allows the nose to rise faster, improving traction on corner exit.'
    },
    'ffb': {
        title: 'Front Fast Bump',
        desc: 'Controls how the front suspension handles high-speed impacts (kerbs/bumps).',
        inc: 'Makes the car feel more stable over small ripples but harsher over big kerbs.',
        dec: 'Improves compliance and stability when attacking aggressive kerbs.'
    },
    'ffr': {
        title: 'Front Fast Rebound',
        desc: 'Controls the return speed of the suspension after a high-speed bump.',
        inc: 'Stops the car from "bouncing" after hitting a kerb, keeping the contact patch stable.',
        dec: 'Allows the wheel to return to the ground faster after a bump.'
    },
    'ftoe': {
        title: 'Front Toe',
        desc: 'The angle of the front wheels relative to the car\'s centerline.',
        inc: 'Toe-in (+) increases straight-line stability but slows down turn-in response.',
        dec: 'Toe-out (-) sharpens initial turn-in rotation but can make the car wandering on straights.'
    },
    'rtoe': {
        title: 'Rear Toe',
        desc: 'The angle of the rear wheels relative to the car\'s centerline.',
        inc: 'Toe-in (+) locks the rear axle, improving stability and exit traction.',
        dec: 'Toe-out (-) makes the car very aggressive and prone to oversteer.'
    },
    'farb': {
        title: 'Front Anti-Roll Bar',
        desc: 'Controls the lateral roll stiffness of the front axle.',
        inc: 'Reduces front roll, keeping the car flatter. Increases understeer in mid-corner.',
        dec: 'Increases front-end roll and mechanical grip, reducing understeer but feeling less responsive.'
    },
    'rarb': {
        title: 'Rear Anti-Roll Bar',
        desc: 'Controls the lateral roll stiffness of the rear axle.',
        inc: 'Increases rotation and mid-corner oversteer. Helps the car "rotate" around its axis.',
        dec: 'Stabilizes the rear end through corners, reducing oversteer.'
    },
    'wing': {
        title: 'Rear Wing',
        desc: 'The primary source of rear aerodynamic downforce.',
        inc: 'Massively increases rear grip and stability at high speed but adds significant drag (lower top speed).',
        dec: 'Reduces drag for higher top speed but makes the car very loose in fast corners.'
    },
    'third_Fspring': {
        title: 'Front Heave Spring',
        desc: 'Keeps the front aerodynamic platform stable by resisting vertical movements independently of roll.',
        inc: 'Prevents front-end diving at high speed, maintaining consistent aero balance.',
        dec: 'Provides more vertical compliance for better bump absorption at the cost of aero stability.'
    },
    'third_fpk': {
        title: 'Front Heave Packers',
        desc: 'Adjusts the limited travel of the front third spring.',
        inc: 'Increases the effective spring rate sooner, preventing front heave travel at high aero loads.',
        dec: 'Allows more front suspension travel before the packers engage.'
    },
    'third_Rspring': {
        title: 'Rear Heave Spring',
        desc: "Controls the car's vertical movement (heave) and pitch (squat), independently of roll.",
        inc: 'Prevents rear-end squatting under acceleration and maintains constant aero platform at high speed.',
        dec: 'Provides more vertical compliance for bump absorption but can lose aero stability.'
    },
    'third_rpk': {
        title: 'Rear Heave Packers',
        desc: 'Adjusts the limited travel of the rear third spring.',
        inc: 'Increases the effective spring rate sooner, preventing rear heave travel at high aero loads.',
        dec: 'Allows more rear suspension travel before the packers engage.'
    }
};

const tooltip = document.getElementById('setup-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipDesc = document.getElementById('tooltip-desc');
const tooltipInc = document.getElementById('tooltip-inc');
const tooltipDec = document.getElementById('tooltip-dec');
let tooltipTimeout = null;

function showTooltip(id, e) {
    const data = TOOLTIP_DATA[id];
    if (!data) return;

    clearTimeout(tooltipTimeout);

    tooltipTimeout = setTimeout(() => {
        tooltipTitle.innerText = data.title;
        tooltipDesc.innerText = data.desc;
        tooltipInc.innerText = data.inc;
        tooltipDec.innerText = data.dec;

        tooltip.classList.remove('hidden');
        tooltip.offsetHeight;
        tooltip.classList.add('opacity-100');
        updateTooltipPos(e);
    }, 500);
}

function hideTooltip() {
    clearTimeout(tooltipTimeout);
    tooltip.classList.remove('opacity-100');
    tooltip.classList.add('pointer-events-none');
    setTimeout(() => {
        if (!tooltip.classList.contains('opacity-100')) {
            tooltip.classList.add('hidden');
        }
    }, 200);
}

tooltip.addEventListener('click', e => e.stopPropagation());

function updateTooltipPos(e) {
    const xOffset = 16;
    const yOffset = 16;

    const point = e.touches ? e.touches[0] : e;

    let x = point.clientX + xOffset;
    let y = point.clientY + yOffset;

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const tW = tooltip.offsetWidth;
    const tH = tooltip.offsetHeight;
    const margin = 12;

    if (x + tW > winW - margin) {
        x = point.clientX - tW - xOffset;
    }

    if (y + tH > winH - margin) {
        y = point.clientY - tH - yOffset;
    }

    x = Math.max(margin, Math.min(x, winW - tW - margin));
    y = Math.max(margin, Math.min(y, winH - tH - margin));

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

let tooltipPinned = false;

document.querySelectorAll('[id$="C_label"]').forEach(labelEl => {
    const id = labelEl.id.replace('C_label', '');
    if (!TOOLTIP_DATA[id]) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-1';
    labelEl.parentNode.insertBefore(wrapper, labelEl);
    wrapper.appendChild(labelEl);

    const btn = document.createElement('button');
    btn.className = 'info-icon-btn';
    btn.setAttribute('data-tooltip-id', id);
    btn.setAttribute('type', 'button');
    btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
    wrapper.appendChild(btn);

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeId = tooltip.getAttribute('data-active-id');
        const isShown = !tooltip.classList.contains('hidden') && activeId === id;
        if (isShown) {
            tooltipPinned = false;
            tooltip.removeAttribute('data-active-id');
            hideTooltip();
        } else {
            tooltipPinned = true;
            tooltip.setAttribute('data-active-id', id);
            clearTimeout(tooltipTimeout);
            const data = TOOLTIP_DATA[id];
            tooltipTitle.innerText = data.title;
            tooltipDesc.innerText = data.desc;
            tooltipInc.innerText = data.inc;
            tooltipDec.innerText = data.dec;
            tooltip.classList.remove('hidden', 'pointer-events-none');
            tooltip.offsetHeight;
            tooltip.classList.add('opacity-100');
            updateTooltipPos(e);
        }
    });
});

document.querySelectorAll('.info-icon-btn').forEach(btn => {
    const id = btn.getAttribute('data-tooltip-id');
    btn.addEventListener('mouseenter', e => {
        if (!tooltipPinned) {
            showTooltip(id, e);
        }
    });
    btn.addEventListener('mousemove', e => {
        if (!tooltipPinned) {
            updateTooltipPos(e);
        }
    });
    btn.addEventListener('mouseleave', () => {
        if (!tooltipPinned) {
            hideTooltip();
        }
    });
});

document.addEventListener('click', () => {
    if (tooltipPinned) {
        tooltipPinned = false;
        tooltip.removeAttribute('data-active-id');
        hideTooltip();
    }
});