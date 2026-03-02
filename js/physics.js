window.LMA_Physics = {
    simulate: (car, setup, env) => {
        const utils = window.LMA_Utils;
        const formulas = window.LMA_Formulas;
        const phys = car.physics || {};

        const wheelbase = phys.wheelbase_m ?? 2.7;
        const motionRatioF = phys.motion_ratio?.front ?? 0.8;
        const motionRatioR = phys.motion_ratio?.rear ?? 0.8;
        const aero = phys.aero || {};
        const baseCl = aero.base_cl ?? -3.0;
        const copFront = aero.cop_front ?? 0.40;
        const aeroSensitivity = phys.aeroSensitivity ?? 1.0;
        const mechanicalBias = phys.weight_dist_f ?? 0.50;
        const damperCurve = phys.damperCurve || 'linear';
        const tyreWindow = phys.tyreWindow || [80, 90];

        const getRangeDelta = (id) => {
            const r = window.LMA_Utils.getParamRange(car, id);
            return Math.abs(r.max - r.min) || 1;
        };

        const getPhysVal = (id, sliderVal) => window.LMA_Formulas.getPhysVal(id, sliderVal, car);

        const getStandardizedDelta = (id, rawVal) => window.LMA_Formulas.getStandardizedDelta(car, env.defaults, id, rawVal);

        const nWing = getStandardizedDelta('wing', setup.wing);

        // Handle ARB Stiffness
        const getARBStiff = (id, val) => {
            const config = utils.getItemConfig(car, id);
            if (config && config.type === 'labeled') {
                const opt = config.options[val];
                const label = (typeof opt === 'object' ? opt.label : opt);
                const currentK = formulas.calculateARBStiffness(label);

                const defOpt = config.options[env.defaults[id]];
                const defLabel = (typeof defOpt === 'object' ? defOpt.label : defOpt);
                const defaultK = formulas.calculateARBStiffness(defLabel);

                if (defaultK === 0) return 0;
                return (currentK - defaultK) / defaultK;
            }
            return getStandardizedDelta(id, val);
        };

        const nFARB = getARBStiff('farb', setup.farb);
        const nRARB = getARBStiff('rarb', setup.rarb);

        const nFS = getStandardizedDelta('fs', setup.fs);
        const nRS = getStandardizedDelta('rs', setup.rs);
        const nFH = getStandardizedDelta('fh', setup.fh);
        const nRH = getStandardizedDelta('rh', setup.rh);

        const optPress = (phys.tyre_physics?.compound_medium?.optimal_pressure_kpa) || 190;



        const fsrRange = utils.getParamRange(car, 'fsr');
        const ffbRange = utils.getParamRange(car, 'ffb');
        const ffrRange = utils.getParamRange(car, 'ffr');
        const rsbRange = utils.getParamRange(car, 'rsb');
        const rsrRange = utils.getParamRange(car, 'rsr');
        const rfbRange = utils.getParamRange(car, 'rfb');
        const rfrRange = utils.getParamRange(car, 'rfr');

        const fSlowRange = (fsbRange.max + fsrRange.max) / 2;
        const fFastRange = (ffbRange.max + ffrRange.max) / 2;
        const rSlowRange = (rsbRange.max + rsrRange.max) / 2;
        const rFastRange = (rfbRange.max + rfrRange.max) / 2;

        const nFSlow = ((setup.fsb - env.defaults.fsb) + (setup.fsr - env.defaults.fsr)) / 2 / (fSlowRange || 1);
        const nRSlow = ((setup.rsb - env.defaults.rsb) + (setup.rsr - env.defaults.rsr)) / 2 / (rSlowRange || 1);
        const nFFast = ((setup.ffb - env.defaults.ffb) + (setup.ffr - env.defaults.ffr)) / 2 / (fFastRange || 1);
        const nRFast = ((setup.rfb - env.defaults.rfb) + (setup.rfr - env.defaults.rfr)) / 2 / (rFastRange || 1);

        const shapeDamp = (v) => {
            if (damperCurve === 'progressive') return v > 0 ? Math.min(v * v * 2.5, 1) : v;
            if (damperCurve === 'digressive') return v > 0 ? Math.min(Math.sqrt(v) * 1.2, 1) : v;
            return v;
        };

        const fpkRange = utils.getParamRange(car, 'fpk');
        const rpkRange = utils.getParamRange(car, 'rpk');
        let nPkr = ((setup.fpk + setup.rpk) - (env.defaults.fpk + env.defaults.rpk)) /
            ((Math.abs(fpkRange.max - fpkRange.min) + Math.abs(rpkRange.max - rpkRange.min)) / 2 || 1);

        let nHSS = 0;
        if (setup.third_Fspring !== undefined) {
            const tfRange = utils.getParamRange(car, 'third_Fspring');
            const trRange = utils.getParamRange(car, 'third_Rspring');
            const f3 = (setup.third_Fspring - env.defaults.third_Fspring) / (Math.abs(tfRange.max - tfRange.min) || 1);
            const r3 = (setup.third_Rspring - env.defaults.third_Rspring) / (Math.abs(trRange.max - trRange.min) || 1);
            nHSS = (f3 + r3) / 2;

            const tfpkRange = utils.getParamRange(car, 'third_fpk');
            const trpkRange = utils.getParamRange(car, 'third_rpk');
            const f3pk = (setup.third_fpk - env.defaults.third_fpk) / (Math.abs(tfpkRange.max - tfpkRange.min) || 1);
            const r3pk = (setup.third_rpk - env.defaults.third_rpk) / (Math.abs(trpkRange.max - trpkRange.min) || 1);
            nPkr = (nPkr + (f3pk + r3pk) / 2) / 2;
        }

        const fhConfig = utils.getItemConfig(car, 'fh');
        const fhAbs = (fhConfig && fhConfig.unit === 'mm') ? setup.fh / 10 : setup.fh;
        const stallThreshold = 4.8;
        const groundEffect = fhAbs < stallThreshold
            ? Math.max(0.5, 1 - ((stallThreshold - fhAbs) * 1.5))
            : Math.min(1 + (6.5 - Math.max(fhAbs, 4.8)) * 0.15, 1.25);

        const rhConfig = utils.getItemConfig(car, 'rh');
        const normRakeVal = (rhConfig && rhConfig.unit === 'mm') ? (setup.rh - setup.fh) / 10 : (setup.rh - setup.fh);
        const normDefRake = (rhConfig && rhConfig.unit === 'mm') ? (env.defaults.rh - env.defaults.fh) / 10 : (env.defaults.rh - env.defaults.fh);
        const nRake = (normRakeVal - normDefRake) / 5.0 * (wheelbase / 2.7);

        const diffuserLoad = nRake * 0.35 * aeroSensitivity;
        const totalDownforce = Math.min(100, Math.max(5, (50 + (baseCl / -3.0) * 20 + nWing * 34 * aeroSensitivity + diffuserLoad * 20 + nHSS * 7 + nPkr * 4 - Math.max(0, nRake - 1.2) * 45) * groundEffect));
        const copShift = nWing * 20 * aeroSensitivity + nRake * (-25) + nFH * 10 + (0.40 - copFront) * 50;

        const fRollStiff = (nFARB * 26 + nFS * 11) * motionRatioF;
        const rRollStiff = (nRARB * 26 + nRS * 11) * motionRatioR;
        const lltd = (fRollStiff - rRollStiff) * (0.4 + mechanicalBias);
        const weatherFactors = { 'clear': 0, 'cloudy': -5, 'drizzle': -12, 'rain': -20, 'storm': -30 };
        const weatherFactor = weatherFactors[env.weather] ?? 0;
        const baseHeat = env.trackTemp + weatherFactor;

        const fDuctHeat = getPhysVal('fbd', setup.fbd) * 26;
        const rDuctHeat = getPhysVal('rbd', setup.rbd) * 20;
        const fSpringHeatMod = nFS * 5;
        const rSpringHeatMod = nRS * 5;
        const fHystHeat = Math.max(0, (optPress + 5 - setup.tpressure_f) * 0.35);
        const rHystHeat = Math.max(0, (optPress + 5 - setup.tpressure_r) * 0.35);

        const fBaseHeat = Math.max(env.trackTemp, baseHeat + fDuctHeat + fSpringHeatMod + fHystHeat + 30);
        const rBaseHeat = Math.max(env.trackTemp, baseHeat + rDuctHeat + rSpringHeatMod + rHystHeat + 26);

        const fScrubHeat = (Math.abs(setup.ftoe) * 8) + (Math.abs(setup.fcam) * 3.5);
        const rScrubHeat = (Math.abs(setup.rtoe) * 8) + (Math.abs(setup.rcam) * 3.5);

        const fPressShift = (setup.tpressure_f - optPress) * 0.43;
        const rPressShift = (setup.tpressure_r - optPress) * 0.43;

        const heatF_C = Math.max(env.trackTemp, (fBaseHeat * 2 + fScrubHeat) / 2 + fPressShift);
        const heatR_C = Math.max(env.trackTemp, (rBaseHeat * 2 + rScrubHeat) / 2 + rPressShift);

        const compoundProfiles = {
            'SOFT': { peak: 1.06, lo: 70, hi: 85, degrade: 0.022, wetGrip: 0.44 },
            'MEDIUM': { peak: 1.00, lo: tyreWindow[0], hi: tyreWindow[1], degrade: 0.013, wetGrip: 0.50 },
            'HARD': { peak: 0.96, lo: 75, hi: 96, degrade: 0.008, wetGrip: 0.52 },
            'WET': { peak: 0.88, lo: 40, hi: 68, degrade: 0.032, wetGrip: 1.00 },
            'INTER': { peak: 0.93, lo: 55, hi: 78, degrade: 0.020, wetGrip: 0.88 }
        };
        const profile = compoundProfiles[env.compound] || compoundProfiles['MEDIUM'];
        const moistureValues = { 'clear': 0, 'cloudy': 0.04, 'drizzle': 0.35, 'rain': 0.75, 'storm': 1.0 };
        const moisture = moistureValues[env.weather] ?? 0;
        const effectivePeak = profile.peak * (1 - moisture) + profile.peak * profile.wetGrip * moisture;

        const getTGrip = (t, p) => {
            if (t < 50) return 0.68;
            if (t < p.lo) return 0.68 + ((t - 50) / (p.lo - 50)) * (p.peak - 0.68);
            if (t <= p.hi) return p.peak;
            const over = t - p.hi;
            return Math.max(0.55, p.peak - over * p.degrade - (over > 12 ? (over - 12) * p.degrade * 1.8 : 0));
        };

        const tGripF = getTGrip(heatF_C, profile);
        const tGripR = getTGrip(heatR_C, profile);
        const avgGrip = (tGripF + tGripR) / 2 * (effectivePeak / profile.peak);

        return {
            downforce: totalDownforce,
            cop: copShift,
            lltd: lltd,
            grip: avgGrip * 100,
            heatF: heatF_C,
            heatR: heatR_C,
            sFSlow: shapeDamp(nFSlow),
            sRSlow: shapeDamp(nRSlow),
            sFFast: shapeDamp(nFFast),
            sRFast: shapeDamp(nRFast),
            normRake: normRakeVal
        };
    }
};
