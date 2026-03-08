// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// app.js â€” Setup management, car loader, fuel calculator, app bootstrap
// Sub-modules loaded before this file:
//   app_core.js â†’ app_ui.js â†’ app_update.js â†’ app_tooltips.js â†’ app.js
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€ Setup Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getStorageKey = () => window.LMA_Setup.getStorageKey(CAR);
const gatherCurrentSetup = () => window.LMA_Setup.gatherCurrentSetup(CAR, els);
const saveCurrentSetup = () => window.LMA_Setup.saveCurrentSetup(CAR, els);
const deleteSavedSetup = (index) => window.LMA_Setup.deleteSavedSetup(CAR, index, els);

const presetContainer = document.getElementById('presetContainer');

const renderPresets = () => window.LMA_Setup.renderPresets(CAR, els);
renderPresets();

const saveSetupBtn = document.getElementById('saveSetupBtn');
const deleteSetupBtn = document.getElementById('deleteSetupBtn');
if (saveSetupBtn) saveSetupBtn.onclick = saveCurrentSetup;
if (deleteSetupBtn) deleteSetupBtn.onclick = () => {
    if (localStorage.getItem(getStorageKey())) {
        deleteSavedSetup();
    }
};

// â”€â”€ Load Car â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function loadCar(carId) {
    if (!window.CARS || !window.CARS[carId]) return;

    CAR = window.CARS[carId];
    DEFAULTS = CAR.setupStructure ? gatherDefaults(CAR.setupStructure) : CAR.defaults;
    PRESETS = CAR.presets;

    if (PHYSICS_DATA && PHYSICS_DATA.cars) {
        const p = PHYSICS_DATA.cars.find(c => c.id.toLowerCase() === carId.toLowerCase());
        if (p) CAR.physics = { ...CAR.physics, ...p };
    }

    if (CAR.setupStructure) {
        const wingHigh = CAR.setupStructure.reduce((acc, g) => acc || g.items.find(i => i.id === 'wing_highdrag'), null);
        if (wingHigh) {
            const wingActive = CAR.setupStructure.reduce((acc, g) => acc || g.items.find(i => i.id === 'wing'), null);
            if (wingActive) {
                wingHigh.id = 'wing';
                wingActive.id = 'ldwing';
            }
        }

        const hasLdWing = CAR.setupStructure.some(g => g.items.some(i => i.id === 'ldwing'));
        if (hasLdWing && els.wingToggleContainer) {
            els.wingToggleContainer.classList.remove('hidden');
            els.highDragBtn.classList.add('active', 'border-blue-500/30', 'bg-blue-500/10', 'text-blue-400');
            els.highDragBtn.classList.remove('border-white/5', 'text-slate-500');
            els.lowDragBtn.classList.remove('active', 'border-blue-500/30', 'bg-blue-500/10', 'text-blue-400');
            els.lowDragBtn.classList.add('border-white/5', 'text-slate-500');
        } else if (els.wingToggleContainer) {
            els.wingToggleContainer.classList.add('hidden');
        }

        CAR.setupStructure.forEach(group => {
            group.items.forEach(item => {
                if (els[item.id] && els[item.id].tagName === 'INPUT') {
                    const input = els[item.id];
                    if (item.type === 'labeled') {
                        input.min = 0;
                        input.max = item.options.length - 1;
                        input.step = 1;
                    } else {
                        input.min = item.min;
                        input.max = item.max;
                        input.step = item.step;
                    }
                    input.value = item.default;
                    updateSliderFill(input);
                }
            });
        });
    } else if (CAR.ranges) {
        Object.entries(CAR.ranges).forEach(([key, range]) => {
            if (els[key] && els[key].tagName === 'INPUT') {
                els[key].min = range.min;
                els[key].max = range.max;
                els[key].step = range.step;
                els[key].value = DEFAULTS[key];
                updateSliderFill(els[key]);
            }
        });
    }

    const hasSetting = (id) => {
        if (CAR.setupStructure) {
            return CAR.setupStructure.some(g => g.items.some(i => i.id === id));
        }
        return !!(CAR.ranges && CAR.ranges[id]);
    };

    const tenderEls = document.querySelectorAll('.tender-setting');
    if (hasSetting('tender_f')) {
        tenderEls.forEach(el => el.classList.remove('hidden'));
    } else {
        tenderEls.forEach(el => el.classList.add('hidden'));
    }

    const thirdSpringEls = document.querySelectorAll('.third-spring-setting');
    if (hasSetting('third_Fspring')) {
        thirdSpringEls.forEach(el => el.classList.remove('hidden'));
    } else {
        thirdSpringEls.forEach(el => el.classList.add('hidden'));
    }

    renderPresets();

    update();
}

// â”€â”€ Fuel Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

let fuelMode = 'time';

function calculateFuel() {
    if (!els.fuelLapMin) return;

    const min = parseInt(els.fuelLapMin.value) || 0;
    const sec = parseInt(els.fuelLapSec.value) || 0;
    const ms = parseInt(els.fuelLapMs.value) || 0;
    const lapTimeSec = (min * 60) + sec + (ms / 1000);

    if (lapTimeSec <= 0) return;

    const fuelPerLap = parseFloat(els.fuelPerLapInput.value) || 0;
    if (fuelPerLap <= 0) return;

    let totalLaps = 0;

    if (fuelMode === 'time') {
        const hrs = parseInt(els.fuelHours.value) || 0;
        const mins = parseInt(els.fuelMinutes.value) || 0;
        const totalSec = (hrs * 3600) + (mins * 60);

        const estimatedLaps = totalSec / lapTimeSec;

        totalLaps = Math.ceil(estimatedLaps) + 1;

    } else {
        totalLaps = parseInt(els.fuelTotalLaps.value) || 0;
    }

    const roundedLaps = Math.ceil(totalLaps);
    const requiredFuel = roundedLaps * fuelPerLap;

    const extraSafetyLaps = 2;
    const variancePercent = 0.05;

    const safetyLaps = roundedLaps + extraSafetyLaps;
    const safetyFuel = safetyLaps * fuelPerLap * (1 + variancePercent);

    els.fuelResultLaps.innerText = roundedLaps;
    els.fuelResultFuel.innerText = requiredFuel.toFixed(1) + ' L';
    els.fuelResultSafety.innerText = safetyFuel.toFixed(1) + ' L';
}

function initFuelCalculator() {
    const inputs = [
        els.fuelHours, els.fuelMinutes, els.fuelTotalLaps,
        els.fuelLapMin, els.fuelLapSec, els.fuelLapMs, els.fuelPerLapInput
    ];

    inputs.forEach(input => {
        if (input) {
            input.oninput = calculateFuel;
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.value = input.id === 'fuelPerLapInput' ? '0.1' : '0';
                    calculateFuel();
                }
            });
        }
    });

    // Custom spinner buttons (âˆ’ / +)
    document.querySelectorAll('.num-spinner-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (!target) return;
            const step = parseFloat(target.step) || 1;
            const min  = target.min !== '' ? parseFloat(target.min) : -Infinity;
            const max  = target.max !== '' ? parseFloat(target.max) :  Infinity;
            let val = parseFloat(target.value) || 0;
            val = btn.dataset.action === 'inc' ? val + step : val - step;
            val = Math.min(Math.max(val, min), max);
            target.value = Number.isInteger(step) ? String(Math.round(val)) : val.toFixed(1);
            target.dispatchEvent(new Event('input'));
        });
    });

    if (els.fuelModeTime) {
        els.fuelModeTime.onclick = () => {
            fuelMode = 'time';
            els.fuelModeTime.classList.add('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            els.fuelModeTime.classList.remove('text-slate-500');
            els.fuelModeLaps.classList.add('text-slate-500');
            els.fuelModeLaps.classList.remove('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            els.fuelTimeInputs.classList.remove('hidden');
            els.fuelLapsInput.classList.add('hidden');
            els.fuelLapTimeLabel.classList.remove('hidden');
            calculateFuel();
        };
    }

    if (els.fuelModeLaps) {
        els.fuelModeLaps.onclick = () => {
            fuelMode = 'laps';
            els.fuelModeLaps.classList.add('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            els.fuelModeLaps.classList.remove('text-slate-500');
            els.fuelModeTime.classList.add('text-slate-500');
            els.fuelModeTime.classList.remove('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            els.fuelLapsInput.classList.remove('hidden');
            els.fuelTimeInputs.classList.add('hidden');
            els.fuelLapTimeLabel.classList.add('hidden');
            calculateFuel();
        };
    }

    calculateFuel();
}

update();
initFuelCalculator();

// â”€â”€ Physics & App Bootstrap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function initPhysics() {
    try {
        const [lmgt3Res, lmp2Res, lmp3Res] = await Promise.all([
            fetch('js/cars/lmgt3/physics_lmgt3.json'),
            fetch('js/cars/lmp2/physics_lmp2.json'),
            fetch('js/cars/lmp3/physics_lmp3.json')
        ]);

        const lmgt3Data = await lmgt3Res.json();
        const lmp2Data = await lmp2Res.json();
        const lmp3Data = await lmp3Res.json();

        PHYSICS_DATA = {
            cars: [...(lmgt3Data.cars || []), ...(lmp2Data.cars || []), ...(lmp3Data.cars || [])]
        };

        if (CAR && CAR.id && PHYSICS_DATA.cars) {
            const p = PHYSICS_DATA.cars.find(c => c.id === CAR.id);
            if (p) CAR.physics = { ...CAR.physics, ...p };
        }
        update();
    } catch (e) {
        console.error("Failed to load physics JSON files", e);
    }
}

function initApp() {
    initPhysics();
    initMachineDropdown();
    initTracks();
    initTooltips();
}

initApp();


