window.LMA_Utils = {
    UNITS: {
        LBSIN_TO_NMM: 0.1751268,
        MM_TO_CM: 0.1,
        IN_TO_M: 0.0254,
        KPA_TO_PSI: 0.145038
    },

    getStandardizedValue: (car, id, rawValue) => {
        const config = window.LMA_Utils.getItemConfig(car, id);
        if (!config) return rawValue;

        let val = rawValue;

        if (config.type === 'labeled') {
            const opt = config.options[rawValue];
            val = (typeof opt === 'object' && opt.value !== undefined) ? opt.value : rawValue;
        }

        const unit = config.unit || '';

        if (id.includes('s') && !id.includes('sb') && !id.includes('sr')) {
            if (unit === 'lbs/in') return val * window.LMA_Utils.UNITS.LBSIN_TO_NMM;
            if (unit === 'N/mm') return val;

            const isLMP = car.id.includes('lmp');
            const base = isLMP ? 200 : 150;
            const step = isLMP ? 30 : 20;
            return base + (val * step);
        }

        // Standardize Lengths to CM
        if (unit === 'mm') return val * 0.1;
        if (unit === 'cm') return val;

        return val;
    },

    getItemConfig: (car, id) => {
        if (!car || !car.setupStructure) return null;
        for (const group of car.setupStructure) {
            const item = group.items.find(i => i.id === id);
            if (item) return item;
        }
        return null;
    },

    getParamRange: (car, id) => {
        let config = window.LMA_Utils.getItemConfig(car, id);
        if (!config && (id === 'tpressure' || id === 'tpressure_f' || id === 'tpressure_r')) {
            config = window.LMA_Utils.getItemConfig(car, 'tpressure_f') ||
                window.LMA_Utils.getItemConfig(car, 'tpressure') ||
                window.LMA_Utils.getItemConfig(car, 'tpressure_r');
        }

        if (config) {
            if (config.type === 'labeled') {
                const nums = config.options.map(o => {
                    const v = (typeof o === 'object' ? o.value : o);
                    return (typeof v === 'number' && !isNaN(v)) ? v : null;
                }).filter(v => v !== null);

                if (nums.length > 0) {
                    const min = Math.min(...nums);
                    const max = Math.max(...nums);

                    let step = 1;
                    if (nums.length > 1) step = nums[1] - nums[0];
                    return { min, max, step };
                }

                return { min: 0, max: config.options.length - 1, step: 1 };
            }
            return { min: config.min, max: config.max, step: config.step };
        }
        if (car.ranges && car.ranges[id]) {
            return car.ranges[id];
        }
        return { min: 0, max: 100, step: 1 };
    },

    formatLabel: (car, id, val) => {
        let displayVal = val;
        const config = window.LMA_Utils.getItemConfig(car, id);

        if (config) {
            if (config.reverse && typeof val === 'number') {
                displayVal = (config.max + config.min) - val;
            }

            if (config.type === 'labeled') {
                const opt = config.options[val];
                displayVal = opt !== undefined ? (typeof opt === 'object' ? opt.label : opt) : val;
            } else if (typeof displayVal === 'number') {
                let decimals = 0;
                if (config.step !== undefined) {
                    const stepStr = config.step.toString();
                    decimals = stepStr.indexOf('.') > -1 ? stepStr.split('.')[1].length : 0;
                }
                const unit = config.unit || '';
                if (unit === 'mm' || unit === 'cm') decimals = Math.min(decimals, 1);
                else decimals = Math.min(decimals, 3);
                displayVal = displayVal.toFixed(decimals);
            }

            if (config.unit && typeof displayVal === 'string' && !displayVal.includes(config.unit)) {
                let unit = config.unit;
                if (unit === 'deg') unit = '°';
                displayVal += unit;
            }

            if (config.prefix && typeof displayVal === 'string' && !displayVal.startsWith(config.prefix)) {
                displayVal = config.prefix + displayVal;
            }
        } else if (car.ranges && car.ranges[id]) {
            const range = car.ranges[id];
            if (range.labelPrefix) displayVal = range.labelPrefix + val;
            if (range.labels) displayVal = range.labels[val] || val;
        }

        return displayVal;
    }
};
