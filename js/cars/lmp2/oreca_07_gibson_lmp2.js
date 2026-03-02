window.CARS = window.CARS || {};
window.CARS["oreca_07_gibson_lmp2"] = {
    id: "oreca_07_gibson_lmp2",
    name: "Oreca 07 Gibson LMP2",
    setupStructure: [
        {
            group: "Tires & Brakes",
            items: [
                { id: "tpressure_f", name: "Front Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 166, step: 1, default: 136 }, { id: "tpressure_r", name: "Rear Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 166, step: 1, default: 136 },
                { id: "bias", name: "Brake Bias", type: "numeric", unit: "%", min: 47.8, max: 60.0, step: 0.5, default: 52.3 },
                {
                    id: "fbd", name: "Front Brake Duct", type: "labeled",
                    options: [
                        { label: "Open", value: 0.0 },
                        { label: "25%", value: 0.25 },
                        { label: "50%", value: 0.5 },
                        { label: "75%", value: 0.75 },
                        { label: "Closed", value: 1.0 }
                    ],
                    default: 0
                },
                {
                    id: "rbd", name: "Rear Brake Duct", type: "labeled",
                    options: [
                        { label: "Open", value: 0.0 },
                        { label: "25%", value: 0.25 },
                        { label: "50%", value: 0.5 },
                        { label: "75%", value: 0.75 },
                        { label: "Closed", value: 1.0 }
                    ],
                    default: 0
                }
            ]
        },
        {
            group: "Suspension",
            items: [
                { id: "fh", name: "Front Ride Height", type: "numeric", unit: "cm", min: 3.5, max: 8.0, step: 0.1, default: 4.4 },
                { id: "rh", name: "Rear Ride Height", type: "numeric", unit: "cm", min: 4.6, max: 10.0, step: 0.1, default: 7.5 },
                {
                    id: "fs", name: "Front Springs", type: "labeled",
                    options: [{ label: "150 N/m", value: 0 }, { label: "220 N/m", value: 1 }, { label: "280 N/m", value: 2 }, { label: "333 N/m", value: 3 }],
                    default: 1
                },
                {
                    id: "rs", name: "Rear Springs", type: "labeled",
                    options: [{ label: "650 N/m", value: 0 }, { label: "800 N/m", value: 1 }, { label: "950 N/m", value: 2 }, { label: "1100 N/m", value: 3 }, { label: "1250 N/m", value: 4 }],
                    default: 2
                },
                { id: "fpk", name: "Front Packers", type: "numeric", unit: "cm", min: 0.0, max: 2.0, step: 0.1, default: 0.0 },
                { id: "rpk", name: "Rear Packers", type: "numeric", unit: "cm", min: 0.0, max: 2.0, step: 0.1, default: 0.0 },
                {
                    id: "farb", name: "Front ARB", type: "labeled",
                    options: ["Detached", "D18 S-S", "D18 S-H", "D18 H-H", "D22 S-S", "D22 S-H", "D22 H-H", "D25 S-S", "D25 S-H", "D25 H-H", "D32 S-S", "D32 S-H", "D32 H-H", "D36 S-S", "D36 S-H", "D36 H-H"].map((l, i) => ({ label: l, value: i })),
                    default: 4
                },
                {
                    id: "rarb", name: "Rear ARB", type: "labeled",
                    options: ["Detached", "D7.5 S-S", "D7.5 S-H", "D7.5 H-H", "D8.6 S-S", "D8.6 S-H", "D8.6 H-H", "D10.1 S-S", "D10.1 S-H", "D10.1 H-H", "D11.8 S-S", "D11.8 S-H", "D11.8 H-H", "D13.7 S-S", "D13.7 S-H", "D13.7 H-H"].map((l, i) => ({ label: l, value: i })),
                    default: 0
                }
            ]
        },
        {
            group: "Third Element",
            items: [
                {
                    id: "third_Fspring", name: "Front Heave Spring", type: "labeled",
                    options: [{ label: "N/A", value: 0 }, { label: "1000 Lfb/in", value: 1 }, { label: "1400 Lfb/in", value: 2 }, { label: "1600 Lfb/in", value: 3 }, { label: "2000 Lfb/in", value: 4 }],
                    default: 0
                },
                {
                    id: "third_Rspring", name: "Rear Heave Spring", type: "labeled",
                    options: [{ label: "N/A", value: 0 }],
                    default: 0
                },
                { id: "third_fpk", name: "Front Heave Packers", type: "numeric", unit: "cm", min: 0.0, max: 2.0, step: 0.1, default: 0.0 },
                { id: "third_rpk", name: "Rear Heave Packers", type: "numeric", unit: "cm", min: 0.0, max: 1.0, step: 0.1, default: 1.0 }
            ]
        },
        {
            group: "Dampers",
            items: [
                { id: "fsb", name: "Front Slow Bump", type: "numeric", min: 1, max: 12, step: 1, default: 3 },
                { id: "fsr", name: "Front Slow Rebound", type: "numeric", min: 1, max: 12, step: 1, default: 6 },
                { id: "ffb", name: "Front Fast Bump", type: "numeric", min: 1, max: 12, step: 1, default: 4 },
                { id: "ffr", name: "Front Fast Rebound", type: "numeric", min: 1, max: 12, step: 1, default: 2 },
                { id: "rsb", name: "Rear Slow Bump", type: "numeric", min: 1, max: 12, step: 1, default: 2 },
                { id: "rsr", name: "Rear Slow Rebound", type: "numeric", min: 1, max: 12, step: 1, default: 2 },
                { id: "rfb", name: "Rear Fast Bump", type: "numeric", min: 1, max: 12, step: 1, default: 2 },
                { id: "rfr", name: "Rear Fast Rebound", type: "numeric", min: 1, max: 12, step: 1, default: 4 }
            ]
        },
        {
            group: "Aero & Alignment",
            items: [
                { id: "wing", name: "Rear Wing", type: "prefixed", prefix: "P", min: 1, max: 9, step: 1, default: 3 },
                { id: "ftoe", name: "Front Toe", type: "numeric", unit: "deg", min: -0.94, max: 0.94, step: 0.06, default: -0.06 },
                { id: "rtoe", name: "Rear Toe", type: "numeric", unit: "deg", min: -0.94, max: 0.94, step: 0.06, default: 0.23 },
                { id: "fcam", name: "Front Camber", type: "numeric", unit: "deg", min: -2.6, max: -1.5, step: 0.1, default: -1.5 },
                { id: "rcam", name: "Rear Camber", type: "numeric", unit: "deg", min: -1.5, max: -0.9, step: 0.1, default: -0.9 }
            ]
        }
    ],
    presets: {
        "Low Downforce": {
            desc: "Minimal wing and low ride height for maximum straight-line speed at Le Mans or Monza.",
            values: { wing: 1, fh: 4.4, rh: 5.5, farb: 5, rarb: 0, bias: 52.3, ftoe: -0.04, rtoe: 0.14, fcam: -1.7, rcam: -1.1, fs: 1, rs: 2 }
        },
        "High Downforce": {
            desc: "Aggressive wing and balanced rake for maximum cornering speed and technical circuits.",
            values: { wing: 8, fh: 4.6, rh: 7.5, farb: 3, rarb: 4, bias: 53.8, ftoe: -0.10, rtoe: 0.26, fcam: -2.3, rcam: -1.3, fs: 2, rs: 1 }
        },
        "Understeer": {
            desc: "Safety-first setup. Stiff front and forward bias makes the car highly stable and predictable.",
            values: { farb: 10, rarb: 0, fs: 3, rs: 0, fh: 4.6, rh: 6.8, bias: 55.3, wing: 5, ftoe: -0.04, rtoe: 0.26, fcam: -2.0, rcam: -1.1 }
        },
        "Oversteer": {
            desc: "Pivot-focused setup. Stiff rear and high rake allows the car to rotate aggressively on corner entry.",
            values: { farb: 0, rarb: 8, fs: 0, rs: 3, fh: 4.4, rh: 8.0, bias: 48.8, wing: 2, ftoe: -0.16, rtoe: 0.14, fcam: -2.4, rcam: -1.3 }
        }
    }
};