"use strict";

(function () {

    const successHandler = (pictureData) => {
        let photosInformation = pictureData;

        window.filtering(photosInformation);
        window.uploadForm();
        window.gallery.bigPicture();
    };

    const errorHandler = (errorMessage) => {
        let errorNode = document.createElement('div');
        errorNode.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red';
        errorNode.style.position = 'absolute';
        errorNode.style.left = 0;
        errorNode.style.right = 0;
        errorNode.style.fontSize = '20px';

        errorNode.textContent = errorMessage;
        document.body.insertAdjacentElement('afterbegin', errorNode);
    };

    window.backend.load(successHandler, errorHandler);

})();
