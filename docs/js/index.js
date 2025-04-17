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
