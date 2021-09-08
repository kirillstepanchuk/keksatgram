"use strict";

(function () {
    const NEW_PHOTOS_COUNT = 10;
    const SPLICE_LENGTH = 1;

    const popularPhotosFilter = document.querySelector('#filter-popular');
    const newPhotosFilter = document.querySelector('#filter-new');
    const discussedPhotosFilter = document.querySelector('#filter-discussed');

    const FilterId = {
        POPULAR: popularPhotosFilter.id,
        NEW: newPhotosFilter.id,
        DISCUSSED: discussedPhotosFilter.id,
    }

    const fillPopularPhotos = () => {
        let popularPhotos = [];

        window.allPhotos.forEach(photo => popularPhotos.push(photo));

        return popularPhotos;
    };

    const fillNewPhotos = () => {
        const photosCopy = window.allPhotos.slice();

        let newPhotos = [];

        while (newPhotos.length < NEW_PHOTOS_COUNT) {
            let randomElement = window.utils.getRandomUnitFromList(photosCopy);
            let photo = photosCopy.splice(randomElement.id, SPLICE_LENGTH);
            newPhotos = newPhotos.concat(photo);
        };

        return newPhotos;
    };

    const fillDiscussedPhotos = () => {
        let discussedPhotos = window.allPhotos.slice().sort((a, b) => b.comments.length - a.comments.length);

        return discussedPhotos;
    };

    document.querySelector(".img-filters").classList.remove("img-filters--inactive");

    window.filtratePhotos = (filterId) => {
        switch (filterId) {
            case FilterId.POPULAR:
                return fillPopularPhotos();

            case FilterId.NEW:
                return fillNewPhotos();

            case FilterId.DISCUSSED:
                return fillDiscussedPhotos();
        };
    };

})();
