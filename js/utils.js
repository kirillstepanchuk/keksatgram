"use strict";

(function () {
    const ESC_KEY_NAME = "Escape";
    const ENTER_KEY_NAME = "Enter";

    const KEYS = {
        ESC: "Escape",
        ENTER: "Enter",
    }

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
        }
    };
})();
