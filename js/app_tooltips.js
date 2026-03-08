// ═══════════════════════════════════════════════════════════════════════════
// app_tooltips.js — Setup parameter tooltip panel (info icons)
// ═══════════════════════════════════════════════════════════════════════════

const TOOLTIP_DATA = {
    'tpressure_f': {
        title: 'Front Tire Pressure',
        desc: 'Internal air pressure of the front tires.',
        inc: 'Increases front carcass stiffness, reduces rolling resistance, and raises center temperature.',
        dec: 'Increases mechanical grip via a larger contact patch and generates more carcass heat.'
    },
    'tp_f': {
        title: 'Front Tire Pressure',
        desc: 'Internal air pressure of the front tires.',
        inc: 'Increases front carcass stiffness, reduces rolling resistance, and raises center temperature.',
        dec: 'Increases mechanical grip via a larger contact patch and generates more carcass heat.'
    },
    'tpressure_r': {
        title: 'Rear Tire Pressure',
        desc: 'Internal air pressure of the rear tires.',
        inc: 'Increases rear carcass stiffness, reduces rolling resistance, and raises center temperature.',
        dec: 'Increases mechanical grip via a larger contact patch and generates more carcass heat.'
    },
    'tp_r': {
        title: 'Rear Tire Pressure',
        desc: 'Internal air pressure of the rear tires.',
        inc: 'Increases rear carcass stiffness, reduces rolling resistance, and raises center temperature.',
        dec: 'Increases mechanical grip via a larger contact patch and generates more carcass heat.'
    },
    'fcam': {
        title: 'Front Camber',
        desc: 'The inward tilt of the front wheels. Optimizes the contact patch of the outside tire during cornering.',
        inc: 'More negative camber improves mid-corner lateral grip but reduces braking stability and increases inner tire wear/heat.',
        dec: 'More positive (closer to zero) camber improves braking and longitudinal traction at the cost of peak cornering grip.'
    },
    'fc': {
        title: 'Front Camber',
        desc: 'The inward tilt of the front wheels. Optimizes the contact patch of the outside tire during cornering.',
        inc: 'More negative camber improves mid-corner lateral grip but reduces braking stability and increases inner tire wear/heat.',
        dec: 'More positive (closer to zero) camber improves braking and longitudinal traction at the cost of peak cornering grip.'
    },
    'rcam': {
        title: 'Rear Camber',
        desc: 'The inward tilt of the rear wheels. Balances cornering traction against exit stability.',
        inc: 'Increases cornering grip and helps the rear follow the front. Too much can cause snap oversteer on exit.',
        dec: 'Improves traction out of slow corners and increases rear stability under power.'
    },
    'rc': {
        title: 'Rear Camber',
        desc: 'The inward tilt of the rear wheels. Balances cornering traction against exit stability.',
        inc: 'Increases cornering grip and helps the rear follow the front. Too much can cause snap oversteer on exit.',
        dec: 'Improves traction out of slow corners and increases rear stability under power.'
    },
    'fbd': {
        title: 'Front Brake Duct',
        desc: 'Controls airflow to the front brakes and tires.',
        inc: 'Closing the duct (higher value) increases brake/tire temperature and reduces aerodynamic drag.',
        dec: 'Opening the duct (lower value) cools brakes and tires but increases drag.'
    },
    'rbd': {
        title: 'Rear Brake Duct',
        desc: 'Controls airflow to the rear brakes and tires.',
        inc: 'Increases rear tire temperature, helping with warm-up. Reduces drag.',
        dec: 'Reduces rear brake/tire temperatures at the cost of slight drag increase.'
    },
    'bias': {
        title: 'Brake Bias',
        desc: 'The distribution of braking force between the front and rear axles, heavily influencing stability and turn-in.',
        inc: 'Shifting bias forward (+) provides stable, predictable braking in straights but causes severe understeer (plow) into corners as the front tires lock up early.',
        dec: 'Shifting bias rearward (-) makes the car agile and easy to rotate into corners but becomes unstable and squirrelly, with high risk of rear-end oversteer and spin (especially when trail braking).'
    },
    'b': {
        title: 'Brake Bias',
        desc: 'The distribution of braking force between the front and rear axles, heavily influencing stability and turn-in.',
        inc: 'Shifting bias forward (+) provides stable, predictable braking in straights but causes severe understeer (plow) into corners as the front tires lock up early.',
        dec: 'Shifting bias rearward (-) makes the car agile and easy to rotate into corners but becomes unstable and squirrelly, with high risk of rear-end oversteer and spin (especially when trail braking).'
    },
    'fs': {
        title: 'Front Springs',
        desc: 'Determines the stiffness of the front suspension.',
        inc: 'Stiffening reduces body roll and pitch, making the car more responsive (sharper turn-in) but increases understeer.',
        dec: 'Softening improves mechanical grip and compliance over bumps but makes the front end lazy and less precise.'
    },
    'rs': {
        title: 'Rear Springs',
        desc: 'Determines the stiffness of the rear suspension.',
        inc: 'Stiffening increases rotation and oversteer, helping the car pivot in slow corners.',
        dec: 'Softening improves rear traction and stability on exit, making the car more "planted".'
    },
    'fpk': {
        title: 'Front Packers',
        desc: 'Limit the travel of the front suspension. Prevents the floor from bottoming out.',
        inc: 'Increases the effective spring rate at high aero loads, protecting the splitter but can cause mid-corner understeer.',
        dec: 'Allows for more suspension travel, improving compliance on bumpy entries.'
    },
    'rpk': {
        title: 'Rear Packers',
        desc: 'Limit the travel of the rear suspension.',
        inc: 'Maintains rear ride height under high aero loads, supporting the diffuser. Can cause snap oversteer if the car hits the stops.',
        dec: 'Provides more compliance and predictable rear grip over big kerbs.'
    },
    'fh': {
        title: 'Front Ride Height',
        desc: 'The distance between the front splitter and the ground.',
        inc: 'Reduces front downforce and increases drag but provides more suspension travel for bumpy tracks.',
        dec: 'Significantly increases front downforce (ground effect). Too low causes the floor to stall or hit the ground.'
    },
    'rh': {
        title: 'Rear Ride Height',
        desc: 'The distance between the rear diffuser and the ground.',
        inc: 'Increases rake, shifting aerodynamic balance forward for better rotation. Too high increases drag.',
        dec: 'Reduces drag and increases rear stability at high speed but can lead to understeer.'
    },
    'fsb': {
        title: 'Front Slow Bump',
        desc: 'Controls how fast the front suspension compresses during body movements (roll/dive).',
        inc: 'Resists dive under braking and roll during turn-in, making the car feel more direct.',
        dec: 'Allows faster weight transfer to the front tires, improving initial turn-in bite.'
    },
    'fsr': {
        title: 'Front Slow Rebound',
        desc: 'Controls how fast the front suspension extends after being compressed.',
        inc: 'Keeps the nose down longer after braking, helping with mid-corner rotation.',
        dec: 'Allows the nose to rise faster, improving traction on corner exit.'
    },
    'ffb': {
        title: 'Front Fast Bump',
        desc: 'Controls how the front suspension handles high-speed impacts (kerbs/bumps).',
        inc: 'Makes the car feel more stable over small ripples but harsher over big kerbs.',
        dec: 'Improves compliance and stability when attacking aggressive kerbs.'
    },
    'ffr': {
        title: 'Front Fast Rebound',
        desc: 'Controls the return speed of the suspension after a high-speed bump.',
        inc: 'Stops the car from "bouncing" after hitting a kerb, keeping the contact patch stable.',
        dec: 'Allows the wheel to return to the ground faster after a bump.'
    },
    'ftoe': {
        title: 'Front Toe',
        desc: 'The angle of the front wheels relative to the car\'s centerline.',
        inc: 'Toe-in (+) increases straight-line stability but slows down turn-in response.',
        dec: 'Toe-out (-) sharpens initial turn-in rotation but can make the car wandering on straights.'
    },
    'rtoe': {
        title: 'Rear Toe',
        desc: 'The angle of the rear wheels relative to the car\'s centerline.',
        inc: 'Toe-in (+) locks the rear axle, improving stability and exit traction.',
        dec: 'Toe-out (-) makes the car very aggressive and prone to oversteer.'
    },
    'farb': {
        title: 'Front Anti-Roll Bar',
        desc: 'Controls the lateral roll stiffness of the front axle.',
        inc: 'Reduces front roll, keeping the car flatter. Increases understeer in mid-corner.',
        dec: 'Increases front-end roll and mechanical grip, reducing understeer but feeling less responsive.'
    },
    'rarb': {
        title: 'Rear Anti-Roll Bar',
        desc: 'Controls the lateral roll stiffness of the rear axle.',
        inc: 'Increases rotation and mid-corner oversteer. Helps the car "rotate" around its axis.',
        dec: 'Stabilizes the rear end through corners, reducing oversteer.'
    },
    'wing': {
        title: 'Rear Wing',
        desc: 'The primary source of rear aerodynamic downforce.',
        inc: 'Massively increases rear grip and stability at high speed but adds significant drag (lower top speed).',
        dec: 'Reduces drag for higher top speed but makes the car very loose in fast corners.'
    },
    'third_Fspring': {
        title: 'Front Heave Spring',
        desc: 'Keeps the front aerodynamic platform stable by resisting vertical movements independently of roll.',
        inc: 'Prevents front-end diving at high speed, maintaining consistent aero balance.',
        dec: 'Provides more vertical compliance for better bump absorption at the cost of aero stability.'
    },
    'third_fpk': {
        title: 'Front Heave Packers',
        desc: 'Adjusts the limited travel of the front third spring.',
        inc: 'Increases the effective spring rate sooner, preventing front heave travel at high aero loads.',
        dec: 'Allows more front suspension travel before the packers engage.'
    },
    'third_Rspring': {
        title: 'Rear Heave Spring',
        desc: "Controls the car's vertical movement (heave) and pitch (squat), independently of roll.",
        inc: 'Prevents rear-end squatting under acceleration and maintains constant aero platform at high speed.',
        dec: 'Provides more vertical compliance for bump absorption but can lose aero stability.'
    },
    'third_rpk': {
        title: 'Rear Heave Packers',
        desc: 'Adjusts the limited travel of the rear third spring.',
        inc: 'Increases the effective spring rate sooner, preventing rear heave travel at high aero loads.',
        dec: 'Allows more rear suspension travel before the packers engage.'
    }
};

const tooltip = document.getElementById('setup-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipDesc = document.getElementById('tooltip-desc');
const tooltipInc = document.getElementById('tooltip-inc');
const tooltipDec = document.getElementById('tooltip-dec');
let tooltipTimeout = null;

function showTooltip(id, e) {
    const data = TOOLTIP_DATA[id];
    if (!data) return;

    clearTimeout(tooltipTimeout);

    tooltipTimeout = setTimeout(() => {
        tooltipTitle.innerText = data.title;
        tooltipDesc.innerText = data.desc;
        tooltipInc.innerText = data.inc;
        tooltipDec.innerText = data.dec;

        tooltip.classList.remove('hidden');
        tooltip.offsetHeight;
        tooltip.classList.add('opacity-100');
        updateTooltipPos(e);
    }, 500);
}

function hideTooltip() {
    clearTimeout(tooltipTimeout);
    tooltip.classList.remove('opacity-100');
    tooltip.classList.add('pointer-events-none');
    setTimeout(() => {
        if (!tooltip.classList.contains('opacity-100')) {
            tooltip.classList.add('hidden');
        }
    }, 200);
}

tooltip.addEventListener('click', e => e.stopPropagation());

function updateTooltipPos(e) {
    const xOffset = 16;
    const yOffset = 16;

    const point = e.touches ? e.touches[0] : e;

    let x = point.clientX + xOffset;
    let y = point.clientY + yOffset;

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const tW = tooltip.offsetWidth;
    const tH = tooltip.offsetHeight;
    const margin = 12;

    if (x + tW > winW - margin) {
        x = point.clientX - tW - xOffset;
    }

    if (y + tH > winH - margin) {
        y = point.clientY - tH - yOffset;
    }

    x = Math.max(margin, Math.min(x, winW - tW - margin));
    y = Math.max(margin, Math.min(y, winH - tH - margin));

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

let tooltipPinned = false;

document.querySelectorAll('[id$="C_label"]').forEach(labelEl => {
    const id = labelEl.id.replace('C_label', '');
    if (!TOOLTIP_DATA[id]) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-1';
    labelEl.parentNode.insertBefore(wrapper, labelEl);
    wrapper.appendChild(labelEl);

    const btn = document.createElement('button');
    btn.className = 'info-icon-btn';
    btn.setAttribute('data-tooltip-id', id);
    btn.setAttribute('type', 'button');
    btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
    wrapper.appendChild(btn);

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeId = tooltip.getAttribute('data-active-id');
        const isShown = !tooltip.classList.contains('hidden') && activeId === id;
        if (isShown) {
            tooltipPinned = false;
            tooltip.removeAttribute('data-active-id');
            hideTooltip();
        } else {
            tooltipPinned = true;
            tooltip.setAttribute('data-active-id', id);
            clearTimeout(tooltipTimeout);
            const data = TOOLTIP_DATA[id];
            tooltipTitle.innerText = data.title;
            tooltipDesc.innerText = data.desc;
            tooltipInc.innerText = data.inc;
            tooltipDec.innerText = data.dec;
            tooltip.classList.remove('hidden', 'pointer-events-none');
            tooltip.offsetHeight;
            tooltip.classList.add('opacity-100');
            updateTooltipPos(e);
        }
    });
});

document.querySelectorAll('.info-icon-btn').forEach(btn => {
    const id = btn.getAttribute('data-tooltip-id');
    btn.addEventListener('mouseenter', e => {
        if (!tooltipPinned) {
            showTooltip(id, e);
        }
    });
    btn.addEventListener('mousemove', e => {
        if (!tooltipPinned) {
            updateTooltipPos(e);
        }
    });
    btn.addEventListener('mouseleave', () => {
        if (!tooltipPinned) {
            hideTooltip();
        }
    });
});

document.addEventListener('click', () => {
    if (tooltipPinned) {
        tooltipPinned = false;
        tooltip.removeAttribute('data-active-id');
        hideTooltip();
    }
});
