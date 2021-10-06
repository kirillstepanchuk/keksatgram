"use strict";

(function () {
    const pictureTemplate = document.querySelector("#picture").content.querySelector(".picture");

    const removePicturesFromPage = () => {
        const pictureBlocks = document.querySelectorAll(".picture");

        pictureBlocks.forEach(picture => picture.remove());
    };

    const showPhotos = (photoList) => {
        removePicturesFromPage();

        const picturesContainer = document.querySelector(".pictures");
        const pictureFragment = document.createDocumentFragment();

        photoList.forEach(photo => pictureFragment.append(renderPicture(photo)));

        picturesContainer.append(pictureFragment);

        initGalleryListeners();
    };

    const renderPicture = (pictureInfo) => {
        const picture = pictureTemplate.cloneNode(true);

        picture.querySelector(".picture__img").src = pictureInfo.url;
        picture.querySelector(".picture__likes").textContent = pictureInfo.likes;
        picture.querySelector(".picture__comments").textContent = pictureInfo.comments.length;

        picture.dataset.number = pictureInfo.id;

        return picture;
    };

    const onPictureBlockClick = (evt) => {
        window.showBigPicture(window.allPhotos[evt.currentTarget.dataset.number]);
    };

    const initGalleryListeners = () => {
        document.querySelectorAll(".picture").forEach(element => element.addEventListener("click", onPictureBlockClick));
    };

    window.showPhotos = showPhotos;
})();
