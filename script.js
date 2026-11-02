// ============================================================
// ВАШ ПРОЕКТ — интерактивы одностраничного сайта
// ============================================================

// ---------- Mobile menu ----------
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');

burger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
});

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
            }
        });
    },
    { threshold: 0.12 }
);

document
    .querySelectorAll('section, .service-row, .wall-grid > *')
    .forEach((element) => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });

// ---------- Services hover preview ----------
document.querySelectorAll('.service-row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
        const target = document.querySelector('.service-orbit-inner strong');
        if (!target) return;

        target.innerHTML = (row.dataset.label || 'ВАШ ПРОЕКТ').replace(' ', '<br>');
    });
});

// ---------- Calculator: room type ----------
document.querySelectorAll('.choice-grid button').forEach((button) => {
    button.addEventListener('click', () => {
        document
            .querySelectorAll(`[data-group="${button.dataset.group}"]`)
            .forEach((item) => item.classList.remove('active'));

        button.classList.add('active');
        updateCalculatorSummary();
    });
});

const area = document.querySelector('#area');
const areaOutput = document.querySelector('#areaOut');
const summary = document.querySelector('#summary');

function updateCalculatorSummary() {
    const activeType = document.querySelector('.choice-grid button.active');
    const type = activeType?.textContent.trim().toLowerCase() || 'квартира';

    const selectedWorks = [
        ...document.querySelectorAll('.check-grid input:checked')
    ].map((input) => input.parentElement.textContent.trim());

    if (areaOutput && area) {
        areaOutput.textContent = `${area.value} м²`;
    }

    if (summary && area) {
        summary.textContent = `${area.value} м² · ${type} · ${
            selectedWorks.length
                ? `${selectedWorks.length} вида работ`
                : 'работы не выбраны'
        }`;
    }
}

area?.addEventListener('input', updateCalculatorSummary);

document.querySelectorAll('.check-grid input').forEach((input) => {
    input.addEventListener('change', updateCalculatorSummary);
});

updateCalculatorSummary();

// ---------- Calculator submit ----------
document.querySelector('#calcForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector('#success')?.classList.add('show');
});

// ---------- Before / after slider ----------
const compareFrame = document.querySelector('#baFrame');
const compareSlider = compareFrame?.querySelector('input');
const compareBefore = compareFrame?.querySelector('.compare-before');
const compareLine = compareFrame?.querySelector('.compare-line');

function moveCompare(value) {
    if (!compareBefore || !compareLine) return;

    compareBefore.style.width = `${value}%`;
    compareLine.style.left = `${value}%`;
}

compareSlider?.addEventListener('input', (event) => {
    moveCompare(event.target.value);
});

// ---------- Scroll position for optional CSS effects ----------
window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll', window.scrollY);
});
