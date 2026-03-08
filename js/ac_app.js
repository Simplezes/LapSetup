window.AC_App = (function () {
    let car = null;
    let values = {};
    let _initialized = false;
    let ambientTemp = 20;
    let session     = 'Q';
    let fuelQ       = null;
    let selectedTrack = null;

    // ── Helpers ───────────────────────────────────────────────────────────────
    function el(id) { return document.getElementById(id); }

    function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

    function formatValue(key, rawVal) {
        const p = car && car.params[key];
        if (!p) return String(rawVal);
        let v = parseFloat(rawVal);
        if (p.displayScale !== undefined) v *= p.displayScale;
        const dec = p.decimals !== undefined ? p.decimals : 0;
        return v.toFixed(dec) + p.unit;
    }

    function fillSlider(input) {
        if (!input || input.type !== 'range') return;
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        const val = parseFloat(input.value);
        const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
        input.style.setProperty('--val', pct + '%');
    }

    // ── Display update for a single key ──────────────────────────────────────
    function updateDisplay(key) {
        const val = values[key];
        const valSpan = el('ac_' + key + '_V');
        if (valSpan) valSpan.innerText = formatValue(key, val);

        // ABS: toggle button visual state
        if (key === 'ABS') {
            const isOn = parseInt(val) === 1;
            const btn0 = el('ac_ABS_0');
            const btn1 = el('ac_ABS_1');
            if (btn0 && btn1) {
                [btn0, btn1].forEach(b => {
                    b.classList.remove('border-blue-500/30', 'bg-blue-500/10', 'text-blue-400', 'border-white/5', 'text-slate-500');
                });
                if (isOn) {
                    btn1.classList.add('border-blue-500/30', 'bg-blue-500/10', 'text-blue-400');
                    btn0.classList.add('border-white/5', 'text-slate-500');
                } else {
                    btn0.classList.add('border-blue-500/30', 'bg-blue-500/10', 'text-blue-400');
                    btn1.classList.add('border-white/5', 'text-slate-500');
                }
            }
        }

        // Sync range slider position and fill gradient
        const slider = el('ac_' + key);
        if (slider && slider.type === 'range') {
            slider.value = val;
            fillSlider(slider);
        }
    }

    function setValue(key, rawVal) {
        if (!car || !car.params[key]) return;
        const p = car.params[key];
        values[key] = clamp(parseFloat(rawVal), p.min, p.max);
        updateDisplay(key);
    }

    // ── Bind all slider / button event listeners ──────────────────────────────
    function bindSliders() {
        if (!car) return;
        Object.keys(car.params).forEach(key => {
            const p = car.params[key];

            if (key === 'ABS') {
                const btn0 = el('ac_ABS_0');
                const btn1 = el('ac_ABS_1');
                if (btn0) btn0.onclick = () => setValue('ABS', 0);
                if (btn1) btn1.onclick = () => setValue('ABS', 1);
                return;
            }

            const slider = el('ac_' + key);
            if (!slider) return;

            slider.min = p.min;
            slider.max = p.max;
            slider.step = p.step;

            slider.addEventListener('input', () => {
                const v = parseFloat(slider.value);
                values[key] = clamp(v, p.min, p.max);
                fillSlider(slider);
                const vSpan = el('ac_' + key + '_V');
                if (vSpan) vSpan.innerText = formatValue(key, values[key]);
                updateAnalysis();
                updateParamFeedbackUI(key);
            });
        });
    }

    // ── Analysis & Validation ─────────────────────────────────────────────────
    // Spring F/R ratio — principal balance lever (analysis: 0.677 = high-speed, 0.710 = neutral)
    function calcSpringRatio() {
        const fF = ((values.SPRING_RATE_LF || 0) + (values.SPRING_RATE_RF || 0)) / 2;
        const fR = ((values.SPRING_RATE_LR || 0) + (values.SPRING_RATE_RR || 0)) / 2;
        if (!fR) return { ratio: 0, zone: '—', color: '#5a7390' };
        const r = fF / fR;
        let zone, color;
        if      (r < 0.65) { zone = 'DANGER';     color = '#e84040'; }
        else if (r < 0.70) { zone = 'HIGH SPEED'; color = '#ff8c40'; }
        else if (r < 0.75) { zone = 'NEUTRAL';    color = '#30d98a'; }
        else               { zone = 'UNDERSTEER'; color = '#3b9fff'; }
        return { ratio: r, zone, color };
    }

    // Front Bump/Rebound ratio — should stay 0.80–1.20 (analysis: Nürburgring 1.20, Okayama 0.89)
    function calcBumpRebFrontRatio() {
        const bF = ((values.DAMP_BUMP_LF || 0) + (values.DAMP_BUMP_RF || 0)) / 2;
        const rF = ((values.DAMP_REBOUND_LF || 0) + (values.DAMP_REBOUND_RF || 0)) / 2;
        return rF > 0 ? (bF / rF) : 0;
    }

    // Pressure adjustment for ambient temperature (analysis: 15°C → +1 PSI, 25°C → -1 PSI)
    function pressureAdjForTemp(t) {
        if (t <= 15) return +1;
        if (t >= 25) return -1;
        return 0;
    }

    // ── Stability score 0–100 (Section 7 formula) ───────────────────────────
    // toe_R 20 pts + spring_ratio 20 pts + ARB_R 20 pts
    // + camber_R moderation 20 pts + rebound_delta 20 pts
    function calcStabilityScore() {
        if (!car) return 0;
        function norm(v, lo, hi) { return Math.max(0, Math.min(1, (v - lo) / (hi - lo))); }
        const toeR = ((values.TOE_OUT_LR || 0) + (values.TOE_OUT_RR || 0)) / 2;
        const sr   = calcSpringRatio().ratio;
        const arbR = values.ARB_REAR !== undefined ? values.ARB_REAR : 1;
        const camR = (Math.abs(values.CAMBER_LR || 0) + Math.abs(values.CAMBER_RR || 0)) / 2;
        const rebF = ((values.DAMP_REBOUND_LF || 0) + (values.DAMP_REBOUND_RF || 0)) / 2;
        const rebR = ((values.DAMP_REBOUND_LR || 0) + (values.DAMP_REBOUND_RR || 0)) / 2;
        const s1 = 20 * norm(toeR, 30, 34);         // more rear toe-in = more stable
        const s2 = 20 * norm(sr, 0.65, 0.75);       // mid spring ratio = stable
        const s3 = 20 * norm(arbR, 0, 1);            // ARB_R=1 = more stable
        const s4 = 20 * (1 - norm(camR, 17, 22));    // moderate rear camber = stable
        const s5 = 20 * norm(rebR - rebF, 0, 4);    // rear rebound ≥ front = stable
        return Math.round(s1 + s2 + s3 + s4 + s5);
    }

    // US/OS balance: negative = understeer, positive = oversteer (Section 7 formula)
    function calcUSOS() {
        if (!car) return 0;
        const sr   = calcSpringRatio().ratio;
        const arbF = values.ARB_FRONT !== undefined ? values.ARB_FRONT : 2;
        const arbR = values.ARB_REAR  !== undefined ? values.ARB_REAR  : 1;
        const camF = (Math.abs(values.CAMBER_LF || 0) + Math.abs(values.CAMBER_RF || 0)) / 2;
        const camR = (Math.abs(values.CAMBER_LR || 0) + Math.abs(values.CAMBER_RR || 0)) / 2;
        const toeR = ((values.TOE_OUT_LR || 0) + (values.TOE_OUT_RR || 0)) / 2;
        const rebF = ((values.DAMP_REBOUND_LF || 0) + (values.DAMP_REBOUND_RF || 0)) / 2;
        const rebR = ((values.DAMP_REBOUND_LR || 0) + (values.DAMP_REBOUND_RR || 0)) / 2;
        const v = ((sr - 0.71) / 0.06) * 30
                + ((arbF - arbR - 1) * 15)
                + ((camF - camR - 19) * -1.5)
                + ((toeR - 32) * -2.0)
                + ((rebR - rebF - 1) * 3);
        return Math.max(-100, Math.min(100, Math.round(v)));
    }

    // Camber delta F−R in raw units (each unit = 0.1°); ideal 17–21
    function calcCamberDelta() {
        const camF = (Math.abs(values.CAMBER_LF || 0) + Math.abs(values.CAMBER_RF || 0)) / 2;
        const camR = (Math.abs(values.CAMBER_LR || 0) + Math.abs(values.CAMBER_RR || 0)) / 2;
        return camF - camR;
    }

    // Estimated hot race pressure = cold avg + 1.5 PSI (thermal model from dataset)
    function calcHotPressureEst() {
        const avg = ((values.PRESSURE_LF || 0) + (values.PRESSURE_RF || 0)
                   + (values.PRESSURE_LR || 0) + (values.PRESSURE_RR || 0)) / 4;
        return avg + 1.5;
    }



    // GRIP: mechanical traction — camber, pressure deviation, spring compliance
    function calcACGrip() {
        if (!car) return 50;
        const pressAvg = ((values.PRESSURE_LF || 19) + (values.PRESSURE_RF || 19) +
                          (values.PRESSURE_LR || 19) + (values.PRESSURE_RR || 19)) / 4;
        const camF    = (Math.abs(values.CAMBER_LF || 0) + Math.abs(values.CAMBER_RF || 0)) / 2;
        const camR    = (Math.abs(values.CAMBER_LR || 0) + Math.abs(values.CAMBER_RR || 0)) / 2;
        const springF = ((values.SPRING_RATE_LF || 42) + (values.SPRING_RATE_RF || 42)) / 2;
        return Math.round(Math.max(0, Math.min(100,
            50
            - Math.abs(pressAvg - 19.5) * 5   // 19-20 PSI optimal, penalty per PSI deviation
            + (camF - 35) * 2.0               // max camber -38 = +6; less = penalty
            + (camR - 16) * 1.5              // ideal rear camber 19-22; below 16 = 0 bonus
            - Math.max(0, camR - 22) * 2.0   // penalty for over-aggressive rear camber
            - (springF - 42) * 0.5           // stiffer front = slightly less mechanical grip
        )));
    }

    // TURN-IN: initial steering response — rebound, front spring, nose height, rear toe
    function calcACTurnIn() {
        if (!car) return 50;
        const springF = ((values.SPRING_RATE_LF || 42) + (values.SPRING_RATE_RF || 42)) / 2;
        const rebF    = ((values.DAMP_REBOUND_LF || 5) + (values.DAMP_REBOUND_RF || 5)) / 2;
        const camF    = (Math.abs(values.CAMBER_LF || 0) + Math.abs(values.CAMBER_RF || 0)) / 2;
        const rodF    = ((values.ROD_LENGTH_LF || 0) + (values.ROD_LENGTH_RF || 0)) / 2;
        const toeR    = ((values.TOE_OUT_LR || 31) + (values.TOE_OUT_RR || 31)) / 2;
        const arbR    = values.ARB_REAR !== undefined ? values.ARB_REAR : 1;
        return Math.round(Math.max(0, Math.min(100,
            50
            + (springF - 44) * 1.5    // stiffer front spring = sharper weight transfer
            + (9 - rebF) * 3.0        // lower front rebound = faster nose drop at entry
            + (camF - 35) * 1.5       // more camber = more lateral grip at turn-in
            + rodF * 2.5              // higher rod = lower nose = more front load
            + (1 - arbR) * 5          // ARB rear off = rear pivots more freely
            + (32 - toeR) * 2.0       // lower rear toe = less passive understeer
        )));
    }

    // BUMPS: suspension compliance — spring softness, bump damper stiffness
    function calcACBumps() {
        if (!car) return 50;
        const springF = ((values.SPRING_RATE_LF || 42) + (values.SPRING_RATE_RF || 42)) / 2;
        const springR = ((values.SPRING_RATE_LR || 62) + (values.SPRING_RATE_RR || 62)) / 2;
        const bumpF   = ((values.DAMP_BUMP_LF || 6) + (values.DAMP_BUMP_RF || 6)) / 2;
        const bumpR   = ((values.DAMP_BUMP_LR || 6) + (values.DAMP_BUMP_RR || 6)) / 2;
        // Normalise: softest possible = 1.0, stiffest = 0.0
        const nSpF = Math.max(0, 1 - (springF - 37) / 21);  // range 37-58
        const nSpR = Math.max(0, 1 - (springR - 62) / 45);  // range 62-107
        const nBuF = Math.max(0, 1 - bumpF / 11);
        const nBuR = Math.max(0, 1 - bumpR / 11);
        return Math.round(Math.max(0, Math.min(100,
            nSpF * 35 + nSpR * 20 + nBuF * 30 + nBuR * 15
        )));
    }

    // ── Chart UI ──────────────────────────────────────────────────────────────
    function acPt(angle, val) {
        const r   = (Math.max(0, Math.min(100, val)) / 100) * 80;
        const rad = (angle - 90) * Math.PI / 180;
        return (100 + r * Math.cos(rad)).toFixed(1) + ',' + (100 + r * Math.sin(rad)).toFixed(1);
    }

    function updateACChartUI() {
        const grip    = calcACGrip();
        const turnIn  = calcACTurnIn();
        const bumps   = calcACBumps();

        // Radar
        const poly = el('ac-spiderPoly');
        if (poly) poly.setAttribute('points', acPt(0, grip) + ' ' + acPt(120, turnIn) + ' ' + acPt(240, bumps));

        // Bars
        const setBar = (id, val) => {
            const bar = el('ac-barActive' + id);
            const lbl = el('ac-barVal' + id);
            if (bar) bar.style.width = val + '%';
            if (lbl) lbl.innerText = val + '%';
        };
        setBar('Gr', grip);
        setBar('Tu', turnIn);
        setBar('Bu', bumps);
    }

    // ── Chart view toggle (RADAR / BARS) ──────────────────────────────────────
    function initACChart() {
        const btnRadar   = el('ac-viewRadar');
        const btnBars    = el('ac-viewBars');
        const radarView  = el('ac-radarView');
        const barsView   = el('ac-barsView');
        if (!btnRadar || !btnBars) return;

        function switchACView(v) {
            const isRadar = v === 'radar';
            radarView.classList.toggle('hidden', !isRadar);
            radarView.classList.toggle('flex', isRadar);
            barsView.classList.toggle('hidden', isRadar);
            barsView.classList.toggle('flex', !isRadar);

            btnRadar.className = isRadar
                ? 'text-[9px] font-bold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors'
                : 'text-[9px] font-bold text-slate-500 px-2.5 py-1 rounded border border-white/5 hover:text-white hover:bg-white/5 transition-colors';
            btnBars.className = !isRadar
                ? 'text-[9px] font-bold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors'
                : 'text-[9px] font-bold text-slate-500 px-2.5 py-1 rounded border border-white/5 hover:text-white hover:bg-white/5 transition-colors';
        }

        btnRadar.onclick = () => switchACView('radar');
        btnBars.onclick  = () => switchACView('bars');
        switchACView('radar');
    }

    // Per-parameter physics feedback — direct statements, no hedging (Section 2)
    function getParamFeedback(key) {
        var v = parseFloat(values[key] || 0);
        switch (key) {
            case 'SPRING_RATE_LF': case 'SPRING_RATE_RF':
                return v >= 51 ? 'Hard front spring: resists roll, improves turn-in — causes bounce on bumpy circuits'
                     : v <= 42 ? 'Soft front spring: absorbs bumps, more mechanical grip — nose dives more under braking'
                     : 'Standard 44 N/mm: neutral setup, used on 80% of circuits';
            case 'SPRING_RATE_LR': case 'SPRING_RATE_RR':
                return v >= 77 ? 'Stiff rear 77 N/mm: less squat on acceleration — snap oversteer on bumps. Only Road Atlanta & Lime Rock.'
                     : 'Standard 62 N/mm: validated on 96% of circuits';
            case 'CAMBER_LF': case 'CAMBER_RF': {
                var absF = Math.abs(v);
                return absF >= 40 ? 'Aggressive camber: maximum cornering grip — inner tire overheats and wears faster'
                     : absF <= 35 ? 'Mild camber: tire runs cooler, lasts longer — less grip in corners. Only Norisring (urban oval).'
                     : 'Reference -3.8°: standard across 96% of circuits';
            }
            case 'CAMBER_LR': case 'CAMBER_RR': {
                var absR = Math.abs(v);
                return absR <= 17 ? 'Low rear camber: maximises traction at corner exit — used at Okayama for slow/technical layouts'
                     : absR >= 22 ? 'High rear camber: maximum lateral grip — overheats tires in ambient temps below 15°C'
                     : 'Balanced rear camber: proven range between traction and lateral grip';
            }
            case 'TOE_OUT_LR': case 'TOE_OUT_RR':
                return v <= 30 ? 'Low toe-in: rear responds faster, more oversteer potential — Nordschleife and Road Atlanta use 30'
                     : v >= 35 ? 'High toe-in: very stable rear, resists direction changes — produces understeer at corner exit'
                     : 'Balanced toe-in: validated range for consistent rear behaviour';
            case 'DAMP_BUMP_LF': case 'DAMP_BUMP_RF':
                return v >= 8 ? 'High front bump: nose slows down over bumps, less body roll — inconsistent grip on rough surfaces'
                     : v <= 5 ? 'Low front bump: nose settles fast, compliant — more roll, softer feel under braking'
                     : 'Standard front bump: balanced for all circuit types';
            case 'DAMP_REBOUND_LF': case 'DAMP_REBOUND_RF':
                return v >= 9 ? 'High front rebound: nose stays low after braking — precise chicane entry, slow high-speed recovery'
                     : v <= 5 ? 'Low front rebound: nose rises quickly — faster high-speed stability, less precise braking'
                     : 'Standard front rebound: balanced for all circuit types';
            case 'DAMP_BUMP_LR': case 'DAMP_BUMP_RR':
                return v >= 8 ? 'High rear bump: rear squats slowly under acceleration — more traction at corner exit'
                     : v <= 5 ? 'Low rear bump: rear moves freely over bumps — grip on rough surfaces, oversteer risk under power'
                     : 'Standard rear bump';
            case 'DAMP_REBOUND_LR': case 'DAMP_REBOUND_RR':
                return v >= 8 ? 'High rear rebound: rear stays planted — stable under load. Must be ≥ front rebound.'
                     : v <= 5 ? 'Low rear rebound: rear rises quickly — lift-off oversteer if lower than front rebound'
                     : 'Standard rear rebound — always keep ≥ front rebound for stability';
            case 'ROD_LENGTH_LF': case 'ROD_LENGTH_RF':
                return v >= 5 ? 'Very low nose: front load maximised — only for smooth surfaces like Lime Rock'
                     : v >= 3 ? 'Low nose: more front aero load, better entry — verify no bottoming on bumpy circuits'
                     : 'Neutral/raised nose: safest for rough or endurance circuits';
            case 'ROD_LENGTH_LR': case 'ROD_LENGTH_RR':
                return v >= 5 ? 'Very high rear: maximum mechanical traction — used at Nordschleife for 73 km of elevation changes'
                     : v >= 3 ? 'Raised rear: improves mechanical rear load — more traction at corner exit'
                     : 'Neutral rear height';
            case 'PRESSURE_LF': case 'PRESSURE_RF': case 'PRESSURE_LR': case 'PRESSURE_RR':
                return v <= 17 ? 'Very low pressure: maximum contact patch — deformation and puncture risk'
                     : v >= 22 ? 'High cold pressure: tire runs cold, less cornering grip — typical for 15°C ambient'
                     : 'Est. hot: ~' + (v + 1.5).toFixed(1) + ' PSI (target 20–21 PSI in race conditions)';
            case 'BRAKE_POWER_MULT':
                return v >= 92 ? 'Maximum brake power: shortest stopping distances — ABS triggers hard, difficult to modulate in slow corners'
                     : v <= 80 ? 'Reduced brake power: progressive pedal, easier to modulate — standard for circuits without long straights'
                     : 'Medium brake power: balance between stopping force and modulation';
            case 'ARB_FRONT':
                return v !== 2 ? '⚠ Must be 2 — every analysed setup uses this value. Changing it causes structural imbalance.'
                     : 'Front ARB 2: the only value used across all 28 analysed setups';
            case 'ARB_REAR':
                return v === 0 ? 'ARB rear off: rear axle decoupled — maximum compliance on slow/rough circuits. Used only at Norisring.'
                     : 'ARB rear 1: standard — stabilises the rear axle under lateral load';
            case 'FUEL':
                return v <= 12 ? 'Qualifying load: car is lighter — spring rates can be reduced 1–2 N/mm'
                     : v >= 22 ? 'Heavy fuel load (' + v + ' L): extra weight stresses springs — consider +2 N/mm spring rate'
                     : 'Normal race fuel load: no spring adjustments needed';
            default: return null;
        }
    }

    function updateParamFeedbackUI(key) {
        var fb  = getParamFeedback(key);
        var box = el('ac-param-feedback');
        var lbl = el('ac-param-feedback-key');
        var msg = el('ac-param-feedback-msg');
        if (!box) return;
        if (!fb) { box.classList.add('hidden'); return; }
        var labels = {
            SPRING_RATE_LF:'FL SPRING', SPRING_RATE_RF:'FR SPRING',
            SPRING_RATE_LR:'RL SPRING', SPRING_RATE_RR:'RR SPRING',
            CAMBER_LF:'FL CAMBER',     CAMBER_RF:'FR CAMBER',
            CAMBER_LR:'RL CAMBER',     CAMBER_RR:'RR CAMBER',
            TOE_OUT_LF:'FL TOE',       TOE_OUT_RF:'FR TOE',
            TOE_OUT_LR:'RL TOE',       TOE_OUT_RR:'RR TOE',
            DAMP_BUMP_LF:'FL BUMP',    DAMP_BUMP_RF:'FR BUMP',
            DAMP_BUMP_LR:'RL BUMP',    DAMP_BUMP_RR:'RR BUMP',
            DAMP_REBOUND_LF:'FL REBOUND', DAMP_REBOUND_RF:'FR REBOUND',
            DAMP_REBOUND_LR:'RL REBOUND', DAMP_REBOUND_RR:'RR REBOUND',
            ROD_LENGTH_LF:'FL RIDE HEIGHT', ROD_LENGTH_RF:'FR RIDE HEIGHT',
            ROD_LENGTH_LR:'RL RIDE HEIGHT', ROD_LENGTH_RR:'RR RIDE HEIGHT',
            PRESSURE_LF:'FL PRESSURE', PRESSURE_RF:'FR PRESSURE',
            PRESSURE_LR:'RL PRESSURE', PRESSURE_RR:'RR PRESSURE',
            BRAKE_POWER_MULT:'BRAKE POWER', ARB_FRONT:'FRONT ARB',
            ARB_REAR:'REAR ARB',        FUEL:'FUEL LOAD',
        };
        if (lbl) lbl.innerText = labels[key] || key;
        if (msg) msg.innerText = fb;
        box.classList.remove('hidden');
    }

    function computeWarnings() {
        if (!car) return [];
        const w   = [];
        const add = (param, msg, level) => w.push({ param, msg, level });

        const sr     = calcSpringRatio();
        const brR    = calcBumpRebFrontRatio();
        const rebF   = ((values.DAMP_REBOUND_LF || 0) + (values.DAMP_REBOUND_RF || 0)) / 2;
        const rebR   = ((values.DAMP_REBOUND_LR || 0) + (values.DAMP_REBOUND_RR || 0)) / 2;
        const bumpF  = ((values.DAMP_BUMP_LF    || 0) + (values.DAMP_BUMP_RF    || 0)) / 2;
        const bumpR  = ((values.DAMP_BUMP_LR    || 0) + (values.DAMP_BUMP_RR    || 0)) / 2;
        const camR   = (Math.abs(values.CAMBER_LR || 0) + Math.abs(values.CAMBER_RR || 0)) / 2;
        const toeR   = ((values.TOE_OUT_LR || 0) + (values.TOE_OUT_RR || 0)) / 2;
        const pMin   = Math.min(values.PRESSURE_LF||99, values.PRESSURE_RF||99, values.PRESSURE_LR||99, values.PRESSURE_RR||99);
        const pMax   = Math.max(values.PRESSURE_LF||0,  values.PRESSURE_RF||0,  values.PRESSURE_LR||0,  values.PRESSURE_RR||0);
        const rodF   = Math.max(values.ROD_LENGTH_LF || 0, values.ROD_LENGTH_RF || 0);
        const rodR   = Math.max(values.ROD_LENGTH_LR || 0, values.ROD_LENGTH_RR || 0);
        const arbF   = values.ARB_FRONT !== undefined ? values.ARB_FRONT : 2;
        const arbR   = values.ARB_REAR  !== undefined ? values.ARB_REAR  : 1;
        const brake  = values.BRAKE_POWER_MULT || 0;
        const fuel   = values.FUEL || 0;
        const springF = ((values.SPRING_RATE_LF || 0) + (values.SPRING_RATE_RF || 0)) / 2;
        const springR = ((values.SPRING_RATE_LR || 0) + (values.SPRING_RATE_RR || 0)) / 2;

        // ── CRITICAL (red) — Section 5 ───────────────────────────────────────
        if (sr.ratio > 0 && sr.ratio > 0.90)
            add('SPRING', 'F/R ratio ' + sr.ratio.toFixed(3) + ' > 0.90 — structural oversteer risk', 'error');
        if (sr.ratio > 0 && sr.ratio < 0.60)
            add('SPRING', 'F/R ratio ' + sr.ratio.toFixed(3) + ' < 0.60 — severe uncontrollable understeer', 'error');
        if (brR > 1.50)
            add('DAMP F', 'Front B/R ratio ' + brR.toFixed(2) + ' > 1.50 — platform float in corners', 'error');
        if (rebR < rebF)
            add('REBOUND', 'Rear rebound (' + rebR.toFixed(1) + ') < front (' + rebF.toFixed(1) + ') — snap oversteer on lift-off', 'error');
        if (pMin < 16)
            add('PRESSURE', 'Pressure below 16 PSI — puncture risk, geometry loss', 'error');
        if (pMax > 23)
            add('PRESSURE', 'Pressure above 23 PSI — tire outside thermal window', 'error');
        if (rodF > 6 || rodR > 6)
            add('ROD LEN', 'Rod length > 6 — bottoms out on any circuit with bumps', 'error');
        if (camR < 14)
            add('CAMBER R', 'Rear camber only ' + (-camR/10).toFixed(1) + '° — insufficient lateral grip in corners', 'error');
        if (camR > 24)
            add('CAMBER R', 'Rear camber ' + (-camR/10).toFixed(1) + '° — extreme overheat and accelerated wear', 'error');
        if (arbF !== 2)
            add('ARB F', 'Front ARB = ' + arbF + ' (not 2) — unconventional, severe oversteer risk. Use spring rate to adjust balance.', 'error');
        if (Math.abs((values.TOE_OUT_LR || 0) - (values.TOE_OUT_RR || 0)) > 3)
            add('TOE R', 'Rear toe L/R gap > 3 — the car pulls to one side under braking', 'error');

        // ── YELLOW WARNINGS — Section 5 ──────────────────────────────────────
        if (springF === 42 && rodF === 0)
            add('SPRING', 'Spring 42 N/mm + Rod F=0: valid but may lack front load at high speed', 'warn');
        if (bumpR > bumpF + 2)
            add('DAMP R', 'Rear bump (' + bumpR + ') > front by ' + (bumpR - bumpF) + ' — stiff rear, oversteer on bumps', 'warn');
        if (camR >= 20 && ambientTemp < 15)
            add('CAMBER R', 'Camber ' + (-camR/10).toFixed(1) + '° with cold track — oversteer risk on cold tires', 'warn');
        if (rebF === 9 && springF === 42)
            add('DAMP F', 'Rebound 9 + spring 42 N/mm: slow nose recovery — unstable at high speed', 'warn');
        if (fuel > 22)
            add('FUEL', fuel + ' L fuel — extra weight stresses springs. Consider +2 N/mm spring rate.', 'warn');
        if (rodF > 4 && bumpF < 6)
            add('ROD LEN', 'Rod F > 4 with bump < 6 — bottoming risk under compression', 'warn');
        if (brR > 1.35)
            add('DAMP F', 'Front B/R ratio ' + brR.toFixed(2) + ' > 1.35 — float risk in slow corners', 'warn');
        if (springR >= 77 && rebR > 8)
            add('SPRING R', 'Spring 77 N/mm + rear rebound > 8 — rear oscillation risk. Reduce rebound to ≤ 7.', 'warn');
        if (brake > 95)
            add('BRAKE', brake + '% brake power — ABS over-triggers in long races', 'warn');

        // ── GREEN TIPS — Section 5 ────────────────────────────────────────────
        if (sr.ratio >= 0.68 && sr.ratio <= 0.72)
            add('SPRING', 'F/R ratio ' + sr.ratio.toFixed(3) + ' — optimal for most circuits ✓', 'ok');
        if (brR >= 0.85 && brR <= 1.15)
            add('DAMP F', 'Front B/R ratio ' + brR.toFixed(2) + ' — well balanced dampers ✓', 'ok');
        const hotP = calcHotPressureEst();
        if (hotP >= 19.5 && hotP <= 22)
            add('PRESSURE', 'Est. hot pressure ~' + hotP.toFixed(1) + ' PSI — correct thermal window ✓', 'ok');
        if (camR >= 18 && camR <= 21)
            add('CAMBER R', 'Rear camber ' + (-camR/10).toFixed(1) + '° — competition-proven range ✓', 'ok');
        if (toeR >= 31 && toeR <= 34)
            add('TOE R', 'Rear toe ' + (toeR/100).toFixed(2) + '° — safe validated range ✓', 'ok');

        // ── ASYMMETRY INFO ────────────────────────────────────────────────────
        [['CAMBER_LF','CAMBER_RF','CAMBER F'],
         ['CAMBER_LR','CAMBER_RR','CAMBER R'],
         ['PRESSURE_LF','PRESSURE_RF','PRESS F'],
         ['SPRING_RATE_LF','SPRING_RATE_RF','SPRING F'],
         ['DAMP_BUMP_LF','DAMP_BUMP_RF','BUMP F'],
         ['DAMP_REBOUND_LF','DAMP_REBOUND_RF','REBOUND F']].forEach(function([lk,rk,label]) {
            const diff = Math.abs((values[lk] || 0) - (values[rk] || 0));
            if (diff > 2) add(label, 'L/R gap of ' + diff + ' — circuit asymmetry: verify it is intentional', 'info');
        });

        // Sort: errors first, then warns, info, ok
        const order = { error: 0, warn: 1, info: 2, ok: 3 };
        w.sort((a, b) => (order[a.level] || 9) - (order[b.level] || 9));
        return w;
    }

    function updateSpringRatioUI() {
        const sr     = calcSpringRatio();
        const valEl  = el('ac-spring-ratio-val');
        const zoneEl = el('ac-spring-ratio-zone');
        if (valEl)  { valEl.innerText  = sr.ratio.toFixed(3); valEl.style.color  = sr.color; }
        if (zoneEl) { zoneEl.innerText = sr.zone;             zoneEl.style.color = sr.color; }
    }

    function updateStabilityUI() {
        const score = calcStabilityScore();
        const valEl = el('ac-stability-val');
        const barEl = el('ac-stability-bar');
        if (!valEl || !barEl) return;
        valEl.innerText         = score;
        barEl.style.width       = score + '%';
        const color             = score >= 70 ? '#30d98a' : score >= 45 ? '#ff8c40' : '#e84040';
        barEl.style.background  = color;
        valEl.style.color       = color;
    }

    function updateUSOS_UI() {
        const score = calcUSOS();
        const valEl = el('ac-usos-val');
        const barEl = el('ac-usos-bar');
        const lblEl = el('ac-usos-lbl');
        if (!valEl || !barEl) return;
        const absPct = Math.abs(score) / 2;        // maps ±100 → 0-50% width
        barEl.style.width      = absPct + '%';
        barEl.style.left       = score >= 0 ? '50%' : (50 - absPct) + '%';
        const color            = score <= -15 ? '#3b9fff' : score >= 15 ? '#ff8c40' : '#30d98a';
        barEl.style.background = color;
        valEl.innerText        = (score > 0 ? '+' : '') + score;
        valEl.style.color      = color;
        const lbl = score <= -30 ? 'UNDERSTEER' : score <= -10 ? 'SLIGHT US'
                  : score <= 10  ? 'NEUTRAL'    : score <= 30  ? 'SLIGHT OS' : 'OVERSTEER';
        if (lblEl) { lblEl.innerText = lbl; lblEl.style.color = color; }
    }

    function updateCamberDeltaUI() {
        const delta  = calcCamberDelta();
        const valEl  = el('ac-camber-delta-val');
        const zoneEl = el('ac-camber-delta-zone');
        if (!valEl) return;
        valEl.innerText = delta.toFixed(1);
        let zone, color;
        if      (delta <  14) { zone = 'OS RISK';   color = '#e84040'; }
        else if (delta <  17) { zone = 'SLIGHT OS'; color = '#ff8c40'; }
        else if (delta <= 21) { zone = 'IDEAL';     color = '#30d98a'; }
        else if (delta <= 23) { zone = 'SLIGHT US'; color = '#ff8c40'; }
        else                  { zone = 'BASE US';   color = '#3b9fff'; }
        valEl.style.color  = color;
        if (zoneEl) { zoneEl.innerText = zone; zoneEl.style.color = color; }
    }

    function updateHotPressureUI() {
        const hotP  = calcHotPressureEst();
        const valEl = el('ac-hot-pressure-val');
        if (!valEl) return;
        valEl.innerText   = hotP.toFixed(1);
        const color       = hotP < 19.5 ? '#ff8c40' : hotP <= 22 ? '#30d98a' : '#e84040';
        valEl.style.color = color;
    }

    function updateWarningsUI() {
        const container = el('ac-warnings');
        if (!container) return;
        const warnings = computeWarnings();
        if (!warnings.length) {
            container.innerHTML = '<div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(48,217,138,0.05);border:1px solid rgba(48,217,138,0.12)"><span style="color:#30d98a;font-size:9px;font-weight:700">✓</span><span style="font-size:9px;color:#5a7390;font-family:Barlow Condensed,sans-serif;letter-spacing:.07em;text-transform:uppercase">No warnings — setup within normal range</span></div>';
            return;
        }
        var cm = { error: '#e84040', warn: '#ff8c40', info: '#3b9fff', ok: '#30d98a' };
        container.innerHTML = warnings.map(function(w) {
            return '<div style="display:flex;gap:7px;padding:5px 8px;background:' + cm[w.level] + '0d;border:1px solid ' + cm[w.level] + '35;margin-bottom:2px">' +
                '<span style="color:' + cm[w.level] + ';font-size:9px;font-weight:700;font-family:Barlow Condensed,sans-serif;letter-spacing:.05em;text-transform:uppercase;min-width:54px;flex-shrink:0">' + w.param + '</span>' +
                '<span style="font-size:9px;color:#8ca8bf;line-height:1.45">' + w.msg + '</span>' +
                '</div>';
        }).join('');
    }

    function updatePressureHintUI() {
        var hintEl = el('ac-pressure-hint');
        if (!hintEl) return;
        var adj = pressureAdjForTemp(ambientTemp);
        if (adj === 0) {
            hintEl.innerText    = 'Pressures optimal for 20°C ambient conditions';
            hintEl.style.color  = '#5a7390';
        } else if (adj > 0) {
            hintEl.innerText    = 'Cold weather: set pressures +' + adj + ' PSI above working target — air expands when hot';
            hintEl.style.color  = '#ff8c40';
        } else {
            hintEl.innerText    = 'Hot weather: reduce by 1 PSI — tires reach working range faster';
            hintEl.style.color  = '#3b9fff';
        }
    }

    function updateAnalysis() {
        if (!car) return;
        updateSpringRatioUI();
        updateStabilityUI();
        updateUSOS_UI();
        updateCamberDeltaUI();
        updateHotPressureUI();
        updateWarningsUI();
        updatePressureHintUI();
        updateACChartUI();
    }

    // ── Session toggle Q / R ──────────────────────────────────────────────────
    // Analysis: Q→R the ONLY change is +8L fuel. Pressures do not change.
    function initSession() {
        var btnQ = el('ac-session-q');
        var btnR = el('ac-session-r');
        if (!btnQ || !btnR) return;
        function activateSession(s) {
            session = s;
            [btnQ, btnR].forEach(function(b) {
                var on             = b.dataset.session === s;
                b.style.background = on ? 'rgba(255,255,255,0.06)' : 'transparent';
                b.style.color      = on ? 'white' : '';
                b.style.borderColor = on ? 'rgba(255,255,255,0.12)' : 'transparent';
            });
            if (s === 'R' && car) {
                fuelQ = values.FUEL;
                setValue('FUEL', Math.min(car.params.FUEL.max, (values.FUEL || 0) + 8));
            } else if (s === 'Q' && fuelQ !== null) {
                setValue('FUEL', fuelQ);
                fuelQ = null;
            }
        }
        btnQ.onclick = function() { activateSession('Q'); };
        btnR.onclick = function() { activateSession('R'); };
        activateSession('Q');
    }

    // ── Ambient temperature selector ──────────────────────────────────────────
    function initTempSelector() {
        document.querySelectorAll('.ac-temp-btn').forEach(function(btn) {
            btn.onclick = function() {
                ambientTemp = parseInt(btn.dataset.temp, 10);
                document.querySelectorAll('.ac-temp-btn').forEach(function(b) {
                    var on              = parseInt(b.dataset.temp, 10) === ambientTemp;
                    b.style.background  = on ? 'rgba(255,255,255,0.08)' : 'transparent';
                    b.style.color       = on ? 'white' : '';
                    b.style.borderColor = on ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)';
                });
                updatePressureHintUI();
            };
        });
        var def = document.querySelector('.ac-temp-btn[data-temp="20"]');
        if (def) def.click();
    }

    // ── Tab switching ─────────────────────────────────────────────────────────
    function initTabs() {
        document.querySelectorAll('.ac-tab-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.ac-tab-btn').forEach(b => {
                    b.classList.remove('active', 'bg-panel', 'text-white');
                    b.classList.add('text-slate-500');
                    b.style.borderColor = 'transparent';
                });
                document.querySelectorAll('.ac-tab-content').forEach(t => t.classList.add('hidden'));

                btn.classList.add('active', 'bg-panel', 'text-white');
                btn.classList.remove('text-slate-500');
                btn.style.borderColor = 'rgba(255,255,255,0.05)';

                const target = el(btn.dataset.target);
                if (target) target.classList.remove('hidden');
            };
        });
        // Set first tab active visually
        const firstBtn = document.querySelector('.ac-tab-btn[data-target="ac-tab-tires"]');
        if (firstBtn) firstBtn.style.borderColor = 'rgba(255,255,255,0.05)';
    }

    // ── Export .INI ───────────────────────────────────────────────────────────
    function exportINI() {
        if (!car) return;
        const lines = [];
        car.exportOrder.forEach(key => {
            const val = values[key];
            if (val === undefined) return;
            lines.push('[' + key + ']');
            lines.push('VALUE=' + val);
            lines.push('');
        });
        lines.push('[CAR]');
        lines.push('MODEL=' + car.acModel);
        lines.push('');

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = car.id + '_setup.ini';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ── Preset management ─────────────────────────────────────────────────────
    function storageKey() {
        return 'ac_setup_' + (car ? car.id : 'unknown') + '_v1';
    }

    function applyValues(vals) {
        Object.entries(vals).forEach(([key, val]) => setValue(key, val));
        updateAnalysis();
    }

    function renderPresets() {
        const container = el('ac-preset-container');
        if (!container || !car) return;
        container.innerHTML = '';

        // ── Circuit / track presets ───────────────────────────────────────────
        const trackDB = window.AC_TRACK_SETUPS && window.AC_TRACK_SETUPS[car.id];
        if (trackDB && selectedTrack && trackDB[selectedTrack]) {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'border:1px solid rgba(255,165,0,0.12);margin-bottom:8px;overflow:hidden;border-radius:var(--radius-sm)';
            Object.entries(trackDB[selectedTrack]).forEach(([name, vals]) => {
                const isQ  = /\bQ$/i.test(name.trim());
                const accent = isQ ? 'var(--orange)' : 'var(--blue)';
                const btn  = document.createElement('button');
                btn.style.cssText = 'display:flex;align-items:center;width:100%;text-align:left;padding:7px 10px;background:rgba(255,255,255,0.01);border:none;border-bottom:1px solid rgba(255,255,255,0.03);cursor:pointer;transition:background .15s';
                btn.innerHTML =
                    '<div style="width:3px;height:28px;background:' + accent + ';opacity:0.5;margin-right:10px;border-radius:2px;flex-shrink:0"></div>' +
                    '<span style="font-size:9px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:' + accent + ';flex:1;font-family:\"Barlow Condensed\",sans-serif">' + name + '</span>' +
                    '<span style="font-size:8px;color:#3d5068;font-family:\"Share Tech Mono\",monospace;flex-shrink:0">' + vals.FUEL + 'L&nbsp;·&nbsp;F' + vals.PRESSURE_LF + '/R' + vals.PRESSURE_RF + '</span>';
                btn.onmouseenter = () => { btn.style.background = 'rgba(255,255,255,0.04)'; };
                btn.onmouseleave = () => { btn.style.background = 'rgba(255,255,255,0.01)'; };
                btn.onclick = () => {
                    applyValues(vals);
                    wrap.querySelectorAll('button').forEach(b => { b.style.outline = 'none'; });
                    btn.style.outline = '1px solid ' + accent;
                };
                wrap.appendChild(btn);
            });
            container.appendChild(wrap);

            // Divider
            const div = document.createElement('div');
            div.style.cssText = 'border-top:1px solid rgba(255,255,255,0.05);margin:6px 0 6px;';
            container.appendChild(div);
        }

        const palette = {
            factory: { color: 'var(--orange)', dot: 'bg-amber-500', text: 'text-amber-500/90' },
            preset:  { color: 'var(--blue)',   dot: 'bg-blue-500',  text: 'text-slate-300' },
            saved:   { color: 'var(--green)',  dot: 'bg-emerald-500', text: 'text-slate-300' },
        };

        function makeBtn(title, subtitle, onClick, type) {
            const pal = palette[type] || palette.saved;
            const btn = document.createElement('button');
            btn.className = 'preset-btn group';
            btn.style.cssText = 'display:flex;align-items:center;width:100%;text-align:left;padding:8px 12px;margin-bottom:2px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.04);border-radius:var(--radius-sm);transition:all 0.2s ease';
            btn.innerHTML = `
                <div class="w-1 h-3 ${pal.dot} rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0"></div>
                <div class="flex flex-col min-w-0">
                    <span class="text-[10px] font-black tracking-widest uppercase ${pal.text} group-hover:text-white transition-colors">${title}</span>
                    <span class="text-[8px] text-slate-500 font-bold uppercase tracking-tight truncate">${subtitle}</span>
                </div>`;
            btn.onclick = () => {
                onClick();
                container.querySelectorAll('.preset-btn').forEach(b => {
                    b.style.background = 'rgba(255,255,255,0.015)';
                    b.style.borderColor = 'rgba(255,255,255,0.04)';
                });
                btn.style.background = `linear-gradient(90deg, ${pal.color}28, transparent)`;
                btn.style.borderColor = pal.color;
            };
            return btn;
        }

        // Factory defaults
        const defBtn = makeBtn('Base', 'Factory Defaults', () => {
            Object.keys(car.params).forEach(key => setValue(key, car.params[key].default));
        }, 'factory');
        defBtn.style.background = 'linear-gradient(90deg, var(--orange)28, transparent)';
        defBtn.style.borderColor = 'var(--orange)';
        container.appendChild(defBtn);

        // Built-in presets
        if (car.presets) {
            Object.entries(car.presets).forEach(([name, data]) => {
                container.appendChild(makeBtn(name, data.desc || 'Preset', () => applyValues(data.values), 'preset'));
            });
        }

        // User-saved setups
        const saved = JSON.parse(localStorage.getItem(storageKey()) || '[]');
        saved.forEach(item => {
            container.appendChild(makeBtn(
                item.name,
                new Date(item.date).toLocaleDateString(),
                () => applyValues(item.values),
                'saved'
            ));
        });
    }

    function saveSetup() {
        const name = prompt('Enter setup name:', 'My Setup');
        if (!name) return;
        const key = storageKey();
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        saved.push({ name, date: new Date().toISOString(), values: { ...values } });
        localStorage.setItem(key, JSON.stringify(saved));
        renderPresets();
    }

    // ── Load a car ────────────────────────────────────────────────────────────
    function loadCar(carId) {
        if (!window.AC_CARS || !window.AC_CARS[carId]) return;
        car = window.AC_CARS[carId];

        // Reset to defaults
        values = {};
        Object.keys(car.params).forEach(key => { values[key] = car.params[key].default; });

        bindSliders();
        Object.keys(values).forEach(key => updateDisplay(key));
        updateACTrackDisplay();
        renderPresets();
        updateAnalysis();
    }

    // ── AC Circuit sidebar selector ───────────────────────────────────────────
    function updateACTrackDisplay() {
        const trackEl = el('ac-currentTrack');
        const countEl = el('ac-trackSetupCount');
        if (trackEl) {
            trackEl.innerText = selectedTrack ? selectedTrack.toUpperCase() : '— SELECT CIRCUIT —';
        }
        if (countEl) {
            const trackDB = car && window.AC_TRACK_SETUPS && window.AC_TRACK_SETUPS[car.id];
            const count = selectedTrack && trackDB && trackDB[selectedTrack]
                ? Object.keys(trackDB[selectedTrack]).length : 0;
            countEl.innerText = count ? count + ' SETUPS' : '0';
        }
    }

    function renderACTrackDropdown() {
        const dropdown = el('ac-trackDropdown');
        if (!dropdown || !car) return;
        dropdown.innerHTML = '';

        const trackDB = window.AC_TRACK_SETUPS && window.AC_TRACK_SETUPS[car.id];
        if (!trackDB) {
            const empty = document.createElement('div');
            empty.style.cssText = 'padding:8px 12px;font-size:9px;color:#3d5068;text-transform:uppercase;letter-spacing:.08em';
            empty.textContent = 'No circuits available';
            dropdown.appendChild(empty);
            return;
        }

        Object.keys(trackDB).forEach(function(trackName) {
            const isActive = trackName === selectedTrack;
            const btn = document.createElement('button');
            btn.className = 'dropdown-item' + (isActive ? ' active' : '');
            const count = Object.keys(trackDB[trackName]).length;
            btn.innerHTML =
                '<span class="track-name">' + trackName + '</span>' +
                '<span style="font-size:8px;color:#3d5068;font-family:\'Share Tech Mono\',monospace;flex-shrink:0">' + count + ' setups</span>';
            btn.onclick = function() {
                selectedTrack = trackName;
                updateACTrackDisplay();
                dropdown.classList.remove('show');
                renderPresets();
            };
            dropdown.appendChild(btn);
        });
    }

    function initACTrackDropdown() {
        const btn      = el('ac-openTrackBtn');
        const dropdown = el('ac-trackDropdown');
        if (!btn || !dropdown) return;

        btn.onclick = function(e) {
            e.stopPropagation();
            const isShown = dropdown.classList.contains('show');
            if (isShown) {
                dropdown.classList.remove('show');
            } else {
                renderACTrackDropdown();
                dropdown.classList.add('show');
            }
        };

        window.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && e.target !== btn) {
                dropdown.classList.remove('show');
            }
        });
    }

    // ── Public init ───────────────────────────────────────────────────────────
    function init() {
        if (_initialized) return;
        _initialized = true;

        initTabs();
        initSession();
        initTempSelector();
        initACTrackDropdown();
        initACChart();

        const exportBtn = el('ac-export-btn');
        if (exportBtn) exportBtn.onclick = exportINI;

        const saveBtn = el('ac-save-btn');
        if (saveBtn) saveBtn.onclick = saveSetup;

        if (window.AC_CARS) {
            loadCar(Object.keys(window.AC_CARS)[0]);
        }
    }

    // Auto-init if page was already set to AC mode when this script loaded
    if (document.body.getAttribute('data-game') === 'ac') {
        init();
    }

    return {
        init,
        loadCar,
        get currentCarId() { return car ? car.id : null; },
    };
})();
