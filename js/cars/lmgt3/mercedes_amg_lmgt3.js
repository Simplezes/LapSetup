window.CARS = window.CARS || {};
window.CARS["mercedes_amg_lmgt3"] = {
    id: "mercedes_amg_lmgt3",
    name: "Mercedes-AMG LMGT3",
    setupStructure: [
        {
            group: "Tires & Brakes",
            items: [
                { id: "tpressure_f", name: "Front Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "tpressure_r", name: "Rear Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "bias", name: "Brake Bias", type: "numeric", unit: "%", min: 43.0, max: 57.0, step: 0.25, default: 50.2 },
                {
                    id: "fbd", name: "Front Brake Duct", type: "labeled",
                    options: [
                        { label: "Open", value: 0.0 },
                        { label: "25mm", value: 0.2 },
                        { label: "50mm", value: 0.4 },
                        { label: "75mm", value: 0.6 },
                        { label: "100mm", value: 0.8 },
                        { label: "125mm", value: 0.9 },
                        { label: "Closed", value: 1.0 }
                    ],
                    default: 0
                },
                {
                    id: "rbd", name: "Rear Brake Duct", type: "labeled",
                    options: [
                        { label: "Open", value: 0.0 },
                        { label: "25mm", value: 0.2 },
                        { label: "50mm", value: 0.4 },
                        { label: "75mm", value: 0.6 },
                        { label: "100mm", value: 0.8 },
                        { label: "125mm", value: 0.9 },
                        { label: "Closed", value: 1.0 }
                    ],
                    default: 0
                }
            ]
        },
        {
            group: "Suspension",
            items: [
                { id: "fh", name: "Front Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 7.5, step: 0.1, default: 5.2 },
                { id: "rh", name: "Rear Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 11.0, step: 0.1, default: 5.8 },
                { id: "fs", name: "Front Springs", type: "numeric", min: 1, max: 6, step: 1, default: 3 },
                { id: "rs", name: "Rear Springs", type: "numeric", min: 1, max: 6, step: 1, default: 5 },
                { id: "fpk", name: "Front Packers", type: "numeric", unit: "cm", min: 0.0, max: 4.0, step: 0.1, default: 0.0 },
                { id: "rpk", name: "Rear Packers", type: "numeric", unit: "cm", min: 0.0, max: 4.0, step: 0.1, default: 0.0 },
                {
                    id: "farb", name: "Front ARB", type: "labeled",
                    options: [
                        "D1-D1 (50x3mm) (Soft)", "D1-D2 (50x3mm)", "D2-D2 (50x3mm)", "D2-D3 (50x3mm)",
                        "D3-D3 (50x3mm)", "D3-D4 (50x3mm)", "D4-D4 (50x3mm)", "D4-D5 (50x3mm)",
                        "D5-D5 (50x3mm)", "D5-D6 (50x3mm)", "D6-D6 (50x3mm) (Hard)"
                    ].map((l, i) => ({ label: l, value: i })),
                    default: 3
                },
                {
                    id: "rarb", name: "Rear ARB", type: "labeled",
                    options: [
                        "D1-D1 (30x3mm) (Soft)", "D1-D2 (30x3mm)", "D2-D2 (30x3mm)", "D2-D3 (30x3mm)",
                        "D3-D3 (30x3mm)", "D3-D4 (30x3mm)", "D4-D4 (30x3mm) (Hard)",
                        "D1-D1 (40x3mm)", "D1-D2 (40x3mm)", "D2-D2 (40x3mm)", "D2-D3 (40x3mm)",
                        "D3-D3 (40x3mm)", "D3-D4 (40x3mm)", "D4-D4 (40x3mm) (Hard)"
                    ].map((l, i) => ({ label: l, value: i })),
                    default: 4
                }
            ]
        },
        {
            group: "Dampers",
            items: [
                { id: "fsb", name: "Front Slow Bump", type: "numeric", min: 0, max: 11, step: 1, default: 8 },
                { id: "fsr", name: "Front Slow Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 8 },
                { id: "ffb", name: "Front Fast Bump", type: "numeric", min: 0, max: 11, step: 1, default: 7 },
                { id: "ffr", name: "Front Fast Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 9 },
                { id: "rsb", name: "Rear Slow Bump", type: "numeric", min: 0, max: 11, step: 1, default: 9 },
                { id: "rsr", name: "Rear Slow Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 7 },
                { id: "rfb", name: "Rear Fast Bump", type: "numeric", min: 0, max: 11, step: 1, default: 6 },
                { id: "rfr", name: "Rear Fast Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 8 }
            ]
        },
        {
            group: "Aero & Alignment",
            items: [
                { id: "wing", name: "Rear Wing", type: "numeric", unit: "deg", min: 0.0, max: 7.0, step: 1.0, default: 1.0 },
                { id: "ftoe", name: "Front Toe", type: "numeric", unit: "deg", min: -0.937, max: 0.937, step: 0.058, default: -0.117 },
                { id: "rtoe", name: "Rear Toe", type: "numeric", unit: "deg", min: -0.937, max: 0.937, step: 0.058, default: 0.117 },
                { id: "fcam", name: "Front Camber", type: "numeric", unit: "deg", min: -5.5, max: -1.0, step: 0.1, default: -2.2 },
                { id: "rcam", name: "Rear Camber", type: "numeric", unit: "deg", min: -4.5, max: -1.0, step: 0.1, default: -1.5 }
            ]
        }
    ],
    presets: {
        "Low Downforce": {
            desc: "Minimal drag configuration for high-speed circuits. Flat wing and lowest possible height.",
            values: { wing: 0.0, fh: 5.0, rh: 5.2, farb: 2, rarb: 2, bias: 50.5 }
        },
        "High Downforce": {
            desc: "Steep wing angle and balanced suspension for maximum turn-in grip and confidence.",
            values: { wing: 7.0, fh: 5.8, rh: 7.5, farb: 6, rarb: 7, fs: 4, rs: 6 }
        },
        "Understeer": {
            desc: "Safety-first setup. Stiff front ARBs and forward bias for heavy-braking stability.",
            values: { farb: 10, rarb: 1, fs: 5, rs: 2, fh: 5.5, rh: 5.8, bias: 55.6, wing: 4.0 }
        },
        "Oversteer": {
            desc: "Aggressive pivot balance. High rake and stiff rear suspension to maximize rotation.",
            values: { farb: 1, rarb: 10, fs: 2, rs: 6, fh: 5.0, rh: 8.5, bias: 48.1, wing: 1.0 }
        }
    }
}