(() => {
    const buttons = document.querySelectorAll('.js-cvv-button');

    buttons.forEach((button) => {
        const dataId = button.dataset.cvvId;
        const dot = document.querySelector(`.${dataId}-dot`);
        const number = document.querySelector(`.${dataId}-number`);
        const iconClosed = button.querySelector('.js-cvv-icon-closed');
        const iconOpen = button.querySelector('.js-cvv-icon-open');
        const tooltipOpen = button.querySelector('.js-cvv-tooltip-open');
        const tooltipClosed = button.querySelector('.js-cvv-tooltip-closed');

        button.addEventListener('click', () => {
            dot?.classList.toggle('hidden');
            number?.classList.toggle('hidden');
            iconClosed?.classList.toggle('hidden');
            iconOpen?.classList.toggle('hidden');
            tooltipOpen?.classList.toggle('hidden');
            tooltipClosed?.classList.toggle('hidden');
        });
    });
})();
