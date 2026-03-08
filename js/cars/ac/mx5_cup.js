window.AC_CARS = window.AC_CARS || {};
window.AC_CARS['mx5_cup'] = {
    id: 'mx5_cup',
    acModel: 'ks_mazda_mx5_cup',
    name: 'Mazda MX-5 Cup',
    class: 'TOURING',

    // ── Parameter definitions ───────────────────────────────────────────────
    // displayScale: multiply raw INI value by this to show physical unit
    // decimals: decimal places for display
    params: {
        FUEL:             { label: 'Fuel',         min: 0,   max: 60,  step: 1, default: 20,  unit: ' L' },
        ABS:              { label: 'ABS',           min: 0,   max: 1,   step: 1, default: 1,   unit: '', isToggle: true },
        TRACTION_CONTROL: { label: 'TC',            min: 0,   max: 1,   step: 1, default: 0,   unit: '', isToggle: true },
        BRAKE_POWER_MULT: { label: 'Brake Power',   min: 80,  max: 100, step: 1, default: 100, unit: '%' },
        TYRES:            { label: 'Compound',      min: 0,   max: 0,   step: 1, default: 0,   unit: '', isReadOnly: true },

        PRESSURE_LF: { label: 'FL', min: 15, max: 35, step: 1, default: 19, unit: ' PSI' },
        PRESSURE_RF: { label: 'FR', min: 15, max: 35, step: 1, default: 19, unit: ' PSI' },
        PRESSURE_LR: { label: 'RL', min: 15, max: 35, step: 1, default: 19, unit: ' PSI' },
        PRESSURE_RR: { label: 'RR', min: 15, max: 35, step: 1, default: 19, unit: ' PSI' },

        // Stored as integer * 10 of degrees (e.g. -38 = -3.8°)
        CAMBER_LF: { label: 'FL', min: -38, max: 8, step: 2, default: -38, unit: '°', displayScale: 0.1, decimals: 1 },
        CAMBER_RF: { label: 'FR', min: -38, max: 8, step: 2, default: -36, unit: '°', displayScale: 0.1, decimals: 1 },
        CAMBER_LR: { label: 'RL', min: -22, max: 15, step: 1, default: -20, unit: '°', displayScale: 0.1, decimals: 1 },
        CAMBER_RR: { label: 'RR', min: -22, max: 15, step: 1, default: -20, unit: '°', displayScale: 0.1, decimals: 1 },

        // Stored as integer * 100 of degrees (e.g. 12 = 0.12°)
        TOE_OUT_LF: { label: 'FL', min: 0, max: 12, step: 1, default:  12, unit: '°', displayScale: 0.01, decimals: 2 },
        TOE_OUT_RF: { label: 'FR', min: 0, max: 12, step: 1, default:  12, unit: '°', displayScale: 0.01, decimals: 2 },
        TOE_OUT_LR: { label: 'RL', min: 0,   max: 34, step: 1, default:  31, unit: '°', displayScale: 0.01, decimals: 2 },
        TOE_OUT_RR: { label: 'RR', min: 0,   max: 34, step: 1, default:  32, unit: '°', displayScale: 0.01, decimals: 2 },

        ARB_FRONT: { label: 'Front ARB', min: 0, max: 4, step: 1, default: 2, unit: '' },
        ARB_REAR:  { label: 'Rear ARB',  min: 0, max: 5, step: 1, default: 1, unit: '' },

        SPRING_RATE_LF: { label: 'FL', min: 37,  max: 58,  step: 1, default: 42, unit: ' N/mm' },
        SPRING_RATE_RF: { label: 'FR', min: 37,  max: 58,  step: 1, default: 42, unit: ' N/mm' },
        SPRING_RATE_LR: { label: 'RL', min: 62,  max: 107, step: 1, default: 62, unit: ' N/mm' },
        SPRING_RATE_RR: { label: 'RR', min: 62,  max: 107, step: 1, default: 62, unit: ' N/mm' },

        ROD_LENGTH_LF: { label: 'FL', min: 0, max: 25, step: 1, default:  2, unit: '' },
        ROD_LENGTH_RF: { label: 'FR', min: 0, max: 25, step: 1, default:  2, unit: '' },
        ROD_LENGTH_LR: { label: 'RL', min: 0, max: 30, step: 1, default:  0, unit: '' },
        ROD_LENGTH_RR: { label: 'RR', min: 0, max: 30, step: 1, default:  0, unit: '' },

        DAMP_BUMP_LF:    { label: 'FL', min: 0, max: 11, step: 1, default: 6, unit: '' },
        DAMP_BUMP_RF:    { label: 'FR', min: 0, max: 11, step: 1, default: 6, unit: '' },
        DAMP_BUMP_LR:    { label: 'RL', min: 0, max: 11, step: 1, default: 6, unit: '' },
        DAMP_BUMP_RR:    { label: 'RR', min: 0, max: 11, step: 1, default: 6, unit: '' },

        DAMP_REBOUND_LF: { label: 'FL', min: 0, max: 11, step: 1, default: 5, unit: '' },
        DAMP_REBOUND_RF: { label: 'FR', min: 0, max: 11, step: 1, default: 5, unit: '' },
        DAMP_REBOUND_LR: { label: 'RL', min: 0, max: 11, step: 1, default: 7, unit: '' },
        DAMP_REBOUND_RR: { label: 'RR', min: 0, max: 11, step: 1, default: 7, unit: '' },
    },

    // ── INI export order (alphabetical as AC expects) ───────────────────────
    exportOrder: [
        'ABS', 'ARB_FRONT', 'ARB_REAR', 'BRAKE_POWER_MULT',
        'CAMBER_LF', 'CAMBER_LR', 'CAMBER_RF', 'CAMBER_RR',
        'DAMP_BUMP_LF', 'DAMP_BUMP_LR', 'DAMP_BUMP_RF', 'DAMP_BUMP_RR',
        'DAMP_REBOUND_LF', 'DAMP_REBOUND_LR', 'DAMP_REBOUND_RF', 'DAMP_REBOUND_RR',
        'FUEL',
        'PRESSURE_LF', 'PRESSURE_LR', 'PRESSURE_RF', 'PRESSURE_RR',
        'ROD_LENGTH_LF', 'ROD_LENGTH_LR', 'ROD_LENGTH_RF', 'ROD_LENGTH_RR',
        'SPRING_RATE_LF', 'SPRING_RATE_LR', 'SPRING_RATE_RF', 'SPRING_RATE_RR',
        'TOE_OUT_LF', 'TOE_OUT_LR', 'TOE_OUT_RF', 'TOE_OUT_RR',
        'TRACTION_CONTROL', 'TYRES',
    ],

    presets: {

        // ── Sec. 6 — "Neutral Baseline" ────────────────────────────────────────
        // Median values across all circuits. Based on Sonoma dataset profile.
        // Use this for any unknown circuit as a starting point.
        'Neutral Baseline': {
            desc: 'Unknown tracks · median values · any piloting style',
            values: {
                FUEL: 20, ABS: 1, TRACTION_CONTROL: 0, BRAKE_POWER_MULT: 80, TYRES: 0,
                PRESSURE_LF: 20, PRESSURE_RF: 20, PRESSURE_LR: 20, PRESSURE_RR: 20,
                CAMBER_LF: -38, CAMBER_RF: -38, CAMBER_LR: -19, CAMBER_RR: -19,
                TOE_OUT_LF: 12, TOE_OUT_RF: 12, TOE_OUT_LR: 34, TOE_OUT_RR: 34,
                ARB_FRONT: 2, ARB_REAR: 1,
                SPRING_RATE_LF: 44, SPRING_RATE_RF: 44, SPRING_RATE_LR: 62, SPRING_RATE_RR: 62,
                ROD_LENGTH_LF: 0, ROD_LENGTH_RF: 0, ROD_LENGTH_LR: 0, ROD_LENGTH_RR: 0,
                DAMP_BUMP_LF: 7, DAMP_BUMP_RF: 7, DAMP_BUMP_LR: 7, DAMP_BUMP_RR: 7,
                DAMP_REBOUND_LF: 7, DAMP_REBOUND_RF: 7, DAMP_REBOUND_LR: 7, DAMP_REBOUND_RR: 7,
            },
        },

        // ── Sec. 6 — "High Speed" ──────────────────────────────────────────────
        // Nürburgring GP type: soft front spring, low rebound, low nose, max brakes.
        // Asymmetric camber RF=-36 for left-dominant high-speed layouts.
        'High Speed': {
            desc: 'Fast flowing circuits · Nürburgring · Spa · Monza',
            values: {
                FUEL: 20, ABS: 1, TRACTION_CONTROL: 0, BRAKE_POWER_MULT: 92, TYRES: 0,
                PRESSURE_LF: 20, PRESSURE_RF: 20, PRESSURE_LR: 20, PRESSURE_RR: 20,
                CAMBER_LF: -38, CAMBER_RF: -36, CAMBER_LR: -20, CAMBER_RR: -20,
                TOE_OUT_LF: 12, TOE_OUT_RF: 12, TOE_OUT_LR: 31, TOE_OUT_RR: 31,
                ARB_FRONT: 2, ARB_REAR: 1,
                SPRING_RATE_LF: 42, SPRING_RATE_RF: 42, SPRING_RATE_LR: 62, SPRING_RATE_RR: 62,
                ROD_LENGTH_LF: 2, ROD_LENGTH_RF: 2, ROD_LENGTH_LR: 0, ROD_LENGTH_RR: 0,
                DAMP_BUMP_LF: 6, DAMP_BUMP_RF: 6, DAMP_BUMP_LR: 6, DAMP_BUMP_RR: 6,
                DAMP_REBOUND_LF: 5, DAMP_REBOUND_RF: 5, DAMP_REBOUND_LR: 7, DAMP_REBOUND_RR: 7,
            },
        },

        // ── Sec. 6 — "Technical Circuit" ──────────────────────────────────────
        // Okayama type: high bumps and rebound, raised rear for traction, reduced rear camber.
        // Max body-motion control for chicane-heavy and slow-corner tracks.
        'Technical Circuit': {
            desc: 'Slow corners · chicanes · max traction · Okayama · Budapest · Suzuka',
            values: {
                FUEL: 20, ABS: 1, TRACTION_CONTROL: 0, BRAKE_POWER_MULT: 85, TYRES: 0,
                PRESSURE_LF: 20, PRESSURE_RF: 21, PRESSURE_LR: 20, PRESSURE_RR: 21,
                CAMBER_LF: -38, CAMBER_RF: -38, CAMBER_LR: -17, CAMBER_RR: -17,
                TOE_OUT_LF: 12, TOE_OUT_RF: 12, TOE_OUT_LR: 34, TOE_OUT_RR: 34,
                ARB_FRONT: 2, ARB_REAR: 1,
                SPRING_RATE_LF: 44, SPRING_RATE_RF: 44, SPRING_RATE_LR: 62, SPRING_RATE_RR: 62,
                ROD_LENGTH_LF: 0, ROD_LENGTH_RF: 0, ROD_LENGTH_LR: 4, ROD_LENGTH_RR: 4,
                DAMP_BUMP_LF: 8, DAMP_BUMP_RF: 8, DAMP_BUMP_LR: 8, DAMP_BUMP_RR: 8,
                DAMP_REBOUND_LF: 9, DAMP_REBOUND_RF: 9, DAMP_REBOUND_LR: 9, DAMP_REBOUND_RR: 9,
            },
        },

        // ── Sec. 6 — "Endurance / Long Run" ───────────────────────────────────
        // Nordschleife type: stiff front spring for 73 km of elevation changes,
        // very high rear ride height, moderate camber, full fuel.
        'Endurance / Long Run': {
            desc: 'Nordschleife · long races · bumpy elevation changes · full fuel',
            values: {
                FUEL: 25, ABS: 1, TRACTION_CONTROL: 0, BRAKE_POWER_MULT: 85, TYRES: 0,
                PRESSURE_LF: 20, PRESSURE_RF: 20, PRESSURE_LR: 20, PRESSURE_RR: 20,
                CAMBER_LF: -38, CAMBER_RF: -38, CAMBER_LR: -20, CAMBER_RR: -20,
                TOE_OUT_LF: 12, TOE_OUT_RF: 12, TOE_OUT_LR: 30, TOE_OUT_RR: 30,
                ARB_FRONT: 2, ARB_REAR: 1,
                SPRING_RATE_LF: 51, SPRING_RATE_RF: 51, SPRING_RATE_LR: 62, SPRING_RATE_RR: 62,
                ROD_LENGTH_LF: 0, ROD_LENGTH_RF: 0, ROD_LENGTH_LR: 6, ROD_LENGTH_RR: 6,
                DAMP_BUMP_LF: 7, DAMP_BUMP_RF: 7, DAMP_BUMP_LR: 8, DAMP_BUMP_RR: 8,
                DAMP_REBOUND_LF: 7, DAMP_REBOUND_RF: 7, DAMP_REBOUND_LR: 7, DAMP_REBOUND_RR: 7,
            },
        },

        // ── Sec. 6 — "American Grip" ───────────────────────────────────────────
        // Road Atlanta / Lime Rock type: stiff rear 77 N/mm on smooth American asphalt,
        // maximum camber, reduced toe. Only valid on smooth surfaced tracks.
        'American Grip (77 Rear)': {
            desc: 'Road Atlanta · Lime Rock · smooth American asphalt · max grip',
            values: {
                FUEL: 20, ABS: 1, TRACTION_CONTROL: 0, BRAKE_POWER_MULT: 85, TYRES: 0,
                PRESSURE_LF: 19, PRESSURE_RF: 19, PRESSURE_LR: 19, PRESSURE_RR: 19,
                CAMBER_LF: -38, CAMBER_RF: -38, CAMBER_LR: -22, CAMBER_RR: -22,
                TOE_OUT_LF: 12, TOE_OUT_RF: 12, TOE_OUT_LR: 30, TOE_OUT_RR: 30,
                ARB_FRONT: 2, ARB_REAR: 1,
                SPRING_RATE_LF: 44, SPRING_RATE_RF: 44, SPRING_RATE_LR: 77, SPRING_RATE_RR: 77,
                ROD_LENGTH_LF: 0, ROD_LENGTH_RF: 0, ROD_LENGTH_LR: 2, ROD_LENGTH_RR: 2,
                DAMP_BUMP_LF: 8, DAMP_BUMP_RF: 8, DAMP_BUMP_LR: 8, DAMP_BUMP_RR: 8,
                DAMP_REBOUND_LF: 7, DAMP_REBOUND_RF: 7, DAMP_REBOUND_LR: 7, DAMP_REBOUND_RR: 7,
            },
        },

        // ── Sec. 6 — "Single Lap Qualifying" ──────────────────────────────────
        // Minimum fuel, max brakes, aggressive rebound front, stiff rear bump.
        // Tires reach window by lap 2-3.
        'Single Lap Qualifying': {
            desc: 'One flying lap · min fuel · max attack · tires ready lap 2-3',
            values: {
                FUEL: 11, ABS: 1, TRACTION_CONTROL: 0, BRAKE_POWER_MULT: 92, TYRES: 0,
                PRESSURE_LF: 19, PRESSURE_RF: 19, PRESSURE_LR: 19, PRESSURE_RR: 19,
                CAMBER_LF: -38, CAMBER_RF: -38, CAMBER_LR: -20, CAMBER_RR: -20,
                TOE_OUT_LF: 12, TOE_OUT_RF: 12, TOE_OUT_LR: 31, TOE_OUT_RR: 31,
                ARB_FRONT: 2, ARB_REAR: 1,
                SPRING_RATE_LF: 42, SPRING_RATE_RF: 42, SPRING_RATE_LR: 62, SPRING_RATE_RR: 62,
                ROD_LENGTH_LF: 2, ROD_LENGTH_RF: 2, ROD_LENGTH_LR: 0, ROD_LENGTH_RR: 0,
                DAMP_BUMP_LF: 6, DAMP_BUMP_RF: 6, DAMP_BUMP_LR: 9, DAMP_BUMP_RR: 9,
                DAMP_REBOUND_LF: 4, DAMP_REBOUND_RF: 4, DAMP_REBOUND_LR: 7, DAMP_REBOUND_RR: 7,
            },
        },

        'Nürburgring GP 25°C+': {
            desc: 'Real setup · hot ambient · RF camber asymmetry for left-dominant layout',
            values: {
                FUEL: 20, ABS: 1, TRACTION_CONTROL: 0, BRAKE_POWER_MULT: 92, TYRES: 0,
                PRESSURE_LF: 19, PRESSURE_RF: 19, PRESSURE_LR: 19, PRESSURE_RR: 19,
                CAMBER_LF: -38, CAMBER_RF: -36, CAMBER_LR: -20, CAMBER_RR: -20,
                TOE_OUT_LF: 12, TOE_OUT_RF: 12, TOE_OUT_LR: 31, TOE_OUT_RR: 32,
                ARB_FRONT: 2, ARB_REAR: 1,
                SPRING_RATE_LF: 42, SPRING_RATE_RF: 42, SPRING_RATE_LR: 62, SPRING_RATE_RR: 62,
                ROD_LENGTH_LF: 2, ROD_LENGTH_RF: 2, ROD_LENGTH_LR: 0, ROD_LENGTH_RR: 0,
                DAMP_BUMP_LF: 6, DAMP_BUMP_RF: 6, DAMP_BUMP_LR: 6, DAMP_BUMP_RR: 6,
                DAMP_REBOUND_LF: 5, DAMP_REBOUND_RF: 5, DAMP_REBOUND_LR: 7, DAMP_REBOUND_RR: 7,
            },
        },
        'Mugello 15°C Qualifying': {
            desc: 'Real setup · cold · high rear bump for flowing layout',
            values: {
                FUEL: 10, ABS: 1, TRACTION_CONTROL: 0, BRAKE_POWER_MULT: 85, TYRES: 0,
                PRESSURE_LF: 19, PRESSURE_RF: 19, PRESSURE_LR: 20, PRESSURE_RR: 20,
                CAMBER_LF: -38, CAMBER_RF: -38, CAMBER_LR: -20, CAMBER_RR: -20,
                TOE_OUT_LF: 12, TOE_OUT_RF: 12, TOE_OUT_LR: 34, TOE_OUT_RR: 34,
                ARB_FRONT: 2, ARB_REAR: 1,
                SPRING_RATE_LF: 44, SPRING_RATE_RF: 44, SPRING_RATE_LR: 62, SPRING_RATE_RR: 62,
                ROD_LENGTH_LF: 0, ROD_LENGTH_RF: 0, ROD_LENGTH_LR: 0, ROD_LENGTH_RR: 0,
                DAMP_BUMP_LF: 6, DAMP_BUMP_RF: 6, DAMP_BUMP_LR: 5, DAMP_BUMP_RR: 5,
                DAMP_REBOUND_LF: 6, DAMP_REBOUND_RF: 6, DAMP_REBOUND_LR: 6, DAMP_REBOUND_RR: 6,
            },
        },
    },
};
