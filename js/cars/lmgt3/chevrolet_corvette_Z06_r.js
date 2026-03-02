window.CARS = window.CARS || {};
window.CARS["chevrolet_corvette_Z06_r"] = {
    id: "chevrolet_corvette_Z06_r",
    name: "Chevrolet Corvette Z06 LMGT3.R",
    setupStructure: [
        {
            group: "Tires & Brakes",
            items: [
                { id: "tpressure_f", name: "Front Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "tpressure_r", name: "Rear Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "bias", name: "Brake Bias", type: "numeric", unit: "%", min: 43.0, max: 57.0, step: 0.25, default: 51.5 },
                {
                    id: "fbd", name: "Front Brake Duct", type: "labeled",
                    options: ["Open", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "Closed"].map((label, i) => ({ label, value: i * 0.1 })),
                    default: 3
                },
                {
                    id: "rbd", name: "Rear Brake Duct", type: "labeled",
                    options: ["Open", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "Closed"].map((label, i) => ({ label, value: i * 0.1 })),
                    default: 3
                }
            ]
        },
        {
            group: "Suspension",
            items: [
                { id: "fh", name: "Front Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 7.0, step: 0.1, default: 5.4 },
                { id: "rh", name: "Rear Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 8.5, step: 0.1, default: 6.7 },
                {
                    id: "fs", name: "Front Springs", type: "labeled", unit: "lbs/in",
                    options: [600, 800, 1000, 1200].map(v => ({ label: `${v} lbs/in`, value: v })),
                    default: 3
                },
                {
                    id: "rs", name: "Rear Springs", type: "labeled", unit: "lbs/in",
                    options: [1000, 1200, 1400, 1600, 1800, 2000].map(v => ({ label: `${v} lbs/in`, value: v })),
                    default: 0
                },
                { id: "fpk", name: "Front Packers", type: "numeric", unit: "cm", min: 0.0, max: 6.0, step: 0.1, default: 1.2 },
                { id: "rpk", name: "Rear Packers", type: "numeric", unit: "cm", min: 0.0, max: 6.0, step: 0.1, default: 0.0 },
                { id: "farb", name: "Front ARB", type: "numeric", min: 0, max: 28, step: 1, default: 13 },
                { id: "rarb", name: "Rear ARB", type: "numeric", min: 0, max: 28, step: 1, default: 1 }
            ]
        },
        {
            group: "Dampers",
            items: [
                { id: "fsb", name: "Front Slow Bump", type: "numeric", min: 0, max: 22, step: 1, default: 5 },
                { id: "fsr", name: "Front Slow Rebound", type: "numeric", min: 0, max: 22, step: 1, default: 6 },
                { id: "ffb", name: "Front Fast Bump", type: "numeric", min: 0, max: 29, step: 1, default: 8 },
                { id: "ffr", name: "Front Fast Rebound", type: "numeric", min: 0, max: 29, step: 1, default: 9 },
                { id: "rsb", name: "Rear Slow Bump", type: "numeric", min: 0, max: 22, step: 1, default: 6 },
                { id: "rsr", name: "Rear Slow Rebound", type: "numeric", min: 0, max: 22, step: 1, default: 5 },
                { id: "rfb", name: "Rear Fast Bump", type: "numeric", min: 0, max: 29, step: 1, default: 9 },
                { id: "rfr", name: "Rear Fast Rebound", type: "numeric", min: 0, max: 29, step: 1, default: 8 }
            ]
        },
        {
            group: "Aero & Alignment",
            items: [
                {
                    id: "wing", name: "Rear Wing", type: "labeled", unit: "deg",
                    options: [0.5, 1.5, 2.5, 3.5, 4.5, 6.5, 7.5, 8.5, 9.5].map(v => ({ label: `${v.toFixed(2)} deg`, value: v })),
                    default: 2
                },
                {
                    id: "ldwing", name: "Rear Wing", type: "labeled", unit: "deg",
                    options: [1.2, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0].map(v => ({ label: `${v.toFixed(2)} deg`, value: v })),
                    default: 2
                },
                { id: "ftoe", name: "Front Toe", type: "numeric", unit: "deg", min: -0.94, max: 0.94, step: 0.1175, default: 0.000 },
                { id: "rtoe", name: "Rear Toe", type: "numeric", unit: "deg", min: -0.94, max: 0.94, step: 0.1175, default: 0.234 },
                { id: "fcam", name: "Front Camber", type: "numeric", unit: "deg", min: -5.0, max: -2.0, step: 0.1, default: -2.2 },
                { id: "rcam", name: "Rear Camber", type: "numeric", unit: "deg", min: -4.5, max: -1.0, step: 0.1, default: -1.5 }
            ]
        }
    ],
    presets: {
        "Low Downforce": {
            desc: "Maximum velocity setup. Minimal wing and mechanical drag for high-speed dominance.",
            values: { wing: 1.5, fh: 5.2, rh: 5.5, farb: 8, rarb: 1, bias: 51.1 }
        },
        "High Downforce": {
            desc: "Mountain of grip. High wing angle and optimized rake for technical sectors.",
            values: { wing: 6.5, fh: 5.5, rh: 7.5, farb: 18, rarb: 4, bias: 52.9 }
        },
        "Understeer": {
            desc: "Stability focus. Stiff front anti-roll bars and forward bias to lock the car into a safe path.",
            values: { farb: 25, rarb: 1, fs: 3, rs: 1, fh: 5.4, rh: 6.0, bias: 56.5, wing: 4.5 }
        },
        "Oversteer": {
            desc: "Loose and fast. Soft front and aggressive rear stiffness to help the heavy Corvette pivot.",
            values: { farb: 5, rarb: 12, fs: 2, rs: 5, fh: 5.2, rh: 8.5, bias: 48.4, wing: 2.5 }
        }
    }
};