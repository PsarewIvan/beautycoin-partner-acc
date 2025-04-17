(() => {
    const input = document.querySelector('.js-datepicker');

    if (!input) return;

    const insertPresets = (picker) => {
        const existing = picker.ui.querySelector('.js-datepicker-preset-list');

        if (existing) existing.remove();

        const template = document.querySelector('.js-datepicker-preset-list');

        if (!template) return;

        const clone = template.cloneNode(true);
        const container = picker.ui.querySelector('.container__main');

        if (container) {
            container.style.display = 'flex';
            container.insertBefore(clone, container.firstChild);
        }

        clone.querySelectorAll('div[data-range]').forEach((el) => {
            el.addEventListener('click', () => {
                const type = el.getAttribute('data-range');
                setPresetRange(type);
            });
        });
    };

    const picker = new Litepicker({
        element: input,
        singleMode: false,
        format: 'DD.MM.YYYY',
        lang: 'ru-RU',
        numberOfMonths: 2,
        numberOfColumns: 2,
        autoApply: false,
        showTooltip: false,
        tooltipText: {
            one: 'день',
            other: 'дней',
        },
        setup: (picker) => {
            picker.on('show', () => {
                insertPresets(picker);
            });
            picker.on('render', () => {
                insertPresets(picker);
            });
        },
    });

    function setPresetRange(type) {
        const now = dayjs();
        let start, end;

        if (type === '7') {
            start = now.subtract(6, 'day');
            end = now;
        } else if (type === '30') {
            start = now.subtract(29, 'day');
            end = now;
        } else if (type === 'this-month') {
            start = now.startOf('month');
            end = now.endOf('month');
        } else if (type === 'last-month') {
            start = now.subtract(1, 'month').startOf('month');
            end = now.subtract(1, 'month').endOf('month');
        }

        picker.setDateRange(
            start.format('YYYY-MM-DD'),
            end.format('YYYY-MM-DD')
        );
        picker.hide();
    }
})();
