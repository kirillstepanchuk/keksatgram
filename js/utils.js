"use strict";

(function () {
    const DEBOUNCE_INTERVAL = 500;

    const Key = {
        ESC: "Escape",
        ENTER: "Enter",
    }

    let lastTimeout = null;

    const isEscKey = (evt, action) => {
        evt.preventDefault();
        if (evt.key === Key.ESC) {
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
        return Math.floor(min + Math.random() * (max + 1 - min));
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
