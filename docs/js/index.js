(() => {
    const NAV_ICON = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15.5307 18.9694C15.6004 19.0391 15.6557 19.1218 15.6934 19.2129C15.7311 19.3039 15.7505 19.4015 15.7505 19.5001C15.7505 19.5986 15.7311 19.6962 15.6934 19.7872C15.6557 19.8783 15.6004 19.961 15.5307 20.0307C15.461 20.1004 15.3783 20.1556 15.2873 20.1933C15.1962 20.2311 15.0986 20.2505 15.0001 20.2505C14.9016 20.2505 14.804 20.2311 14.7129 20.1933C14.6219 20.1556 14.5392 20.1004 14.4695 20.0307L6.96948 12.5307C6.89974 12.461 6.84443 12.3783 6.80668 12.2873C6.76894 12.1962 6.74951 12.0986 6.74951 12.0001C6.74951 11.9015 6.76894 11.8039 6.80668 11.7128C6.84443 11.6218 6.89974 11.5391 6.96948 11.4694L14.4695 3.96943C14.6102 3.8287 14.8011 3.74963 15.0001 3.74963C15.1991 3.74963 15.39 3.8287 15.5307 3.96943C15.6715 4.11016 15.7505 4.30103 15.7505 4.50005C15.7505 4.69907 15.6715 4.88995 15.5307 5.03068L8.56041 12.0001L15.5307 18.9694Z" fill="currentColor"/>
        </svg>`;
    const CLOSE_ICON = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.281 18.2194C19.3507 18.289 19.406 18.3718 19.4437 18.4628C19.4814 18.5539 19.5008 18.6514 19.5008 18.75C19.5008 18.8485 19.4814 18.9461 19.4437 19.0372C19.406 19.1282 19.3507 19.2109 19.281 19.2806C19.2114 19.3503 19.1286 19.4056 19.0376 19.4433C18.9465 19.481 18.849 19.5004 18.7504 19.5004C18.6519 19.5004 18.5543 19.481 18.4632 19.4433C18.3722 19.4056 18.2895 19.3503 18.2198 19.2806L12.0004 13.0603L5.78104 19.2806C5.64031 19.4213 5.44944 19.5004 5.25042 19.5004C5.05139 19.5004 4.86052 19.4213 4.71979 19.2806C4.57906 19.1399 4.5 18.949 4.5 18.75C4.5 18.551 4.57906 18.3601 4.71979 18.2194L10.9401 12L4.71979 5.78061C4.57906 5.63988 4.5 5.44901 4.5 5.24999C4.5 5.05097 4.57906 4.8601 4.71979 4.71936C4.86052 4.57863 5.05139 4.49957 5.25042 4.49957C5.44944 4.49957 5.64031 4.57863 5.78104 4.71936L12.0004 10.9397L18.2198 4.71936C18.3605 4.57863 18.5514 4.49957 18.7504 4.49957C18.9494 4.49957 19.1403 4.57863 19.281 4.71936C19.4218 4.8601 19.5008 5.05097 19.5008 5.24999C19.5008 5.44901 19.4218 5.63988 19.281 5.78061L13.0607 12L19.281 18.2194Z" fill="currentColor"/>
    </svg>`;

    function dispatchCalendarChange(input, event) {
        const calendarChangeEvent = new CustomEvent('calendar-change', {
            detail: {
                originalEvent: event,
                inputName: input.name || input.getAttribute('name') || null,
            },
        });

        input.dispatchEvent(calendarChangeEvent);
    }

    document.querySelectorAll('.js-datepicker').forEach((input) => {
        let pickedStart = null;
        let pickedEnd = null;

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
                const enableApplyButtonManually = () => {
                    const applyBtn = document.querySelector('.button-apply');

                    if (applyBtn) {
                        applyBtn.disabled = false;
                    }
                };

                picker.on('render', () => {
                    insertPresets(picker, input);
                    replaceNavArrows(picker);
                    updatePreviewAndButton(picker);
                    enableApplyButtonManually();
                });
                picker.on('show', () => {
                    if (window.innerWidth < 768) {
                        document.body.classList.add('body-lock');
                    }

                    insertPresets(picker, input);
                    replaceNavArrows(picker);
                    updatePreviewAndButton(picker);
                });
                picker.on('hide', () => {
                    document.body.classList.remove('body-lock');
                });
                picker.on('selected', (start, end) => {
                    updatePreviewAndButton(picker);
                });
                picker.on('preselect', (date1, date2) => {
                    pickedStart = date1 ? new Date(date1.dateInstance) : null;
                    pickedEnd = date2 ? new Date(date2.dateInstance) : null;
                });

                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('button-apply')) {
                        if (pickedStart && !pickedEnd) {
                            picker.setDateRange(pickedStart, pickedStart);

                            dispatchCalendarChange(input, {
                                start: pickedStart,
                                end: pickedStart,
                            });
                        } else if (pickedStart && pickedEnd) {
                            picker.setDateRange(pickedStart, pickedEnd);

                            dispatchCalendarChange(input, {
                                start: pickedStart,
                                end: pickedEnd,
                            });
                        }
                        picker.hide();
                    }
                });
            },
        });
    });

    function getPickedDates(picker) {
        const dates = picker.datePicked || [];
        const start = dates[0] ? new Date(dates[0].dateInstance) : null;
        const end = dates[1] ? new Date(dates[1].dateInstance) : null;

        return { start, end };
    }

    function formatDate(date) {
        const d = new Date(date);

        if (isNaN(d.getTime())) return '...';

        return d.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    function updatePreviewAndButton(picker) {
        const { start, end } = getPickedDates(picker);

        const preview = document.querySelector('.preview-date-range');
        const applyBtn = document.querySelector('.button-apply');

        if (!start && !end) {
            preview.textContent = 'Выберите начало и конец периода';
            applyBtn.disabled = true;
        } else if (start && !end) {
            preview.textContent = `с ${formatDate(start)} по ...`;
            applyBtn.disabled = false;
        } else {
            preview.textContent = `с ${formatDate(start)} по ${formatDate(
                end
            )}`;
            applyBtn.disabled = false;
        }
    }

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

    function insertPresets(picker, input) {
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
                const { start, end } = setPresetRange(type, picker);

                dispatchCalendarChange(input, {
                    start: start.toDate(),
                    end: end.toDate(),
                });
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

        return { start, end };
    }
})();

(() => {
    const ACTIVE_CLASS = 'active';
    const nodes = document.querySelectorAll('.js-input-node');

    nodes.forEach((node) => {
        const input = node.querySelector('.js-input');
        const show = node.querySelector('.js-input-show');
        const openIcon = node.querySelector('.js-input-icon-open');
        const closedIcon = node.querySelector('.js-input-icon-closed');
        const alert = node.querySelector('.js-input-alert');
        const reset = node.querySelector('.js-input-reset');

        show?.addEventListener('click', () => {
            const type = input?.getAttribute('type');

            if (type === 'password') {
                input.setAttribute('type', 'text');
                openIcon?.classList.remove('hidden');
                closedIcon?.classList.add('hidden');
            } else {
                input.setAttribute('type', 'password');
                openIcon?.classList.add('hidden');
                closedIcon?.classList.remove('hidden');
            }
        });

        input?.addEventListener('blur', (event) => {
            if (event.target.value === '') {
                alert?.classList.add(ACTIVE_CLASS);
            } else {
                alert?.classList.remove(ACTIVE_CLASS);
            }
        });

        input?.addEventListener('input', (event) => {
            if (event.target.value === '') {
                reset?.classList.remove(ACTIVE_CLASS);

                if (reset && show) {
                    show.classList.remove('shift');
                }
            } else {
                reset?.classList.add(ACTIVE_CLASS);
                alert?.classList.remove(ACTIVE_CLASS);

                if (reset && show) {
                    show.classList.add('shift');
                }
            }
        });

        reset?.addEventListener('click', () => {
            if (input) {
                input.value = '';
                reset?.classList.remove(ACTIVE_CLASS);
            }

            if (reset && show) {
                show.classList.remove('shift');
            }
        });
    });
})();

(() => {
    const supportButtons = document.querySelectorAll('.js-support-button');

    const popupSupport = document.querySelector('.js-popup-support');
    const popupSuccess = document.querySelector('.js-popup-success');

    const closePopupButtons = document.querySelectorAll('.js-close-popup');
    const successButtons = document.querySelectorAll(
        '.js-success-popup-button'
    );

    closePopupButtons.forEach((button) => {
        button?.addEventListener('click', closeAllPopup);
    });

    supportButtons.forEach((button) => {
        button?.addEventListener('click', () => {
            closeAllPopup();
            openPopup(popupSupport)();
        });
    });

    successButtons.forEach((button) => {
        button?.addEventListener('click', () => {
            closeAllPopup();
            openPopup(popupSuccess)();
        });
    });

    popupSupport?.addEventListener('click', overlayClose(popupSupport));
    popupSuccess?.addEventListener('click', overlayClose(popupSuccess));

    function closeAllPopup() {
        closePopup(popupSupport)();
        closePopup(popupSuccess)();
    }

    function overlayClose(element) {
        return (evt) => {
            if (evt.target === element) {
                closePopup(element)();
            }
        };
    }

    function openPopup(element) {
        return () => {
            element?.classList.remove('hidden');
            element?.focus();
            document.body.classList.add('body-lock');
            trapFocus(element);
        };
    }

    function closePopup(element) {
        return () => {
            element?.classList.add('hidden');
            document.body.classList.remove('body-lock');
        };
    }

    function trapFocus(element) {
        const focusableElements = element?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (element && focusableElements) {
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement =
                focusableElements[focusableElements.length - 1];

            element.addEventListener('keydown', function (e) {
                const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

                if (!isTabPressed) {
                    return;
                }

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            });
        }
    }
})();

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

(() => {
    const TOOLTIP_LEFT_CLASS = 'tooltip_left';
    const TOOLTIP_BOTTOM_CLASS = 'tooltip_bottom';

    document.addEventListener('DOMContentLoaded', function () {
        window.addEventListener('resize', initTooltip);
        initTooltip();
    });

    function initTooltip() {
        const triggers = document.querySelectorAll('.js-tooltip-trigger');

        triggers?.forEach((trigger) => {
            const tooltip = trigger.querySelector('.js-tooltip');

            if (tooltip) {
                adjustTooltipPosition(tooltip);
            }
        });
    }

    function adjustTooltipPosition(tooltip) {
        // tooltip.classList.remove(TOOLTIP_LEFT_CLASS);
        tooltip.classList.remove(TOOLTIP_BOTTOM_CLASS);

        const viewportWidth = window.innerWidth;
        const tooltipRect = tooltip.getBoundingClientRect();

        const tooltipRightPointX = tooltipRect.left + tooltipRect.width;
        const tooltipTopPointY = tooltipRect.top;

        if (tooltipRightPointX > viewportWidth) {
            // For right position
            // tooltip.classList.add(TOOLTIP_LEFT_CLASS);
        }

        if (tooltipTopPointY < 0) {
            tooltip.classList.add(TOOLTIP_BOTTOM_CLASS);
        }
    }
})();

//# sourceMappingURL=index.js.map
