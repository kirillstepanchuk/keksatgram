"use strict";

(function () {
    const NEW_PHOTOS_COUNT = 10;
    const SPLICE_LENGTH = 1;

    const FilterId = {
        POPULAR: "filter-popular",
        NEW: "filter-new",
        DISCUSSED: "filter-discussed",
    };

    const filterButtons = document.querySelectorAll(".img-filters__button");

    const clearActiveFilterButton = () => {
        filterButtons.forEach(filterButton => filterButton.classList.remove('img-filters__button--active'));
    };

    const removePicturesFromPage = () => {
        const pictureBlocks = document.querySelectorAll(".picture");

        pictureBlocks.forEach(picture => picture.remove());
    };

    const fillPopularPhotos = () => {
        const popularPhotos = window.allPhotos.slice();

        return popularPhotos;
    };

    const fillNewPhotos = () => {
        const photosCopy = window.allPhotos.slice();

        const newPhotos = [];

        while (newPhotos.length < NEW_PHOTOS_COUNT) {
            let randomIndex = window.utils.getRandomInteger(0, photosCopy.length - 1);

            newPhotos.push(photosCopy.splice(randomIndex, SPLICE_LENGTH)[0]);
        };

        return newPhotos;
    };

    const fillDiscussedPhotos = () => {
        const discussedPhotos = window.allPhotos.slice().sort((a, b) => b.comments.length - a.comments.length);

        return discussedPhotos;
    };

    document.querySelector(".img-filters").classList.remove("img-filters--inactive");

    const filtratePhotos = (filterId) => {
        switch (filterId) {
            case FilterId.POPULAR:
                return fillPopularPhotos();

            case FilterId.NEW:
                return fillNewPhotos();

            case FilterId.DISCUSSED:
                return fillDiscussedPhotos();
        };
    };

    const initFiltration = () => {
        let currentPhotos = window.allPhotos;

        const showFilteredPhotos = () => {
            removePicturesFromPage();

            const picturesContainer = document.querySelector(".pictures");
            const pictureFragment = document.createDocumentFragment();

            currentPhotos.forEach(photo => pictureFragment.append(window.renderPicture(photo)));

            picturesContainer.append(pictureFragment);

            window.initGalleryListeners();
        };

        const onFilterButtonClick = (evt) => {
            currentPhotos = filtratePhotos(evt.currentTarget.id);

            clearActiveFilterButton();
            window.utils.debounce(showFilteredPhotos);
            evt.currentTarget.classList.add("img-filters__button--active");
        };

        showFilteredPhotos();
        filterButtons.forEach(button => button.addEventListener("click", onFilterButtonClick));
    };

    window.filtration = initFiltration;

})();
