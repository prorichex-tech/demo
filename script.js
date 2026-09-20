// ============================================================
// ВАШ ПРОЕКТ — интерактивы сайта
// ============================================================

// ---------- Header / mobile menu ----------
const header = document.querySelector('.header');
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 30);
});

burger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    header?.classList.toggle('menu-open');
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        header?.classList.remove('menu-open');
    });
});

// ---------- Services preview ----------
const serviceButtons = document.querySelectorAll('.service');
const servicePreview = document.querySelector('.service-preview');

const serviceGradients = {
    s1: 'linear-gradient(135deg,#718b82,#274b50)',
    s2: 'linear-gradient(135deg,#5b7cff,#1e3b8e)',
    s3: 'linear-gradient(135deg,#b9c8c0,#60766e)',
    s4: 'linear-gradient(135deg,#c8f169,#506735)',
    s5: 'linear-gradient(135deg,#8da2ff,#4c4c85)',
    s6: 'linear-gradient(135deg,#d7ddd7,#66726e)',
    s7: 'linear-gradient(135deg,#8caba2,#34585a)'
};

function activateService(button) {
    serviceButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    if (servicePreview) {
        servicePreview.style.background = serviceGradients[button.dataset.img] || serviceGradients.s1;
    }
}

serviceButtons.forEach((button) => {
    button.addEventListener('mouseenter', () => activateService(button));
    button.addEventListener('click', () => activateService(button));
});

// ---------- Works filters ----------
const filters = document.querySelectorAll('.filter');
const galleryItems = document.querySelectorAll('.gitem');

filters.forEach((filter) => {
    filter.addEventListener('click', () => {
        filters.forEach((item) => item.classList.remove('active'));
        filter.classList.add('active');

        const category = filter.dataset.filter;

        galleryItems.forEach((item) => {
            const shouldHide = category !== 'all' && item.dataset.cat !== category;
            item.classList.toggle('hide', shouldHide);
        });
    });
});

// ---------- Process stages ----------
const stages = document.querySelectorAll('.stage');
const stageVisual = document.querySelector('.stage-visual');

const stageGradients = [
    'linear-gradient(135deg,#a7c2b8,#31565a)',
    'linear-gradient(135deg,#5b7cff,#1e3b8e)',
    'linear-gradient(135deg,#c8f169,#526b38)',
    'linear-gradient(135deg,#d3dad5,#66736e)',
    'linear-gradient(135deg,#78938b,#2d5053)',
    'linear-gradient(135deg,#5b7cff,#c8f169)'
];

stages.forEach((stage, index) => {
    stage.addEventListener('click', () => {
        stages.forEach((item) => item.classList.remove('active'));
        stage.classList.add('active');

        if (stageVisual) {
            stageVisual.style.background = stageGradients[index] || stageGradients[0];
        }
    });
});

// ============================================================
// Интерактивный сборщик ремонта
// ============================================================
const builder = document.querySelector('#repairBuilder');

if (builder) {
    const screens = [...builder.querySelectorAll('.builder-screen')];
    const formScreen = builder.querySelector('#builderForm');
    const progressSteps = [...builder.querySelectorAll('.progress-step')];

    const state = {
        room: 'Квартира',
        area: 54,
        works: []
    };

    const coreWorkNames = [
        'Стены',
        'Пол',
        'Кафель',
        'Обои',
        'Двери',
        'Декоративная отделка'
    ];

    const roomButtons = [...builder.querySelectorAll('.room-option')];
    const workButtons = [...builder.querySelectorAll('.work-option')];
    const areaRange = builder.querySelector('#builderAreaRange');
    const areaInput = builder.querySelector('#builderAreaInput');
    const areaError = builder.querySelector('#areaError');

    function isValidArea(value) {
        const number = Number(value);
        return Number.isFinite(number) && number >= 20 && number <= 300;
    }

    function setScreen(screenName) {
        screens.forEach((screen) => {
            screen.classList.toggle('active', screen.dataset.screen === screenName);
        });

        formScreen?.classList.remove('active');

        progressSteps.forEach((step) => {
            step.classList.toggle('active', step.dataset.progress === screenName);
        });

        if (screenName === 'done') {
            renderSummary();
        }
    }

    function syncArea(rawValue, continueToWorks = false) {
        if (rawValue === '') return;

        const value = Math.round(Number(rawValue));

        if (!isValidArea(value)) {
            areaError?.classList.add('show');
            return;
        }

        state.area = value;
        areaRange.value = value;
        areaInput.value = value;
        areaError?.classList.remove('show');

        if (continueToWorks) {
            setScreen('works');
        }
    }

    function updateWorkState() {
        state.works = workButtons
            .filter((button) => {
                return button.classList.contains('selected') && button.dataset.work !== 'Полный ремонт';
            })
            .map((button) => button.dataset.work);
    }

    function clearFullRepairSelection() {
        const fullRepairButton = builder.querySelector('.full-work');
        if (!fullRepairButton) return;

        fullRepairButton.classList.remove('selected');
        const icon = fullRepairButton.querySelector('i');
        if (icon) icon.textContent = '+';
    }

    function renderSummary() {
        const summary = builder.querySelector('#projectSummary');
        if (!summary) return;

        summary.innerHTML = '';

        const values = [
            state.room,
            `${state.area} м²`,
            ...(state.works.length ? state.works : ['Работы пока не выбраны'])
        ];

        values.forEach((value, index) => {
            const pill = document.createElement('span');
            pill.className = `summary-pill${index < 2 ? ' strong' : ''}`;
            pill.textContent = value;
            summary.appendChild(pill);
        });
    }

    // Выбор типа помещения.
    roomButtons.forEach((button) => {
        button.addEventListener('click', () => {
            roomButtons.forEach((item) => item.classList.remove('selected'));
            button.classList.add('selected');
            state.room = button.dataset.room;
            setScreen('area');
        });
    });

    roomButtons
        .find((button) => button.dataset.room === state.room)
        ?.classList.add('selected');

    // Площадь: range + ручной ввод.
    areaRange?.addEventListener('input', () => {
        syncArea(areaRange.value);
    });

    areaInput?.addEventListener('input', () => {
        areaInput.value = areaInput.value.replace(/[^0-9]/g, '').slice(0, 3);
        areaError?.classList.remove('show');
    });

    areaInput?.addEventListener('blur', () => {
        syncArea(areaInput.value);
    });

    areaInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            syncArea(areaInput.value, true);
        }
    });

    // Кнопки «далее» / «назад».
    builder.querySelectorAll('[data-next]').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.next === 'works' && !isValidArea(areaInput.value)) {
                areaError?.classList.add('show');
                areaInput?.focus();
                return;
            }

            setScreen(button.dataset.next);
        });
    });

    builder.querySelectorAll('[data-back]').forEach((button) => {
        button.addEventListener('click', () => setScreen(button.dataset.back));
    });

    // Выбор работ.
    workButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const workName = button.dataset.work;

            if (workName === 'Полный ремонт') {
                const shouldSelect = !button.classList.contains('selected');

                button.classList.toggle('selected', shouldSelect);

                workButtons
                    .filter((item) => item !== button)
                    .forEach((item) => {
                        item.classList.toggle('selected', shouldSelect);
                        const icon = item.querySelector('i');
                        if (icon) icon.textContent = shouldSelect ? '✓' : '+';
                    });

                state.works = shouldSelect ? [...coreWorkNames] : [];
                return;
            }

            button.classList.toggle('selected');

            const icon = button.querySelector('i');
            if (icon) {
                icon.textContent = button.classList.contains('selected') ? '✓' : '+';
            }

            updateWorkState();
            clearFullRepairSelection();
        });
    });

    // Переход к форме контактов.
    builder.querySelector('.prepare-btn')?.addEventListener('click', () => {
        screens.forEach((screen) => screen.classList.remove('active'));
        formScreen?.classList.add('active');

        progressSteps.forEach((step) => {
            step.classList.toggle('active', step.dataset.progress === 'done');
        });
    });

    builder.querySelector('.form-back')?.addEventListener('click', () => {
        formScreen?.classList.remove('active');
        setScreen('done');
    });

    builder.querySelector('#projectForm')?.addEventListener('submit', (event) => {
        event.preventDefault();

        builder.querySelector('#builderSent')?.classList.add('show');

        const submitButton = event.currentTarget.querySelector('.builder-submit');
        if (submitButton) {
            submitButton.textContent = 'ПРОЕКТ ОТПРАВЛЕН ✓';
        }
    });

    // Прогресс можно использовать как навигацию назад.
    progressSteps.forEach((step) => {
        step.addEventListener('click', () => {
            const target = step.dataset.progress;

            if (target === 'room' || target === 'area' || target === 'works') {
                setScreen(target);
            }
        });
    });
}

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.08 }
);

document
    .querySelectorAll('section, .gitem, .why-list div, .service')
    .forEach((element) => {
        element.style.transition = 'opacity .7s ease, transform .7s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateY(18px)';
        revealObserver.observe(element);
    });

document.addEventListener('scroll', () => {
    document.querySelectorAll('.visible').forEach((element) => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });
});
