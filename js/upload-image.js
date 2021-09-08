"use strict";

(function () {
    const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

    let fileChooser = document.querySelector('.img-upload__input');
    let preview = document.querySelector('.img-upload__preview').querySelector('img');

    fileChooser.addEventListener('change', () => {
        let file = fileChooser.files[0];
        let fileName = file.name.toLowerCase();

        let matches = FILE_TYPES.some(it => {
            return fileName.endsWith(it);
        });

        if (matches) {
            let reader = new FileReader();

            reader.addEventListener('load', () => {
                preview.setAttribute('src', reader.result);
            });

            reader.readAsDataURL(file);
        }
    })
})();
