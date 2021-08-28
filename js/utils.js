"use strict";

(function () {
    const DEBOUNCE_INTERVAL = 500;

    const KEYS = {
        ESC: "Escape",
        ENTER: "Enter",
    }

    let lastTimeout = null;

    window.utils = {
        isEscKey: (evt, action) => {
            if (evt.key === KEYS.ESC) {
                action();
            }
        },
        isEnterKey: (evt, action) => {
            if (evt.key === KEYS.ENTER) {
                action();
            }
        },
        debounce: (action) => {
            if (lastTimeout) {
                clearTimeout(lastTimeout);
            }
            lastTimeout = setTimeout(action, DEBOUNCE_INTERVAL);
        },
        getRandomInteger: (min, max) => {
            return Math.floor(min + Math.random() * (max + 1 - min))
        },
        getRandomUnitFromList: (list) => {
            return list[window.utils.getRandomInteger(0, list.length - 1)]
        },
        removeElementsFromList: (list) => {
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
        },
        removePicturesFromPage: () => {
            const pictureBlocks = document.querySelectorAll(".picture");

            pictureBlocks.forEach(picture => picture.remove());
        },
        clearActiveFilterButton: () => {
            document.querySelectorAll(".img-filters__button").forEach(filterButton => filterButton.classList.remove('img-filters__button--active'));
        }
    };
})();
