"use strict";

(function () {
    const loadURL = "https://23.javascript.pages.academy/kekstagram/data";
    const uploadURL = "https://23.javascript.pages.academy/kekstagram";

    const load = async (onLoad, onError) => {

        let response = await fetch(loadURL);

        if (response.ok) {
            let json = await response.json();
            onLoad(json);
        } else {
            onError(`Статус ответа: ${response.status} ${response.statusText}`)
        }
    };

    const upload = async (data, onLoad, onError) => {

        let response = await fetch(uploadURL, {
            method: 'POST',
            body: data
        });

        if (response.ok) {
            let json = await response.json();
            onLoad(json);
        } else {
            onError(`Статус ответа: ${response.status} ${response.statusText}`)
        }
    };

    window.backend = {
        load: load,
        upload: upload,
    };
})();
