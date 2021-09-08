"use strict";

(function () {
    const filterButtons = document.querySelectorAll(".img-filters__button");
    const pictureTemplate = document.querySelector("#picture").content.querySelector(".picture");

    const clearActiveFilterButton = () => {
        filterButtons.forEach(filterButton => filterButton.classList.remove('img-filters__button--active'));
    };

    const removePicturesFromPage = () => {
        const pictureBlocks = document.querySelectorAll(".picture");

        pictureBlocks.forEach(picture => picture.remove());
    };

    const initGallery = () => {
        let currentPhotos = window.allPhotos;

        const renderPicture = (pictureInfo) => {
            const picture = pictureTemplate.cloneNode(true);

            picture.querySelector(".picture__img").src = pictureInfo.url;
            picture.querySelector(".picture__likes").textContent = pictureInfo.likes;
            picture.querySelector(".picture__comments").textContent = pictureInfo.comments.length;

            picture.dataset.number = pictureInfo.id;

            return picture;
        };

        const showFilteredPhotos = () => {
            removePicturesFromPage();

            const picturesContainer = document.querySelector(".pictures");
            const pictureFragment = document.createDocumentFragment();

            currentPhotos.forEach(photo => pictureFragment.append(renderPicture(photo)));

            picturesContainer.append(pictureFragment);

            window.bigPicture();
        };

        const onFilterButtonClick = (evt) => {
            currentPhotos = window.filtratePhotos(evt.currentTarget.id);

            clearActiveFilterButton();
            window.utils.debounce(showFilteredPhotos);
            evt.currentTarget.classList.add("img-filters__button--active");
        };

        showFilteredPhotos();
        filterButtons.forEach(button => button.addEventListener("click", onFilterButtonClick));
    };

    window.gallery = initGallery;
})()