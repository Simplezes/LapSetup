// ═══════════════════════════════════════════════════════════════════════════
// app_core.js — Shared state, constants, and utility helpers
// ═══════════════════════════════════════════════════════════════════════════

let CAR = (window.CARS && window.CARS['bmw_m4_lmgt3']) ? window.CARS['bmw_m4_lmgt3'] : null;
if (!CAR && window.CARS) CAR = Object.values(window.CARS)[0];

const gatherDefaults = (structure) => {
    const defs = {};
    if (!structure) return defs;
    structure.forEach(group => {
        group.items.forEach(item => {
            if (item.type === 'labeled') {
                const idx = item.default;
                const opt = item.options && item.options[idx];
                if (opt !== undefined) {
                    defs[item.id] = (typeof opt === 'object' && opt.value !== undefined) ? opt.value : opt;
                } else {
                    defs[item.id] = item.default;
                }
            } else {
                defs[item.id] = item.default;
            }
        });
    });
    return defs;
};
window.gatherDefaults = gatherDefaults;

let DEFAULTS = CAR.setupStructure ? gatherDefaults(CAR.setupStructure) : (CAR.defaults || {});
let PRESETS = CAR.presets;
let PHYSICS_DATA = null;
let SELECTED_TRACK_ID = 'sarthe';

const els = window.LMA_UI ? window.LMA_UI.els : {};
const { clamp, getPt, shapeDamp, getThermalGrip, getStandardizedDelta, getPhysVal } = window.LMA_Formulas || {};

function getItemConfig(id) { return window.LMA_Utils ? window.LMA_Utils.getItemConfig(CAR, id) : null; }
function getParamRange(id) { return window.LMA_Utils ? window.LMA_Utils.getParamRange(CAR, id) : { min: 0, max: 100, step: 1 }; }

let currentCompound = 'MEDIUM';
let targetB = DEFAULTS.bias;

const CAR_CATEGORIES = {
    'LMGT3': { ids: ['aston_martin_vantage_lmgt3', 'bmw_m4_lmgt3', 'chevrolet_corvette_Z06_r', 'ferrari_296_lmgt3', 'ford_mustang_lmgt3', 'lamborghini_huracan_lmgt3_evo2', 'lexus_rcf_lmgt3', 'mclaren_720s_lmgt3_evo', 'mercedes_amg_lmgt3', 'porsche_911_gt3_r_lmgt3'], color: '#0ea5e9' },
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

// ── Shared UI Utilities ────────────────────────────────────────────────────

function updateSliderFill(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.setProperty('--val', pct + '%');
}

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

// ── Slider Initialization ──────────────────────────────────────────────────

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
