window.CARS = window.CARS || {};
window.CARS["lamborghini_huracan_lmgt3_evo2"] = {
    id: "lamborghini_huracan_lmgt3_evo2",
    name: "Lamborghini Huracan LMGT3 EVO2",
    setupStructure: [
        {
            group: "Tires & Brakes",
            items: [
                { id: "tpressure_f", name: "Front Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "tpressure_r", name: "Rear Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "bias", name: "Brake Bias", type: "numeric", unit: "%", min: 43.0, max: 57.0, step: 0.25, default: 52.8 },
                {
                    id: "fbd", name: "Front Brake Duct", type: "labeled",
                    options: [
                        { label: "Open", value: 0.0 }, { label: "10%", value: 0.1 }, { label: "20%", value: 0.2 },
                        { label: "30%", value: 0.3 }, { label: "40%", value: 0.4 }, { label: "50%", value: 0.5 },
                        { label: "60%", value: 0.6 }, { label: "70%", value: 0.7 }, { label: "80%", value: 0.8 },
                        { label: "90%", value: 0.9 }, { label: "Closed", value: 1.0 }
                    ],
                    default: 3
                },
                {
                    id: "rbd", name: "Rear Brake Duct", type: "labeled",
                    options: [
                        { label: "Open", value: 0.0 }, { label: "10%", value: 0.1 }, { label: "20%", value: 0.2 },
                        { label: "30%", value: 0.3 }, { label: "40%", value: 0.4 }, { label: "50%", value: 0.5 },
                        { label: "60%", value: 0.6 }, { label: "70%", value: 0.7 }, { label: "80%", value: 0.8 },
                        { label: "90%", value: 0.9 }, { label: "Closed", value: 1.0 }
                    ],
                    default: 3
                }
            ]
        },
        {
            group: "Suspension",
            items: [
                { id: "fh", name: "Front Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 8.5, step: 0.1, default: 5.4 },
                { id: "rh", name: "Rear Ride Height", type: "numeric", unit: "cm", min: 5.9, max: 10.0, step: 0.1, default: 6.0 },
                { id: "fs", name: "Front Springs", type: "numeric", min: 1, max: 6, step: 1, default: 4 },
                { id: "rs", name: "Rear Springs", type: "numeric", min: 1, max: 6, step: 1, default: 4 },
                { id: "fpk", name: "Front Packers", type: "numeric", unit: "cm", min: 0.0, max: 5.0, step: 0.1, default: 0.0 },
                { id: "rpk", name: "Rear Packers", type: "numeric", unit: "cm", min: 0.0, max: 5.0, step: 0.1, default: 0.0 },
                {
                    id: "farb", name: "Front ARB", type: "labeled",
                    options: [
                        { label: "Detached", value: 0 }, { label: "D32x1_1-1 (Soft)", value: 1 }, { label: "D32x1_1-2", value: 2 },
                        { label: "D32x1_1-3", value: 3 }, { label: "D32x1_2_2", value: 4 }, { label: "D32x1_2-3", value: 5 },
                        { label: "D32x1_3-3", value: 6 }, { label: "D35x1_1-1", value: 7 }, { label: "D35x1_1-2", value: 8 },
                        { label: "D35x1_1-3", value: 9 }, { label: "D35x1_2-2", value: 10 }, { label: "D35x1_2-3", value: 11 },
                        { label: "D35x1_3-3", value: 12 }, { label: "D38x1_1-1", value: 13 }, { label: "D38x1_1-2", value: 14 },
                        { label: "D38x1_1-3", value: 15 }, { label: "D38x1_2-2", value: 16 }, { label: "D38x1_2-3", value: 17 },
                        { label: "D38x1_3-3 (Hard)", value: 18 }
                    ],
                    default: 10
                },
                {
                    id: "rarb", name: "Rear ARB", type: "labeled",
                    options: [
                        { label: "Detached", value: 0 }, { label: "D38x1_1-1 (Soft)", value: 1 }, { label: "D38x1_1-2", value: 2 },
                        { label: "D38x1_2-2", value: 3 }, { label: "D38x1_2-3", value: 4 }, { label: "D38x1_3-3", value: 5 }
                    ],
                    default: 3
                }
            ]
        },
        {
            group: "Dampers",
            items: [
                { id: "fsb", name: "Front Slow Bump", type: "numeric", min: 0, max: 39, step: 1, default: 26 },
                { id: "fsr", name: "Front Slow Rebound", type: "numeric", min: 0, max: 39, step: 1, default: 26 },
                { id: "ffb", name: "Front Fast Bump", type: "numeric", min: 0, max: 39, step: 1, default: 10 },
                { id: "ffr", name: "Front Fast Rebound", type: "numeric", min: 0, max: 39, step: 1, default: 10 },
                { id: "rsb", name: "Rear Slow Bump", type: "numeric", min: 0, max: 49, step: 1, default: 26 },
                { id: "rsr", name: "Rear Slow Rebound", type: "numeric", min: 0, max: 49, step: 1, default: 23 },
                { id: "rfb", name: "Rear Fast Bump", type: "numeric", min: 0, max: 49, step: 1, default: 40 },
                { id: "rfr", name: "Rear Fast Rebound", type: "numeric", min: 0, max: 49, step: 1, default: 36 }
            ]
        },
        {
            group: "Aero & Alignment",
            items: [
                { id: "wing", name: "Rear Wing", type: "numeric", unit: "deg", min: 4.0, max: 8.0, step: 1.0, default: 5.0 },
                { id: "ftoe", name: "Front Toe", type: "numeric", unit: "deg", min: -0.99, max: 0.99, step: 0.07, default: -0.06 },
                { id: "rtoe", name: "Rear Toe", type: "numeric", unit: "deg", min: -0.99, max: 0.99, step: 0.07, default: -0.31 },
                { id: "fcam", name: "Front Camber", type: "numeric", unit: "deg", min: -5.0, max: -1.8, step: 0.1, default: -2.0 },
                { id: "rcam", name: "Rear Camber", type: "numeric", unit: "deg", min: -3.8, max: -1.0, step: 0.1, default: -1.8 }
            ]
        }
    ],
    presets: {
        "Low Downforce": {
            desc: "Designed for high-speed aero efficiency. Minimal wing and ride height to reduce mechanical drag.",
            values: { wing: 4.0, fh: 5.0, rh: 5.9, farb: 6, rarb: 3, bias: 51.4 }
        },
        "High Downforce": {
            desc: "The 'Technical Master' setup. Maximized aero load for slow speed corners and high stability.",
            values: { wing: 8.0, fh: 5.5, rh: 7.0, farb: 14, rarb: 5, bias: 52.9 }
        },
        "Understeer": {
            desc: "Safe and planted. Extreme front stiffness and forward bias for the ultimate predictable ride.",
            values: { farb: 18, rarb: 1, fs: 6, rs: 6, fh: 5.4, rh: 5.9, bias: 56.5, wing: 6.0 }
        },
        "Oversteer": {
            desc: "The 'Rotating Bull'. Stiff rear and high rake to help this mid-engine beast pivot instantly.",
            values: { farb: 4, rarb: 5, fs: 6, rs: 6, fh: 5.0, rh: 8.5, bias: 48.1, wing: 5.0 }
        }
    }
};