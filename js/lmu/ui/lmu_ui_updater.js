function updateSliderFill(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.setProperty('--val', pct + '%');
}

const getArbLabel = (val, type = 'farb') => {
    const config = window.LMA_Utils && window.CAR ? window.LMA_Utils.getItemConfig(window.CAR, type) : null;
    if (config && config.type === 'labeled') {
        const opt = config.options[val];
        return typeof opt === 'object' ? opt.label : opt;
    }
    if (window.CAR && window.CAR.ranges && window.CAR.ranges[type] && window.CAR.ranges[type].labels) {
        return window.CAR.ranges[type].labels[val] || val;
    }
    return val === 0 ? 'Detached' : `P${val}`;
};

function update() {
    const els = window.LMA_UI ? window.LMA_UI.els : {};
    const CAR = window.CAR;
    const DEFAULTS = window.DEFAULTS || {};
    const SELECTED_TRACK_ID = window.SELECTED_TRACK_ID;
    const { clamp, getPt, shapeDamp } = window.LMA_Formulas || {};
    const { getThermalGrip, getStandardizedDelta, getPhysVal } = window.LMU_Formulas || {};



    const getItemConfig = (id) => window.LMA_Utils ? window.LMA_Utils.getItemConfig(CAR, id) : null;
    const getParamRange = (id) => window.LMA_Utils ? window.LMA_Utils.getParamRange(CAR, id) : { min: 0, max: 100, step: 1 };

    if (els.carName && CAR) {
        els.carName.innerText = CAR.name.toUpperCase();
    }

    const vals = {};
    Object.keys(DEFAULTS).forEach(key => {
        if (els[key] && els[key].value !== undefined) {
            vals[key] = Math.round(parseFloat(els[key].value) * 10000000) / 10000000;
        } else {
            vals[key] = DEFAULTS[key];
        }
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
                    let degDecimals = 2;
                    if (readoutId === 'wing') degDecimals = 1;
                    else if (readoutId === 'ftoe' || readoutId === 'rtoe') degDecimals = 3;
                    displayVal = parseFloat(displayVal).toFixed(degDecimals) + unit;
                }

                if (config.prefix && typeof displayVal === 'string' && !displayVal.startsWith(config.prefix)) {
                    displayVal = config.prefix + displayVal;
                }
            } else if (CAR && CAR.ranges && CAR.ranges[readoutId]) {
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


    setLabel('fbd', vals.fbd);
    setLabel('rbd', vals.rbd);

    // Suspension
    let fsVal = CAR && CAR.formatters && CAR.formatters.fs ? CAR.formatters.fs(vals.fs) : vals.fs;
    let rsVal = CAR && CAR.formatters && CAR.formatters.rs ? CAR.formatters.rs(vals.rs) : vals.rs;

    setLabel('fs', fsVal, 'fs');
    setLabel('rs', rsVal, 'rs');
    setLabel('fpk', vals.fpk, 'fpk');
    setLabel('rpk', vals.rpk, 'rpk');

    if (vals.third_Fspring !== undefined) {
        let third_FspringVal = CAR && CAR.formatters && CAR.formatters.third_Fspring ? CAR.formatters.third_Fspring(vals.third_Fspring) : vals.third_Fspring;
        let third_RspringVal = CAR && CAR.formatters && CAR.formatters.third_Rspring ? CAR.formatters.third_Rspring(vals.third_Rspring) : vals.third_Rspring;
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
    if (els.farbV) els.farbV.innerText = getArbLabel(vals.farb, 'farb');
    if (els.rarbV) els.rarbV.innerText = getArbLabel(vals.rarb, 'rarb');
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
    if (els.rakeV) els.rakeV.innerText = `${rake >= 0 ? '+' : ''}${rake.toFixed(rakeDecimals)}${rhUnit}`;


    if (window.GLOBAL_TRACKS && SELECTED_TRACK_ID) {
        let track = window.LMA_TracksManager ? window.LMA_TracksManager.getTrackData(SELECTED_TRACK_ID) : window.GLOBAL_TRACKS[SELECTED_TRACK_ID];

        if (els.trackAdvice && track) {
            els.trackAdvice.innerText = track.setupAdvice || "Focus on a balanced setup for this track's specific layout.";
        }
    }

    if (!CAR) return;

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
    let aeroSensitivity = 1.0;
    if (CAR.id.includes('lmp2')) {
        aeroSensitivity = 1.5;
    } else if (CAR.id.includes('lmp3')) {
        aeroSensitivity = 1.25;
    }
    const tyreWindow = phys.tyreWindow || [80, 90];

    const physValLocal = (id, val) => getPhysVal(id, val, CAR);
    const getRangeDelta = (id) => {
        const r = getParamRange(id);
        return r.max - r.min;
    };

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

    const stdDeltaLocal = (id, raw) => getStandardizedDelta(CAR, DEFAULTS, id, raw);

    const nWing = stdDeltaLocal('wing', vals.wing);
    const nFARB = stdDeltaLocal('farb', vals.farb);
    const nRARB = stdDeltaLocal('rarb', vals.rarb);
    const nFS = stdDeltaLocal('fs', vals.fs);
    const nRS = stdDeltaLocal('rs', vals.rs);
    const nFH = stdDeltaLocal('fh', vals.fh);
    const nRH = stdDeltaLocal('rh', vals.rh);
    const nFToe = stdDeltaLocal('ftoe', vals.ftoe);
    const nRToe = stdDeltaLocal('rtoe', vals.rtoe);
    const nFCam = stdDeltaLocal('fcam', vals.fcam);
    const nRCam = stdDeltaLocal('rcam', vals.rcam);

    const optPress = (CAR.physics && CAR.physics.tyre_physics && CAR.physics.tyre_physics.compound_medium ? CAR.physics.tyre_physics.compound_medium.optimal_pressure_kpa : 190);

    const nPressF = (vals.tpressure_f - optPress) / (getRangeDelta('tpressure_f') || 1);
    const nPressR = (vals.tpressure_r - optPress) / (getRangeDelta('tpressure_r') || 1);
    const nFBD = stdDeltaLocal('fbd', vals.fbd);
    const nRBD = stdDeltaLocal('rbd', vals.rbd);

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

    // Weather / Heat
    const trackTemp = els.trackTemp && els.trackTemp.value !== undefined ? parseFloat(els.trackTemp.value) : 25;
    const weatherVal = document.querySelector('.weather-chip.active')?.dataset.value || 'clear';
    const weatherFactors = { 'clear': 0, 'cloudy': -5, 'drizzle': -12, 'rain': -20, 'storm': -30 };
    const weatherFactor = weatherFactors[weatherVal] ?? 0;
    const baseHeat = trackTemp + weatherFactor;

    const fDuctHeat = physValLocal('fbd', vals.fbd) * 26;
    const rDuctHeat = physValLocal('rbd', vals.rbd) * 20;

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

    // We get current compound from UI buttons if available, or assume MEDIUM
    let currentCompound = window.currentCompound || 'MEDIUM';
    const activeCompBtn = document.querySelector('.comp-btn.active');
    if (activeCompBtn && activeCompBtn.dataset.type) {
        currentCompound = activeCompBtn.dataset.type;
    }

    const cmpProfile = compoundProfiles[currentCompound] || compoundProfiles['MEDIUM'];

    const moistureLevel = { 'clear': 0, 'cloudy': 0.04, 'drizzle': 0.35, 'rain': 0.75, 'storm': 1.0 };
    const moisture = moistureLevel[weatherVal] ?? 0;
    const effectiveCmpGrip = cmpProfile.peak * (1 - moisture) + cmpProfile.peak * cmpProfile.wetGrip * moisture;

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

    if (els.spiderPoly) {
        els.spiderPoly.setAttribute('points',
            `${getPt(0, finalStab)} ${getPt(72, finalGrip)} ${getPt(144, finalRot)} ${getPt(216, finalAbs)} ${getPt(288, finalSpd)}`
        );
    }

    if (window.GLOBAL_TRACKS && SELECTED_TRACK_ID) {
        let track = window.LMA_TracksManager ? window.LMA_TracksManager.getTrackData(SELECTED_TRACK_ID) : window.GLOBAL_TRACKS[SELECTED_TRACK_ID];
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
            const trackScale = window.LMA_TracksManager ? window.LMA_TracksManager.getCarGhostScale() : 1;

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
    if (els.cop) els.cop.style.left = copPos + "%";
    if (els.fP) els.fP.innerText = (100 - copPos).toFixed(0) + "%";
    if (els.rP) els.rP.innerText = copPos.toFixed(0) + "%";

    const balanceRaw = finalRot - finalStab;
    const balanceLevel = Math.round(balanceRaw / 3.5);
    const clampedLevel = Math.max(-10, Math.min(10, balanceLevel));

    if (els.steerStatus) {
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

    if (els.trackTempV) {
        els.trackTempV.innerText = `${trackTemp}°C`;

        // Update color based on temperature
        els.trackTempV.classList.remove('text-amber-500', 'text-slate-500', 'text-green-500', 'text-red-500');
        if (trackTemp < 20) {
            els.trackTempV.classList.add('text-slate-500'); // Cold
        } else if (trackTemp <= 40) {
            els.trackTempV.classList.add('text-green-500'); // Normal
        } else {
            els.trackTempV.classList.add('text-red-500'); // Hot
        }
    }
}

window.updateSliderFill = updateSliderFill;
window.update = update;

window.LMA_UIUpdater = {
    updateSliderFill,
    update
};
