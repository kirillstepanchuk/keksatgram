"use strict";

(function () {
    const onPictureBlockClick = (evt) => {
        window.showBigPicture(window.allPhotos[evt.currentTarget.dataset.number]);
    };

    const initGalleryListeners = () => {
        document.querySelectorAll(".picture").forEach(element => element.addEventListener("click", onPictureBlockClick));
    };

    window.initGalleryListeners = initGalleryListeners;

})()