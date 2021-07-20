"use strict";

(function () {
    const ESC_KEY_NAME = "Escape";
    const ENTER_KEY_NAME = "Enter";

    window.utils = {
        isEscKey: function (evt) {
            return evt.key === ESC_KEY_NAME;
        },
        isEnterKey: function (evt) {
            return evt.key === ENTER_KEY_NAME;
        }
    };
})();