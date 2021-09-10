"use strict";

(function () {

    const errorTemplate = document.querySelector('#error').content.querySelector('.error');

    const onErrorHandlerTryAgainButtonClick = () => {
        document.location.reload();
    }

    const setErrorButtonEventListener = () => {
        const errorButtons = document.querySelectorAll('.error__button');

        errorButtons[0].addEventListener('click', onErrorHandlerTryAgainButtonClick);
        errorButtons[1].classList.add('hidden');
    }

    //handlers
    const successHandler = (pictureData) => {
        window.allPhotos = pictureData;

        window.filtration();
        window.uploadForm();

        window.initGalleryListeners();
    };

    const errorHandler = (errorMessage) => {
        const errorNode = errorTemplate.cloneNode(true);
        errorNode.querySelector('.error__title').textContent = errorMessage;
        document.querySelector('main').insertAdjacentElement('afterbegin', errorNode);

        setErrorButtonEventListener()
    };

    window.backend.load(successHandler, errorHandler);

})();
