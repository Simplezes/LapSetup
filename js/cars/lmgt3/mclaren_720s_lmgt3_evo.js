window.CARS = window.CARS || {};
window.CARS["mclaren_720s_lmgt3_evo"] = {
    id: "mclaren_720s_lmgt3_evo",
    name: "McLaren 720S LMGT3 EVO",
    setupStructure: [
        {
            group: "Tires & Brakes",
            items: [
                { id: "tpressure_f", name: "Front Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "tpressure_r", name: "Rear Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "bias", name: "Brake Bias", type: "numeric", unit: "%", min: 43.0, max: 57.0, step: 0.25, default: 52.5 },
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
                { id: "fh", name: "Front Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 8.1, step: 0.1, default: 5.4 },
                { id: "rh", name: "Rear Ride Height", type: "numeric", unit: "cm", min: 5.9, max: 9.5, step: 0.1, default: 7.0 },
                { id: "fs", name: "Front Springs", type: "numeric", min: 1, max: 6, step: 1, default: 4 },
                { id: "rs", name: "Rear Springs", type: "numeric", min: 1, max: 6, step: 1, default: 4 },
                { id: "tender_f", name: "Tender Spring (F)", type: "labeled", options: [{ label: "Off", value: 0 }, { label: "Standard", value: 1 }], default: 1 },
                { id: "fpk", name: "Front Packers", type: "numeric", unit: "cm", min: 0.0, max: 4.0, step: 0.1, default: 0.0 },
                { id: "rpk", name: "Rear Packers", type: "numeric", unit: "cm", min: 0.0, max: 4.0, step: 0.1, default: 0.0 },
                {
                    id: "farb", name: "Front ARB", type: "labeled",
                    options: [
                        { label: "Detached", value: 0 },
                        { label: "P1 14mm", value: 1 }, { label: "P2 14mm", value: 2 }, { label: "P3 14mm", value: 3 }, { label: "P4 14mm", value: 4 },
                        { label: "P1 20x2mm", value: 5 }, { label: "P2 20x2mm", value: 6 }, { label: "P3 20x2mm", value: 7 }, { label: "P4 20x2mm", value: 8 },
                        { label: "P1 25x2mm", value: 9 }, { label: "P2 25x2mm", value: 10 }, { label: "P3 25x2mm", value: 11 }, { label: "P4 25x2mm", value: 12 }
                    ],
                    default: 5
                },
                {
                    id: "rarb", name: "Rear ARB", type: "labeled",
                    options: [
                        { label: "Detached", value: 0 },
                        { label: "P1 18x2mm", value: 1 }, { label: "P2 18x2mm", value: 2 }, { label: "P3 18x2mm", value: 3 }, { label: "P4 18x2mm", value: 4 }, { label: "P5 18x2mm", value: 5 },
                        { label: "P1 20x2mm", value: 6 }, { label: "P2 20x2mm", value: 7 }, { label: "P3 20x2mm", value: 8 }, { label: "P4 20x2mm", value: 9 }, { label: "P5 20x2mm", value: 10 },
                        { label: "P1 25x2mm", value: 11 }, { label: "P2 25x2mm", value: 12 }, { label: "P3 25x2mm", value: 13 }, { label: "P4 25x2mm", value: 14 }, { label: "P5 25x2mm", value: 15 }
                    ],
                    default: 3
                }
            ]
        },
        {
            group: "Dampers",
            items: [
                { id: "fsb", name: "Front Slow Bump", type: "numeric", min: 1, max: 41, step: 1, default: 26, prefix: "B", reverse: true },
                { id: "fsr", name: "Front Slow Rebound", type: "numeric", min: 1, max: 41, step: 1, default: 20, prefix: "R", reverse: true },
                { id: "ffb", name: "Front Fast Bump", type: "numeric", min: 1, max: 51, step: 1, default: 28, prefix: "B", reverse: true },
                { id: "ffr", name: "Front Fast Rebound", type: "numeric", min: 1, max: 51, step: 1, default: 28, prefix: "R", reverse: true },
                { id: "rsb", name: "Rear Slow Bump", type: "numeric", min: 1, max: 41, step: 1, default: 14, prefix: "B", reverse: true },
                { id: "rsr", name: "Rear Slow Rebound", type: "numeric", min: 1, max: 41, step: 1, default: 15, prefix: "R", reverse: true },
                { id: "rfb", name: "Rear Fast Bump", type: "numeric", min: 1, max: 51, step: 1, default: 40, prefix: "B", reverse: true },
                { id: "rfr", name: "Rear Fast Rebound", type: "numeric", min: 1, max: 51, step: 1, default: 42, prefix: "R", reverse: true }
            ]
        },
        {
            group: "Aero & Alignment",
            items: [
                {
                    id: "wing", name: "Rear Wing", type: "labeled", unit: "deg",
                    options: [1.75, 2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.2, 4.5, 4.8, 5.1, 5.4, 5.7, 6.1, 6.4, 6.7, 7.0, 7.3, 7.6, 7.9, 8.2, 8.5, 8.8, 9.1, 9.4, 9.7, 10.0, 10.4, 10.7].map(v => ({ label: `${v.toFixed(2)} deg`, value: v })),
                    default: 15
                },
                {
                    id: "ldwing", name: "Rear Wing", type: "labeled", unit: "deg",
                    options: [4.8, 5.1, 5.4, 5.7, 6.1, 6.4, 6.7, 7.0, 7.3, 7.6, 7.9, 8.2, 8.5, 8.8, 9.1, 9.4, 9.7, 10.0, 10.4, 10.7].map(v => ({ label: `${v.toFixed(2)} deg`, value: v })),
                    default: 23
                },
                { id: "ftoe", name: "Front Toe", type: "numeric", unit: "deg", min: -0.937, max: 0.937, step: 0.117, default: -0.117 },
                { id: "rtoe", name: "Rear Toe", type: "numeric", unit: "deg", min: -0.937, max: 0.937, step: 0.117, default: 0.234 },
                { id: "fcam", name: "Front Camber", type: "numeric", unit: "deg", min: -4.60, max: -1.60, step: 0.2, default: -2.20 },
                { id: "rcam", name: "Rear Camber", type: "numeric", unit: "deg", min: -4.50, max: -1.10, step: 0.2, default: -1.90 }
            ]
        }
    ],
    presets: {
        "Low Downforce": {
            desc: "The 'Velocity' profile. Maintains the McLaren's sleek efficiency with minimal wing and height.",
            values: { wing: 5.4, fh: 5.0, rh: 5.9, farb: 4, rarb: 3, bias: 51.1 }
        },
        "High Downforce": {
            desc: "High-speed precision setup. Maximized aero grip for high-confidence cornering.",
            values: { wing: 10.5, fh: 5.6, rh: 7.5, farb: 8, rarb: 5, fs: 5, rs: 5 }
        },
        "Understeer": {
            desc: "Safest possible balance. Locked-in front end and forward bias for endurance stability.",
            values: { farb: 10, rarb: 1, fs: 5, rs: 1, fh: 5.6, rh: 6.0, bias: 55.9, wing: 9.0 }
        },
        "Oversteer": {
            desc: "Snappy and aggressive. High rake and rear stiffness to help the car dive into corners.",
            values: { farb: 3, rarb: 10, fs: 2, rs: 6, fh: 5.0, rh: 8.8, bias: 48.1, wing: 6.0 }
        }
    }
};