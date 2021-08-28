"use strict";

(function () {
    let popularPhotos = [];
    let newPhotos = [];
    let discussedPhotos = [];

    const FILTERS = {
        "filter-popular": () => {
            showFilteredPhotos(popularPhotos);
        },
        "filter-new": () => {
            showFilteredPhotos(newPhotos);
        },
        "filter-discussed": () => {
            showFilteredPhotos(discussedPhotos);
        },
    };

    window.showFilteredPhotos = (photoList) => {
        window.utils.removePicturesFromPage();

        const picturesContainer = document.querySelector(".pictures");
        const pictureFragment = document.createDocumentFragment();

        photoList.forEach(photo => pictureFragment.append(window.gallery.renderPicture(photo)))

        picturesContainer.append(pictureFragment);

        window.gallery.bigPicture();
    };

    const filtering = (photos) => {
        const fillPopularPhotos = () => {
            let popularPhotos = [];

            photos.forEach(photo => popularPhotos.push(photo));

            return popularPhotos;
        }

        const fillNewPhotos = () => {
            let newPhotos = [];
            let temp = true;

            while (temp) {
                let randomPhoto = window.utils.getRandomUnitFromList(photos);

                if (newPhotos.indexOf(randomPhoto) === -1) {
                    newPhotos.push(randomPhoto);
                };

                if (newPhotos.length === 10) {
                    temp = false
                };
            };

            return newPhotos;
        }

        const fillDiscussedPhotos = () => {
            let discussedPhotos = photos.slice().sort((a, b) => b.comments.length - a.comments.length);

            return discussedPhotos;
        }

        window.allPhotos = photos;

        popularPhotos = fillPopularPhotos();
        newPhotos = fillNewPhotos();
        discussedPhotos = fillDiscussedPhotos();

        const filterButtons = document.querySelectorAll(".img-filters__button");

        const onFilterButtonClick = (evt) => {
            window.utils.clearActiveFilterButton();
            window.utils.debounce(FILTERS[evt.currentTarget.id]);
            evt.currentTarget.classList.add("img-filters__button--active");
        };

        filterButtons.forEach(button => button.addEventListener("click", onFilterButtonClick));

        document.querySelector(".img-filters").classList.remove("img-filters--inactive");

        showFilteredPhotos(popularPhotos)
    }

    window.filtering = filtering;
})();
