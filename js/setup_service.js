window.LMA_Setup = {
    getStorageKey: (car) => {
        if (!car) return 'lma_setup_v1';
        return `lma_setup_${car.id}_v1`;
    },

    gatherCurrentSetup: (car, els) => {
        const setup = {};
        if (car.setupStructure) {
            car.setupStructure.forEach(group => {
                group.items.forEach(item => {
                    if (els[item.id]) {
                        setup[item.id] = parseFloat(els[item.id].value);
                    }
                });
            });
        }
        return setup;
    },

    saveCurrentSetup: (car, els) => {
        const setup = window.LMA_Setup.gatherCurrentSetup(car, els);
        const name = prompt("Enter setup name:", "My Setup");
        if (!name) return;

        const key = window.LMA_Setup.getStorageKey(car);
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        saved.push({ name, date: new Date().toISOString(), setup });
        localStorage.setItem(key, JSON.stringify(saved));
        window.LMA_Setup.renderPresets(car, els);
    },

    deleteSavedSetup: (car, index, els) => {
        const key = window.LMA_Setup.getStorageKey(car);
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        saved.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(saved));
        window.LMA_Setup.renderPresets(car, els);
    },

    renderPresets: (car, els) => {
        const container = document.getElementById('presetContainer');
        if (!container) return;
        container.innerHTML = '';

        const createBtn = (title, subtitle, onClick, type = 'factory') => {
            const btn = document.createElement('button');

            // Determine styling based on type
            let activeClass = '';
            let accentColor = '';
            let icon = '';

            if (type === 'factory') {
                accentColor = 'var(--orange)';
                icon = `<div class="w-1 h-3 bg-amber-500 rounded-full mr-3"></div>`;
            } else if (type === 'preset') {
                accentColor = 'var(--blue)';
                icon = `<div class="w-1 h-3 bg-blue-500 rounded-full mr-3 opacity-50 group-hover:opacity-100 transition-opacity"></div>`;
            } else {
                accentColor = 'var(--green)';
                icon = `<div class="w-1 h-3 bg-emerald-500 rounded-full mr-3 opacity-70"></div>`;
            }

            btn.className = 'preset-btn group';
            // Overwrite styling to match the rest of the application's sidebar cards
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.padding = '8px 12px';
            btn.style.marginBottom = '2px';
            btn.style.background = 'rgba(255, 255, 255, 0.015)';
            btn.style.border = '1px solid rgba(255, 255, 255, 0.04)';
            btn.style.borderRadius = 'var(--radius-sm)';
            btn.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

            btn.innerHTML = `
                ${icon}
                <div class="flex flex-col min-w-0">
                    <span class="text-[10px] font-black tracking-widest uppercase transition-colors group-hover:text-white ${type === 'factory' ? 'text-amber-500/90' : 'text-slate-300'}">${title}</span>
                    <span class="text-[8px] text-slate-500 font-bold uppercase tracking-tight truncate">${subtitle}</span>
                </div>
            `;

            btn.onclick = () => {
                onClick();
                container.querySelectorAll('.preset-btn').forEach(b => {
                    b.style.background = 'rgba(255, 255, 255, 0.015)';
                    b.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                    b.classList.remove('active');
                });
                btn.style.background = `linear-gradient(90deg, ${accentColor}15, transparent)`;
                btn.style.borderColor = accentColor;
                btn.classList.add('active');
            };

            return btn;
        };

        // 1. Factory Default
        const factoryBtn = createBtn('Base', 'Factory Defaults', () => {
            const defaults = window.gatherDefaults ? window.gatherDefaults(car.setupStructure) : car.defaults;
            if (defaults) {
                Object.entries(defaults).forEach(([key, val]) => {
                    if (els[key]) {
                        els[key].value = val;
                        if (window.updateSliderFill) window.updateSliderFill(els[key]);
                    }
                });
            }
            if (window.update) window.update();
        }, 'factory');
        factoryBtn.classList.add('active');
        factoryBtn.style.background = 'linear-gradient(90deg, var(--orange)15, transparent)';
        factoryBtn.style.borderColor = 'var(--orange)';
        container.appendChild(factoryBtn);

        // 2. Built-in Car Presets
        if (car.presets) {
            Object.entries(car.presets).forEach(([name, data]) => {
                const btn = createBtn(name, data.desc || 'Preset', () => {
                    const vals = data.values || data.setup || data;
                    Object.entries(vals).forEach(([id, val]) => {
                        if (els[id]) {
                            els[id].value = val;
                            if (window.updateSliderFill) window.updateSliderFill(els[id]);
                        }
                    });
                    if (window.update) window.update();
                }, 'preset');
                container.appendChild(btn);
            });
        }

        // 3. Saved Setups
        const key = window.LMA_Setup.getStorageKey(car);
        const saved = JSON.parse(localStorage.getItem(key) || '[]');

        saved.forEach((item, index) => {
            const dateStr = new Date(item.date).toLocaleDateString();
            const btn = createBtn(item.name, dateStr, () => {
                Object.entries(item.setup).forEach(([id, val]) => {
                    if (els[id]) {
                        els[id].value = val;
                        if (window.updateSliderFill) window.updateSliderFill(els[id]);
                    }
                });
                if (window.update) window.update();
            }, 'saved');
            container.appendChild(btn);
        });
    }
};
