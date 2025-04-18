(() => {
    const NAV_ICON = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15.5307 18.9694C15.6004 19.0391 15.6557 19.1218 15.6934 19.2129C15.7311 19.3039 15.7505 19.4015 15.7505 19.5001C15.7505 19.5986 15.7311 19.6962 15.6934 19.7872C15.6557 19.8783 15.6004 19.961 15.5307 20.0307C15.461 20.1004 15.3783 20.1556 15.2873 20.1933C15.1962 20.2311 15.0986 20.2505 15.0001 20.2505C14.9016 20.2505 14.804 20.2311 14.7129 20.1933C14.6219 20.1556 14.5392 20.1004 14.4695 20.0307L6.96948 12.5307C6.89974 12.461 6.84443 12.3783 6.80668 12.2873C6.76894 12.1962 6.74951 12.0986 6.74951 12.0001C6.74951 11.9015 6.76894 11.8039 6.80668 11.7128C6.84443 11.6218 6.89974 11.5391 6.96948 11.4694L14.4695 3.96943C14.6102 3.8287 14.8011 3.74963 15.0001 3.74963C15.1991 3.74963 15.39 3.8287 15.5307 3.96943C15.6715 4.11016 15.7505 4.30103 15.7505 4.50005C15.7505 4.69907 15.6715 4.88995 15.5307 5.03068L8.56041 12.0001L15.5307 18.9694Z" fill="currentColor"/>
        </svg>`;
    const CLOSE_ICON = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.281 18.2194C19.3507 18.289 19.406 18.3718 19.4437 18.4628C19.4814 18.5539 19.5008 18.6514 19.5008 18.75C19.5008 18.8485 19.4814 18.9461 19.4437 19.0372C19.406 19.1282 19.3507 19.2109 19.281 19.2806C19.2114 19.3503 19.1286 19.4056 19.0376 19.4433C18.9465 19.481 18.849 19.5004 18.7504 19.5004C18.6519 19.5004 18.5543 19.481 18.4632 19.4433C18.3722 19.4056 18.2895 19.3503 18.2198 19.2806L12.0004 13.0603L5.78104 19.2806C5.64031 19.4213 5.44944 19.5004 5.25042 19.5004C5.05139 19.5004 4.86052 19.4213 4.71979 19.2806C4.57906 19.1399 4.5 18.949 4.5 18.75C4.5 18.551 4.57906 18.3601 4.71979 18.2194L10.9401 12L4.71979 5.78061C4.57906 5.63988 4.5 5.44901 4.5 5.24999C4.5 5.05097 4.57906 4.8601 4.71979 4.71936C4.86052 4.57863 5.05139 4.49957 5.25042 4.49957C5.44944 4.49957 5.64031 4.57863 5.78104 4.71936L12.0004 10.9397L18.2198 4.71936C18.3605 4.57863 18.5514 4.49957 18.7504 4.49957C18.9494 4.49957 19.1403 4.57863 19.281 4.71936C19.4218 4.8601 19.5008 5.05097 19.5008 5.24999C19.5008 5.44901 19.4218 5.63988 19.281 5.78061L13.0607 12L19.281 18.2194Z" fill="currentColor"/>
    </svg>`;

    document.querySelectorAll('.js-datepicker').forEach((input) => {
        const picker = new Litepicker({
            element: input,
            singleMode: false,
            format: 'DD.MM.YYYY',
            lang: 'ru-RU',
            numberOfMonths: 2,
            numberOfColumns: 2,
            autoApply: false,
            showTooltip: false,
            showAdjacentMonths: true,
            maxDate: new Date(),
            tooltipText: {
                one: 'день',
                other: 'дней',
            },
            buttonText: {
                apply: 'Выбрать',
            },
            setup: (picker) => {
                picker.on('show', () => {
                    if (window.innerWidth < 768) {
                        document.body.classList.add('body-lock');
                    }

                    insertPresets(picker);
                    replaceNavArrows(picker);
                });
                picker.on('render', () => {
                    insertPresets(picker);
                    replaceNavArrows(picker);
                });
                picker.on('hide', () => {
                    document.body.classList.remove('body-lock');
                });
            },
        });
    });

    function replaceNavArrows(picker) {
        const prevBtns = picker.ui.querySelectorAll('.button-previous-month');
        const nextBtns = picker.ui.querySelectorAll('.button-next-month');

        prevBtns.forEach((prevBtn) => {
            if (!prevBtn.dataset.svgReplaced) {
                prevBtn.innerHTML = NAV_ICON;
                prevBtn.dataset.svgReplaced = 'true';
            }
        });

        nextBtns.forEach((nextBtn) => {
            if (!nextBtn.dataset.svgReplaced) {
                nextBtn.style.transform = 'rotate(180deg)';
                nextBtn.innerHTML = NAV_ICON;
                nextBtn.dataset.svgReplaced = 'true';
            }
        });
    }

    function insertPresets(picker) {
        const { ui } = picker;

        if (ui.querySelector('.custom-datepicker__wrapper')) return;

        const main = ui.querySelector('.container__main');
        const footer = ui.querySelector('.container__footer');
        const presetList = document.querySelector('.js-datepicker-preset-list');

        if (!main || !footer || !presetList) return;

        const wrapper = document.createElement('div');
        wrapper.classList.add('custom-datepicker__wrapper');

        const calendarContent = document.createElement('div');
        calendarContent.classList.add('custom-datepicker__calendar');

        const headerContent = document.createElement('div');
        headerContent.classList.add('custom-datepicker__header');

        const headerText = document.createElement('div');
        headerText.classList.add('custom-datepicker__header-text');
        headerText.innerHTML = 'Период';

        const closeButton = document.createElement('button');
        closeButton.classList.add('custom-datepicker__header-button');
        closeButton.setAttribute('type', 'button');
        closeButton.innerHTML = CLOSE_ICON;

        headerContent.appendChild(headerText);
        headerContent.appendChild(closeButton);

        const presetClone = presetList.cloneNode(true);

        calendarContent.appendChild(main);
        calendarContent.appendChild(footer);
        wrapper.appendChild(headerContent);
        wrapper.appendChild(presetClone);
        wrapper.appendChild(calendarContent);

        ui.innerHTML = '';
        ui.appendChild(wrapper);

        presetClone.querySelectorAll('div[data-range]').forEach((el) => {
            el.addEventListener('click', () => {
                const type = el.getAttribute('data-range');
                setPresetRange(type, picker);
            });
        });

        closeButton.addEventListener('click', () => {
            picker.hide();
        });
    }

    function setPresetRange(type, picker) {
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
