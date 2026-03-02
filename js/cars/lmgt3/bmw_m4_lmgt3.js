window.CARS = window.CARS || {};
window.CARS["bmw_m4_lmgt3"] = window.CAR_DATA = {
    id: "bmw_m4_lmgt3",
    name: "BMW M4 LMGT3",
    setupStructure: [
        {
            group: "Tires & Brakes",
            items: [
                { id: "tpressure_f", name: "Front Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "tpressure_r", name: "Rear Tire Pressure", type: "numeric", unit: "kPa", min: 136, max: 210, step: 1, default: 136 },
                { id: "bias", name: "Brake Bias", type: "numeric", unit: "%", min: 43.0, max: 57.0, step: 0.25, default: 51.2 },
                {
                    id: "fbd", name: "Front Brake Duct", type: "labeled",
                    options: [{ label: "Open", value: 0.0 }, { label: "33%", value: 0.33 }, { label: "67%", value: 0.67 }, { label: "Closed", value: 1.0 }],
                    default: 0
                },
                {
                    id: "rbd", name: "Rear Brake Duct", type: "labeled",
                    options: [{ label: "Open", value: 0.0 }, { label: "33%", value: 0.33 }, { label: "67%", value: 0.67 }, { label: "Closed", value: 1.0 }],
                    default: 0
                }
            ]
        },
        {
            group: "Suspension",
            items: [
                { id: "fh", name: "Front Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 9.0, step: 0.1, default: 5.1 },
                { id: "rh", name: "Rear Ride Height", type: "numeric", unit: "cm", min: 5.0, max: 10.0, step: 0.1, default: 5.8 },
                { id: "fs", name: "Front Springs", type: "numeric", min: 1, max: 6, step: 1, default: 2 },
                { id: "rs", name: "Rear Springs", type: "numeric", min: 1, max: 6, step: 1, default: 1 },
                { id: "fpk", name: "Front Packers", type: "numeric", unit: "cm", min: 0.0, max: 4.0, step: 0.1, default: 0.0 },
                { id: "rpk", name: "Rear Packers", type: "numeric", unit: "cm", min: 0.0, max: 4.0, step: 0.1, default: 0.0 },
                { id: "farb", name: "Front ARB", type: "numeric", min: 0, max: 10, step: 1, default: 4 },
                { id: "rarb", name: "Rear ARB", type: "numeric", min: 0, max: 10, step: 1, default: 1 }
            ]
        },
        {
            group: "Dampers",
            items: [
                { id: "fsb", name: "Front Slow Bump", type: "numeric", min: 0, max: 18, step: 1, default: 3 },
                { id: "fsr", name: "Front Slow Rebound", type: "numeric", min: 0, max: 18, step: 1, default: 5 },
                { id: "ffb", name: "Front Fast Bump", type: "numeric", min: 0, max: 18, step: 1, default: 4 },
                { id: "ffr", name: "Front Fast Rebound", type: "numeric", min: 0, max: 18, step: 1, default: 5 },
                { id: "rsb", name: "Rear Slow Bump", type: "numeric", min: 0, max: 18, step: 1, default: 5 },
                { id: "rsr", name: "Rear Slow Rebound", type: "numeric", min: 0, max: 18, step: 1, default: 3 },
                { id: "rfb", name: "Rear Fast Bump", type: "numeric", min: 0, max: 18, step: 1, default: 5 },
                { id: "rfr", name: "Rear Fast Rebound", type: "numeric", min: 0, max: 18, step: 1, default: 3 }
            ]
        },
        {
            group: "Aero & Alignment",
            items: [
                {
                    id: "wing", name: "Rear Wing", type: "labeled",
                    options: [-2.3, -1.7, -1.1, -0.4, 0.2, 0.8, 1.4, 2.1, 2.7, 3.3, 3.9, 4.6].map(v => ({ label: v.toFixed(2), value: v })),
                    default: 6
                },
                { id: "ftoe", name: "Front Toe", type: "numeric", unit: "deg", min: -0.937, max: 0.937, step: 0.117, default: -0.117 },
                { id: "rtoe", name: "Rear Toe", type: "numeric", unit: "deg", min: -0.937, max: 0.937, step: 0.117, default: 0.234 },
                { id: "fcam", name: "Front Camber", type: "numeric", unit: "deg", min: -5.00, max: -1.00, step: 0.10, default: -2.20 },
                { id: "rcam", name: "Rear Camber", type: "numeric", unit: "deg", min: -4.00, max: 0.00, step: 0.10, default: -1.50 }
            ]
        }
    ],
    presets: {
        "Low Downforce": {
            desc: "Minimal wing and low ride height for maximum straight-line speed at Le Mans or Monza.",
            values: { wing: -2.3, fh: 5.0, rh: 5.2, farb: 3, rarb: 3, bias: 50.5 }
        },
        "High Downforce": {
            desc: "Aggressive wing and balanced rake for maximum cornering speed and technical circuits.",
            values: { wing: 4.6, fh: 5.5, rh: 7.2, farb: 6, rarb: 4, fs: 4, rs: 3 }
        },
        "Understeer": {
            desc: "Safety-first setup. Stiff front and forward bias makes the car highly stable and predictable.",
            values: { farb: 8, rarb: 1, fs: 5, rs: 1, fh: 5.2, rh: 5.5, bias: 54.4, wing: 3.7 }
        },
        "Oversteer": {
            desc: "Pivot-focused setup. Stiff rear and high rake allows the car to rotate aggressively on corner entry.",
            values: { farb: 1, rarb: 8, fs: 1, rs: 5, fh: 5.0, rh: 8.5, bias: 48.1, wing: 1.3 }
        }
    }
};