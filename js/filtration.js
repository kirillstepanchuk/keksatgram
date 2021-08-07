"use strict";

(function () {
    const DEBOUNCE_INTERVAL = 500;

    let photosInformation;

    let popularPhotos = [];
    let newPhotos = [];
    let discussedPhotos = [];

    const pictureTemplate = document.querySelector("#picture").content.querySelector(".picture");

    const renderPicture = (pictureInfo) => {
        const picture = pictureTemplate.cloneNode(true);

        picture.querySelector(".picture__img").src = pictureInfo.url;
        picture.querySelector(".picture__likes").textContent = pictureInfo.likes;
        picture.querySelector(".picture__comments").textContent = pictureInfo.comments.length;
        picture.dataset.number = pictureInfo.id;

        return picture;
    };

    const removePicturesFromPage = () => {
        const pictureBlocks = document.querySelectorAll(".picture");

        pictureBlocks.forEach(picture => picture.remove());
    };

    const getRandomInteger = (min, max) => {
        return Math.floor(min + Math.random() * (max + 1 - min))
    };

    const getRandomUnitFromList = (list) => {
        return list[getRandomInteger(0, list.length - 1)]
    };

    const fillPopularPhotos = () => {
        photosInformation.forEach(photo => popularPhotos.push(photo));
    };

    const fillNewPhotos = () => {
        let temp = true;

        while (temp) {
            let randomPhoto = getRandomUnitFromList(popularPhotos);

            if (newPhotos.indexOf(randomPhoto) === -1) {
                newPhotos.push(randomPhoto);
            };

            if (newPhotos.length === 10) {
                temp = false
            };
        };
    };

    const fillDiscussedPhotos = () => {
        //create copy and sort
        discussedPhotos = popularPhotos.slice().sort((a, b) => b.comments.length - a.comments.length);
    };

    const showPhotosOnPage = (photoList) => {
        const picturesContainer = document.querySelector(".pictures");
        const pictureFragment = document.createDocumentFragment();

        removePicturesFromPage();

        for (let i = 0; i < photoList.length; i++) {
            const renderedPicture = renderPicture(photoList[i]);

            pictureFragment.append(renderedPicture);
        };
        picturesContainer.append(pictureFragment);

        const pictureBlocks = document.querySelectorAll(".picture");
        pictureBlocks.forEach(element => element.addEventListener("click", onPictureBlockClick));
    };

    const debounce = (f, ms) => {
        let isCooldown = false;

        return function () {
            if (isCooldown) return;
            f.apply(this, arguments);
            isCooldown = true;
            setTimeout(() => isCooldown = false, ms);
        };
    };

    const onPictureBlockClick = (evt) => {
        window.showBigPicture(popularPhotos[evt.currentTarget.dataset.number])
    };

    const successHandler = (pictureData) => {
        photosInformation = pictureData;
        console.log('photosInformation: ', photosInformation);

        const FILTERS = {
            "filter-popular": () => {
                showPhotosOnPage(popularPhotos);
            },
            "filter-new": () => {
                showPhotosOnPage(newPhotos);
            },
            "filter-discussed": () => {
                showPhotosOnPage(discussedPhotos);
            },
        };

        const clearActiveFilterButton = () => {
            filterButtons.forEach(filterButton => filterButton.classList.remove('img-filters__button--active'));
        };

        const onFilterButtonClick = (evt) => {
            clearActiveFilterButton();
            evt.currentTarget.classList.add("img-filters__button--active");
            FILTERS[evt.currentTarget.id]();
        };

        const onFilterButtonClickDebounced = debounce(onFilterButtonClick, DEBOUNCE_INTERVAL);

        fillPopularPhotos();

        //show filter buttons after load
        document.querySelector(".img-filters").classList.remove("img-filters--inactive");

        //show events
        const filterButtons = document.querySelectorAll(".img-filters__button");

        // filterButtons.forEach(button => button.addEventListener("click", debounce(onFilterButtonClick, DEBOUNCE_INTERVAL)));
        filterButtons.forEach(button => button.addEventListener("click", onFilterButtonClickDebounced));

        fillNewPhotos();
        fillDiscussedPhotos();

        showPhotosOnPage(popularPhotos);
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