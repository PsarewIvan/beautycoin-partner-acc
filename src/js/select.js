(() => {
    const DATE_PICKER = `
        <div class="datepicker-component js-datepicker-wrapper">
            <input class="datepicker-component__input js-datepicker" name="datepicker" type="text" />
        </div>
    `;

    const selectsWrapper = document.querySelectorAll(
        '.js-select-component-wrapper'
    );

    selectsWrapper.forEach((selectWrapper) => {
        const select = selectWrapper.querySelector('.js-select-component');
        const placeholder = select?.dataset.placeholder;
        const options = select?.querySelectorAll('option');
        const reset = selectWrapper?.querySelector('.js-select-reset');

        const dataOptions = Array.from(options).map(getSlimOption);

        function getSlimOption(option) {
            if (option.value === 'calendar') {
                return {
                    html: DATE_PICKER,
                    text: 's',
                    selected: option.dataset.selected === 'true',
                    value: option.value,
                };
            }

            return {
                text: option.innerHTML,
                value: option.value,
                selected: option.dataset.selected === 'true',
            };
        }

        const searchPlaceholder = selectWrapper.dataset.placeholder;
        const searchText = selectWrapper.dataset.searchText;

        const slimSelect = new SlimSelect({
            select,
            settings: {
                showSearch: Boolean(searchPlaceholder),
                searchPlaceholder,
                searchText,
            },
            data: [
                ...(placeholder
                    ? [{ placeholder: true, text: placeholder }]
                    : []),
                ...dataOptions,
            ],
            events: {
                beforeChange: (newVal, oldVal) => {
                    const value = newVal?.[0]?.value;

                    if (value.includes('calendar')) {
                        return false;
                    }
                },
                afterChange: (evt, q) => {
                    const value = evt?.[0]?.value;

                    console.log(evt, q);

                    if (value === 'calendar') {
                        // showCalendar();
                    }

                    const arrow = selectWrapper?.querySelector('.ss-arrow');

                    if (value) {
                        reset?.classList.remove('hidden');
                        arrow?.classList.add('hidden');
                    }
                },
            },
        });

        const selectedOption = dataOptions.find(
            (opt) => opt.selected && opt.value
        );

        if (selectedOption) {
            const selectDiv = selectWrapper.querySelector(
                `div[data-id="${slimSelect?.settings?.id}"]`
            );

            const arrow = selectWrapper?.querySelector('.ss-arrow');
            selectDiv?.classList.add('select-component_selected');
            reset?.classList.remove('hidden');
            arrow?.classList.add('hidden');
        }

        reset?.addEventListener('click', () => {
            if (slimSelect) {
                const arrow = selectWrapper?.querySelector('.ss-arrow');

                slimSelect.setSelected('', false);
                reset.classList.add('hidden');
                arrow.classList.remove('hidden');
            }
        });

        const selectDiv = selectWrapper.querySelector(
            `div[data-id="${slimSelect?.settings?.id}"]`
        );

        select?.addEventListener('change', (event) => {
            if (dataOptions.some(({ value }) => value === event.target.value)) {
                selectDiv.classList.add('select-component_selected');
            } else {
                selectDiv.classList.remove('select-component_selected');
            }
        });

        if (!placeholder) {
            const arrow = selectWrapper?.querySelector('.ss-arrow');
            selectDiv?.classList.add('select-component_selected');
            reset?.classList.remove('hidden');
            arrow?.classList.add('hidden');
        }
    });

    // --------

    // const dateInputWrapper = document.querySelector('.js-datepicker-wrapper');
    // // const calendar = dateInputWrapper?.querySelector(
    // //     '.js-datepicker-calendar-icon'
    // // );
    // // const reset = dateInputWrapper?.querySelector('.js-datepicker-reset');
    // const dateInput = dateInputWrapper?.querySelector('.js-datepicker');

    // let datepicker = initDatepicker();

    // // initCalendar();

    // // window.addEventListener('resize', initCalendar);

    // function initCalendar() {
    //     if (!dateInput) return;

    //     // if (isMobile()) {
    //     //     datepicker.destroy();
    //     //     dateInput.type = 'date';
    //     // } else {
    //     if (datepicker) {
    //         datepicker.destroy();
    //     }

    //     dateInput.type = 'text';
    //     datepicker = initDatepicker();
    //     // }
    // }

    // function initDatepicker() {
    //     if (typeof Datepicker !== 'function') {
    //         return;
    //     }

    //     console.log('[dateInput]', dateInput);

    //     dateInput?.addEventListener('changeDate', handleDateChange);
    //     // reset?.addEventListener('click', handleResetClick);

    //     return dateInput
    //         ? new Datepicker(dateInput, {
    //               language: 'ru',
    //               autohide: true,
    //               maxView: 2,
    //               todayHighlight: true,
    //               prevArrow: getChevronIcon(),
    //               nextArrow: getChevronIcon(),
    //           })
    //         : null;
    // }

    // function handleDateChange(event) {
    //     if (!event.target.value || event.target.value === '') {
    //         // calendar?.classList.remove('hidden');
    //         // reset?.classList.add('hidden');
    //         dateInputWrapper?.classList.remove('datepicker-component_selected');
    //     } else {
    //         // calendar?.classList.add('hidden');
    //         // reset?.classList.remove('hidden');
    //         dateInputWrapper?.classList.add('datepicker-component_selected');
    //     }
    // }

    // function handleResetClick() {
    //     datepicker?.setDate({ clear: true });
    //     // calendar?.classList.remove('hidden');
    //     // reset?.classList.add('hidden');
    //     dateInputWrapper?.classList.remove('datepicker-component_selected');
    // }

    // // function isMobile() {
    // //     return window.innerWidth <= MOBILE_WIDTH;
    // // }

    // function getChevronIcon() {
    //     return `
    //         <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    //             <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5303 3.96967C15.8232 4.26256 15.8232 4.73744 15.5303 5.03033L8.56066 12L15.5303 18.9697C15.8232 19.2626 15.8232 19.7374 15.5303 20.0303C15.2374 20.3232 14.7626 20.3232 14.4697 20.0303L6.96967 12.5303C6.67678 12.2374 6.67678 11.7626 6.96967 11.4697L14.4697 3.96967C14.7626 3.67678 15.2374 3.67678 15.5303 3.96967Z" fill="#5C5C5C"/>
    //         </svg>`;
    // }
})();
