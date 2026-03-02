window.CARS = window.CARS || {};
window.CARS["ferrari_296_lmgt3"] = {
    id: "ferrari_296_lmgt3",
    name: "Ferrari 296 LMGT3",
    setupStructure: [
        {
            group: "Tires & Brakes",
            items: [
                { id: "tpressure_f", name: "Front Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "tpressure_r", name: "Rear Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "bias", name: "Brake Bias", type: "numeric", unit: "%", min: 44.5, max: 57.0, step: 0.25, default: 52.2 },
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
                { id: "fh", name: "Front Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 7.5, step: 0.1, default: 5.4 },
                { id: "rh", name: "Rear Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 7.5, step: 0.1, default: 5.8 },
                { id: "fs", name: "Front Springs", type: "numeric", min: 1, max: 9, step: 1, default: 6 },
                { id: "rs", name: "Rear Springs", type: "numeric", min: 1, max: 9, step: 1, default: 4 },
                { id: "fpk", name: "Front Packers", type: "numeric", unit: "cm", min: 0.0, max: 4.0, step: 0.1, default: 0.0 },
                { id: "rpk", name: "Rear Packers", type: "numeric", unit: "cm", min: 0.0, max: 4.0, step: 0.1, default: 0.0 },
                { id: "farb", name: "Front ARB", type: "numeric", min: 0, max: 7, step: 1, default: 5 },
                { id: "rarb", name: "Rear ARB", type: "numeric", min: 0, max: 7, step: 1, default: 2 }
            ]
        },
        {
            group: "Dampers",
            items: [
                { id: "fsb", name: "Front Slow Bump", type: "numeric", min: 0, max: 11, step: 1, default: 4 },
                { id: "fsr", name: "Front Slow Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 2 },
                { id: "ffb", name: "Front Fast Bump", type: "numeric", min: 0, max: 11, step: 1, default: 4 },
                { id: "ffr", name: "Front Fast Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 2 },
                { id: "rsb", name: "Rear Slow Bump", type: "numeric", min: 0, max: 11, step: 1, default: 4 },
                { id: "rsr", name: "Rear Slow Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 2 },
                { id: "rfb", name: "Rear Fast Bump", type: "numeric", min: 0, max: 11, step: 1, default: 3 },
                { id: "rfr", name: "Rear Fast Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 2 }
            ]
        },
        {
            group: "Aero & Alignment",
            items: [
                {
                    id: "wing", name: "Rear Wing", type: "labeled", unit: "deg",
                    options: [0.60, 1.25, 1.90, 2.55, 3.20, 3.85, 4.50].map(v => ({ label: v.toFixed(2), value: v })),
                    default: 2
                },
                { id: "ftoe", name: "Front Toe", type: "numeric", unit: "deg", min: -1.003, max: 1.003, step: 0.0626875, default: -0.125 },
                { id: "rtoe", name: "Rear Toe", type: "numeric", unit: "deg", min: -1.003, max: 1.003, step: 0.0626875, default: 0.251 },
                { id: "fcam", name: "Front Camber", type: "numeric", unit: "deg", min: -4.6, max: -2.0, step: 0.1, default: -2.2 },
                { id: "rcam", name: "Rear Camber", type: "numeric", unit: "deg", min: -4.4, max: -1.5, step: 0.1, default: -1.5 }
            ]
        }
    ],
    presets: {
        "Low Downforce": {
            desc: "Unleash the Ferrari's top speed engine with minimal drag and floor-hugging ride height.",
            values: { wing: 0.6, fh: 5.0, rh: 5.2, farb: 3, rarb: 3, bias: 51.4 }
        },
        "High Downforce": {
            desc: "Maximized aero grip for technical tracks like Portimao or Bahrain.",
            values: { wing: 4.5, fh: 5.5, rh: 7.0, farb: 5, rarb: 4, fs: 6, rs: 5 }
        },
        "Understeer": {
            desc: "Ensures front-end stability. Stiff front roll-bars prevent any snappy behavior.",
            values: { farb: 7, rarb: 2, fs: 8, rs: 2, fh: 5.2, rh: 5.5, bias: 55.0, wing: 3.85 }
        },
        "Oversteer": {
            desc: "Aggressive pivot balance. High rake and stiff rear ARB for professional rotations.",
            values: { farb: 2, rarb: 7, fs: 4, rs: 7, fh: 5.0, rh: 7.5, bias: 49.0, wing: 1.9 }
        }
    }
};