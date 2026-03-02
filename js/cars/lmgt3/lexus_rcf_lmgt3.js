window.CARS = window.CARS || {};
window.CARS["lexus_rcf_lmgt3"] = {
    id: "lexus_rcf_lmgt3",
    name: "Lexus RCF LMGT3",
    setupStructure: [
        {
            group: "Tires & Brakes",
            items: [
                { id: "tpressure_f", name: "Front Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "tpressure_r", name: "Rear Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "bias", name: "Brake Bias", type: "numeric", unit: "%", min: 43.0, max: 57.0, step: 0.25, default: 51.5 },
                {
                    id: "fbd", name: "Front Brake Duct", type: "labeled",
                    options: [
                        { label: "Open", value: 0.0 }, { label: "10%", value: 0.1 }, { label: "20%", value: 0.2 },
                        { label: "30%", value: 0.3 }, { label: "40%", value: 0.4 }, { label: "50%", value: 0.5 },
                        { label: "60%", value: 0.6 }, { label: "70%", value: 0.7 }, { label: "80%", value: 0.8 },
                        { label: "90%", value: 0.9 }, { label: "Closed", value: 1.0 }
                    ],
                    default: 0
                },
                {
                    id: "rbd", name: "Rear Brake Duct", type: "labeled",
                    options: [
                        { label: "Open", value: 0.0 }, { label: "10%", value: 0.1 }, { label: "20%", value: 0.2 },
                        { label: "30%", value: 0.3 }, { label: "40%", value: 0.4 }, { label: "50%", value: 0.5 },
                        { label: "60%", value: 0.6 }, { label: "70%", value: 0.7 }, { label: "80%", value: 0.8 },
                        { label: "90%", value: 0.9 }, { label: "Closed", value: 1.0 }
                    ],
                    default: 0
                }
            ]
        },
        {
            group: "Suspension",
            items: [
                { id: "fh", name: "Front Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 8.5, step: 0.1, default: 5.0 },
                { id: "rh", name: "Rear Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 10.0, step: 0.1, default: 5.0 },
                { id: "fs", name: "Front Springs", type: "numeric", min: 1, max: 6, step: 1, default: 3 },
                { id: "rs", name: "Rear Springs", type: "numeric", min: 1, max: 6, step: 1, default: 2 },
                { id: "fpk", name: "Front Packers", type: "numeric", unit: "cm", min: 0.0, max: 5.0, step: 0.1, default: 0.0 },
                { id: "rpk", name: "Rear Packers", type: "numeric", unit: "cm", min: 0.0, max: 6.0, step: 0.1, default: 0.0 },
                { id: "farb", name: "Front ARB", type: "numeric", min: 0, max: 7, step: 1, default: 3 },
                { id: "rarb", name: "Rear ARB", type: "numeric", min: 0, max: 7, step: 1, default: 2 }
            ]
        },
        {
            group: "Dampers",
            items: [
                { id: "fsb", name: "Front Slow Bump", type: "numeric", min: 0, max: 11, step: 1, default: 3 },
                { id: "fsr", name: "Front Slow Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 2 },
                { id: "ffb", name: "Front Fast Bump", type: "numeric", min: 0, max: 11, step: 1, default: 2 },
                { id: "ffr", name: "Front Fast Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 3 },
                { id: "rsb", name: "Rear Slow Bump", type: "numeric", min: 0, max: 11, step: 1, default: 3 },
                { id: "rsr", name: "Rear Slow Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 3 },
                { id: "rfb", name: "Rear Fast Bump", type: "numeric", min: 0, max: 11, step: 1, default: 3 },
                { id: "rfr", name: "Rear Fast Rebound", type: "numeric", min: 0, max: 11, step: 1, default: 3 }
            ]
        },
        {
            group: "Aero & Alignment",
            items: [
                {
                    id: "wing", name: "Rear Wing", type: "labeled", unit: "deg",
                    options: [1.75, 2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.2, 4.5, 4.8, 5.1, 5.4, 5.7, 6.1, 6.4, 6.7, 7.0, 7.3, 7.6, 7.9, 8.2, 8.5, 8.8, 9.1, 9.4, 9.7, 10.0, 10.4, 10.7].map(v => ({ label: `${v.toFixed(2)} deg`, value: v })),
                    default: 25
                },
                {
                    id: "ldwing", name: "Rear Wing", type: "labeled", unit: "deg",
                    options: [7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0].map(v => ({ label: `${v.toFixed(2)} deg`, value: v })),
                    default: 1
                },
                { id: "ftoe", name: "Front Toe", type: "numeric", unit: "deg", min: -1.00, max: 1.00, step: 0.06, default: -0.13 },
                { id: "rtoe", name: "Rear Toe", type: "numeric", unit: "deg", min: -1.00, max: 1.00, step: 0.06, default: 0.13 },
                { id: "fcam", name: "Front Camber", type: "numeric", unit: "deg", min: -5.0, max: -1.8, step: 0.1, default: -2.2 },
                { id: "rcam", name: "Rear Camber", type: "numeric", unit: "deg", min: -3.8, max: -1.0, step: 0.1, default: -1.8 }
            ]
        }
    ],
    presets: {
        "Low Downforce": {
            desc: "Focus on reducing drag for high-speed circuits like Le Mans. Flatter wing and lower ride height.",
            values: { wing: 7.0, fh: 5.0, rh: 5.2, farb: 3, rarb: 2, bias: 50.5 }
        },
        "High Downforce": {
            desc: "Steep wing angle and adjusted rake for maximum aerodynamic grip in technical sectors.",
            values: { wing: 13.0, fh: 5.5, rh: 7.0, farb: 5, rarb: 4, fs: 5, rs: 4 }
        },
        "Understeer": {
            desc: "Stability focused profile. Stiff front roll-bars and forward bias for a rock-solid braking feel.",
            values: { farb: 7, rarb: 1, fs: 5, rs: 1, fh: 5.4, rh: 5.6, bias: 55.6, wing: 11.0 }
        },
        "Oversteer": {
            desc: "Sharp turn-in setup. High rake and stiff rear suspension to overcome the Lexus's weight.",
            values: { farb: 1, rarb: 7, fs: 2, rs: 5, fh: 5.0, rh: 8.5, bias: 48.1, wing: 8.0 }
        }
    },
};