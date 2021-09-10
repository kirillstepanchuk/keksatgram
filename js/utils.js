"use strict";

(function () {
    const DEBOUNCE_INTERVAL = 500;

    const Key = {
        ESC: "Escape",
        ENTER: "Enter",
    }

    let lastTimeout = null;

    const isEscKey = (evt, action) => {
        if (evt.key === Key.ESC) {
            evt.preventDefault();
            action();
        };
    };

    const isEnterKey = (evt, action) => {
        if (evt.key === Key.ENTER) {
            action();
        }
    };

    const debounce = (action) => {
        if (lastTimeout) {
            clearTimeout(lastTimeout);
        }
        lastTimeout = setTimeout(action, DEBOUNCE_INTERVAL);
    };

    const getRandomInteger = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomUnitFromList = (list) => {
        return list[getRandomInteger(0, list.length - 1)];
    };

    const removeElementsFromList = (list) => {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    };

    window.utils = {
        isEscKey: isEscKey,
        isEnterKey: isEnterKey,
        debounce: debounce,
        getRandomInteger: getRandomInteger,
        getRandomUnitFromList: getRandomUnitFromList,
        removeElementsFromList: removeElementsFromList,
    };

})();
