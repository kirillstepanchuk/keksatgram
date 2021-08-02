"use strict";

(function () {
    const loadURL = "https://23.javascript.pages.academy/kekstagram/data";
    const uploadURL = "https://23.javascript.pages.academy/kekstagram";

    const load = async (onLoad, onError) => {
        // fetch(loadURL)
        //     .then(response => {
        //         if (!response.ok) {
        //             return Promise.reject(new Error(`${response.status} ${response.statusText}`))
        //         }
        //         return Promise.resolve(response)
        //     })
        //     .then(response => {
        //         onLoad(response.json())
        //     })
        //     .catch((error) => {
        //         onError(error)
        //     })
        let response = await fetch(loadURL);

        if (response.ok) {
            let json = await response.json();
            console.log('json: ', json);
            onLoad(json);
        } else {
            onError(`Статус ответа: ${response.status} ${response.statusText}`)
        }
    };

    const upload = async (data, onLoad, onError) => {
        // await fetch(uploadURL, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             return Promise.reject(new Error(`${response.status} ${response.statusText}`))
        //         }
        //         return Promise.resolve(response)
        //     })
        //     .then(response => {
        //         onLoad(await(response.json()))
        //     })
        //     .catch((error) => {
        //         onError(error)
        //     })
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
