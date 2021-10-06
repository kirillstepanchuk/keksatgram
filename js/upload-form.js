"use strict";

(function () {
    const MAX_EFFECT_VALUE = 100;
    const MAX_HASHTAGS_COUNT = 5;
    const MAX_HASHTAG_LENGTH = 20;
    const MAX_SCALE_PERCENTAGE = 100;
    const MIN_SCALE_PERCENTAGE = 25;
    const SCALE_COEFFICIENT = 100;
    const SCALE_RESIZE_PERCENTAGE = 25;

    const Effect = {
        none: {
            name: "none",
            filterName: "none",
            minValue: 0,
            maxValue: 0,
            unit: "",
        },
        chrome: {
            name: "chrome",
            filterName: "grayscale",
            minValue: 0,
            maxValue: 1,
            unit: "",
        },
        sepia: {
            name: "sepia",
            filterName: "sepia",
            minValue: 0,
            maxValue: 1,
            unit: "",
        },
        marvin: {
            name: "marvin",
            filterName: "invert",
            minValue: 0,
            maxValue: 100,
            unit: "%",
        },
        phobos: {
            name: "phobos",
            filterName: "blur",
            minValue: 0,
            maxValue: 5,
            unit: "px",
        },
        heat: {
            name: "heat",
            filterName: "brightness",
            minValue: 1,
            maxValue: 3,
            unit: "",
        },
    };

    let currentEffect = "none";
    let currentScalePercentage = 0;
    let scaleValue = 1;

    const uploadPictureInput = document.querySelector("#upload-file");
    const uploadForm = document.querySelector(".img-upload__form");
    const uploadOverlay = uploadForm.querySelector(".img-upload__overlay");
    const uploadCancelButton = uploadOverlay.querySelector("#upload-cancel");
    const effectItems = uploadOverlay.querySelectorAll(".effects__item");
    const uploadHashtagsInput = uploadOverlay.querySelector(".text__hashtags");
    const uploadDescriptionInput = uploadOverlay.querySelector(".text__description");
    const formPicture = uploadOverlay.querySelector(".img-upload__preview");
    const effectLevelBlock = uploadOverlay.querySelector(".img-upload__effect-level");
    const effectLevelLine = effectLevelBlock.querySelector(".effect-level__line");
    const effectLevelPin = effectLevelBlock.querySelector(".effect-level__pin");
    const effectLevelDepth = effectLevelBlock.querySelector(".effect-level__depth");
    const effectLevelValue = effectLevelBlock.querySelector(".effect-level__value");
    const uploadFormSubmitButton = uploadOverlay.querySelector(".img-upload__submit");
    const imageScaleSmallerButton = uploadOverlay.querySelector('.scale__control--smaller');
    const imageScaleBiggerButton = uploadOverlay.querySelector('.scale__control--bigger');
    const imageScalePercentage = uploadOverlay.querySelector('.scale__control--value');

    const errorTemplate = document.querySelector("#error").content.querySelector(".error");
    const successTemplate = document.querySelector("#success").content.querySelector(".success");

    //calculate and return effect level for every effect
    const getEffectLevel = () => {
        const maxEffectLevelValue = effectLevelLine.offsetWidth;
        const deptEffectLevelValue = effectLevelDepth.offsetWidth;

        const deptEffectLevelPercent = MAX_EFFECT_VALUE * deptEffectLevelValue / maxEffectLevelValue;

        return (Effect[currentEffect].maxValue - Effect[currentEffect].minValue) * deptEffectLevelPercent / MAX_EFFECT_VALUE + Effect[currentEffect].minValue;
    };

    const showUploadOverlay = () => {
        effectLevelBlock.classList.add("hidden");

        formPicture.className = "img-upload__preview";

        formPicture.style = "";

        uploadOverlay.classList.remove("hidden");

        imageScalePercentage.value = `${MAX_SCALE_PERCENTAGE}%`;
        currentScalePercentage = MAX_SCALE_PERCENTAGE;
        formPicture.style.transform = `scale(${scaleValue})`;

        resetScale();

        uploadCancelButton.addEventListener("click", onUploadCancelButtonClick);
        uploadCancelButton.addEventListener("keydown", onUploadCancelButtonEnterPress);
        document.addEventListener("keydown", onUploadOverlayEscPress);
        effectLevelPin.addEventListener("mousedown", onEffectLevelPinMouseDown);
        imageScaleBiggerButton.addEventListener('click', onScaleBiggerButtonClick);
        imageScaleSmallerButton.addEventListener('click', onScaleSmallerButtonClick);

        effectItems.forEach(element => element.addEventListener("click", onEffectButtonClick));
    };

    const closeUploadOverlay = () => {
        uploadPictureInput.value = "";
        uploadHashtagsInput.value = "";
        uploadDescriptionInput.value = "";

        uploadOverlay.classList.add("hidden");

        uploadCancelButton.removeEventListener("click", onUploadCancelButtonClick);
        uploadCancelButton.removeEventListener("keydown", onUploadCancelButtonEnterPress);
        document.removeEventListener("keydown", onUploadOverlayEscPress);
        // uploadFormSubmitButton.removeEventListener("click", onUploadFormSubmitButtonClick);
        effectLevelPin.removeEventListener("mousedown", onEffectLevelPinMouseDown);
        imageScaleBiggerButton.removeEventListener('click', onScaleBiggerButtonClick);
        imageScaleSmallerButton.removeEventListener('click', onScaleSmallerButtonClick);

        effectItems.forEach(element => element.removeEventListener("click", onEffectButtonClick));
    };

    const onUploadCancelButtonClick = () => {
        closeUploadOverlay();
    };

    const onUploadOverlayEscPress = (evt) => {
        window.utils.isEscKey(evt, () => {
            if (uploadHashtagsInput === document.activeElement || uploadDescriptionInput === document.activeElement) {
                return;
            }
            closeUploadOverlay();
        });
    };

    const onUploadCancelButtonEnterPress = (evt) => {
        window.utils.isEnterKey(evt, closeUploadOverlay);
    };

    //Effects
    const addEffectLevel = () => {
        formPicture.style.filter = Effect[currentEffect].filterName + "(" + getEffectLevel(currentEffect) + Effect[currentEffect].unit + ")";
    };

    const showEffect = () => {
        formPicture.className = "img-upload__preview";
        formPicture.style = "";

        if (currentEffect === "none") {
            effectLevelBlock.classList.add("hidden");
        } else {
            effectLevelBlock.classList.remove("hidden");

            formPicture.classList.add(`effects__preview--${currentEffect}`);
            effectLevelValue.setAttribute("value", MAX_EFFECT_VALUE);
            effectLevelPin.style.left = `${MAX_EFFECT_VALUE}%`;
            effectLevelDepth.style.width = `${MAX_EFFECT_VALUE}%`;
        };
    };

    const onEffectButtonClick = (evt) => {
        currentEffect = evt.currentTarget.querySelector("input").value;

        currentScalePercentage = MAX_SCALE_PERCENTAGE;
        resetScale();

        showEffect();
    };

    const onUploadInputChange = () => {
        showUploadOverlay();
    };

    //slider effects
    const onEffectLevelPinMouseDown = (downEvt) => {
        downEvt.preventDefault();

        const effectLevelLineLeftCoordinate = effectLevelLine.getBoundingClientRect().left;

        const setEffectOptions = (effectEvt) => {
            const maxLeft = effectLevelLine.offsetWidth;
            let currentLeft = effectEvt.clientX - effectLevelLineLeftCoordinate;

            if (currentLeft < 0) {
                currentLeft = 0;
            };

            if (currentLeft > maxLeft) {
                currentLeft = maxLeft;
            };

            effectLevelPin.style.left = `${currentLeft}px`;
            effectLevelDepth.style.width = `${currentLeft}px`;

            addEffectLevel();
        };

        const onMouseMove = (moveEvt) => {
            setEffectOptions(moveEvt);
        };

        const onMouseUp = (upEvt) => {
            upEvt.preventDefault();

            setEffectOptions(upEvt);
            addEffectLevel();

            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const closeUploadSuccess = () => {
        document.removeEventListener("keydown", onUploadSuccessEscPress);
        document.querySelector(".success__button").removeEventListener("click", onUploadSuccessButtonClick);

        document.querySelector(".success").remove();
    };

    const closeUploadError = () => {
        document.removeEventListener('keydown', onUploadErrorEscPress);
        errorTemplate.querySelectorAll(".error__button")[0].removeEventListener("click", onUploadErrorTryAgainButtonClick);
        errorTemplate.querySelectorAll(".error__button")[1].removeEventListener("click", onUploadErrorUploadNewFileButtonClick);

        document.querySelector(".error").remove();
    };

    const onUploadSuccessEscPress = (evt) => {
        window.utils.isEscKey(evt, closeUploadSuccess);
    };

    const onUploadSuccessButtonClick = () => {
        closeUploadSuccess();
    };

    const onUploadErrorEscPress = (evt) => {
        window.utils.isEscKey(evt, closeUploadError)
    };

    const onUploadErrorTryAgainButtonClick = () => {
        closeUploadError();

        showUploadOverlay();
    };

    const onUploadErrorUploadNewFileButtonClick = () => {
        closeUploadError();

        uploadPictureInput.value = "";
        uploadPictureInput.click();
    };

    //Image scale edit
    const resetScale = () => {
        imageScalePercentage.value = `${currentScalePercentage}%`;
        scaleValue = currentScalePercentage / SCALE_COEFFICIENT;
        formPicture.style.transform = `scale(${scaleValue})`
    }

    const onScaleBiggerButtonClick = () => {
        if (currentScalePercentage < MAX_SCALE_PERCENTAGE) {
            currentScalePercentage = currentScalePercentage + SCALE_RESIZE_PERCENTAGE;
            resetScale();
        };
    };

    const onScaleSmallerButtonClick = () => {
        if (currentScalePercentage > MIN_SCALE_PERCENTAGE) {
            currentScalePercentage = currentScalePercentage - SCALE_RESIZE_PERCENTAGE;
            resetScale();
        };
    };

    //hashtags
    const ErrorNameToErrorDescription = {
        tagContainsOnlySharp: "Хештег состоит только из решетки. ",
        similarTags: "Имеются одинаковые хештеги. ",
        noSpacesBetweenTags: "Хештеги должны разделяться пробелами. ",
        moreThanMaxLetters: `Хештег более ${MAX_HASHTAG_LENGTH} символов. `,
        moreThanMaxTags: `Указано больше ${MAX_HASHTAGS_COUNT} хештегов. `,
        hashtagDoesNotStartWithSharp: "Хештеги должны начинаться с #. ",
    };

    const errorsState = Object.assign({}, ErrorNameToErrorDescription);

    for (let key in errorsState) {
        errorsState[key] = false;
    };

    const getCountSimilarElementsInList = (numsArr, target) => {
        let count = 0;

        for (let i = 0; i < numsArr.length; i++) {
            if (numsArr[i] == target) count++
        };

        return count;
    };

    const isHashtagStartWithSharp = (hashTag, input) => {
        return hashTag[0] !== "#" && input.value !== "";
    };

    const isTagContainsOnlySharp = (hashTag) => {
        return hashTag === "#";
    };

    const isSpacesBetweenTags = (hashTag) => {
        return hashTag.split("#").length - 1 > 1;
    };

    const isMoreThanMaxLetters = (hashTag) => {
        return hashTag.length > MAX_HASHTAG_LENGTH;
    };

    const isSimilarTags = (hashTagList, hashTag) => {
        return getCountSimilarElementsInList(hashTagList, hashTag) > 1;
    };

    const isMoreThanMaxTags = (hashTagList) => {
        return hashTagList.length > MAX_HASHTAGS_COUNT;
    };

    const checkHashtagsValidity = () => {
        for (let key in errorsState) {
            errorsState[key] = false;
        };

        const hashTags = uploadHashtagsInput.value.split(" ");

        errorsState.moreThanMaxTags = errorsState.moreThanMaxTags || isMoreThanMaxTags(hashTags);

        for (let i = 0; i < hashTags.length; i++) {
            errorsState.hashtagDoesNotStartWithSharp = errorsState.hashtagDoesNotStartWithSharp || isHashtagStartWithSharp(hashTags[i], uploadHashtagsInput);
            errorsState.tagContainsOnlySharp = errorsState.tagContainsOnlySharp || isTagContainsOnlySharp(hashTags[i]);
            errorsState.noSpacesBetweenTags = errorsState.noSpacesBetweenTags || isSpacesBetweenTags(hashTags[i]);
            errorsState.moreThanMaxLetters = errorsState.moreThanMaxLetters || isMoreThanMaxLetters(hashTags[i]);
            errorsState.similarTags = errorsState.similarTags || isSimilarTags(hashTags, hashTags[i]);
        };
    };

    const isHashtagsValid = () => {
        checkHashtagsValidity();

        for (let key in errorsState) {
            if (errorsState[key]) {
                return false;
            };
        };
        return true;
    };

    const createErrorMessage = () => {
        let errorMessage = "";

        for (let key in errorsState) {
            if (errorsState[key]) {
                errorMessage = errorMessage + ErrorNameToErrorDescription[key];
            };
        };

        return errorMessage;
    };

    // const onUploadFormSubmitButtonClick = () => {
    //     checkHashtagsValidity();
    //     uploadHashtagsInput.setCustomValidity(createErrorMessage());
    // };

    // uploadForm.addEventListener("submit", (evt) => {
    //     if (isHashtagsValid) {
    //         evt.preventDefault();
    //         uploadHashtagsInput.setCustomValidity(createErrorMessage());
    //     };
    // });

    // uploadFormSubmitButton.addEventListener("click", onUploadFormSubmitButtonClick);

    const successHandler = () => {
        closeUploadOverlay();

        const successMessage = successTemplate.cloneNode(true);

        document.querySelector("main").insertAdjacentElement("afterbegin", successMessage);

        document.addEventListener("keydown", onUploadSuccessEscPress);
        document.querySelector(".success__button").addEventListener("click", onUploadSuccessButtonClick);
    };

    const errorHandler = (errorText) => {
        uploadOverlay.classList.add('hidden');

        errorTemplate.querySelector(".error__title").textContent = errorText;

        const errorMessage = errorTemplate.cloneNode(true);

        document.querySelector("main").insertAdjacentElement("afterbegin", errorMessage);

        document.addEventListener('keydown', onUploadErrorEscPress);
        errorTemplate.querySelectorAll(".error__button")[0].addEventListener("click", onUploadErrorTryAgainButtonClick);
        errorTemplate.querySelectorAll(".error__button")[1].addEventListener("click", onUploadErrorUploadNewFileButtonClick);
    };

    const onUploadFormSubmit = (evt) => {
        evt.preventDefault();

        if (!isHashtagsValid) {
            uploadHashtagsInput.setCustomValidity(createErrorMessage());

            return;
        };

        window.backend.upload(new FormData(uploadForm), successHandler, errorHandler);
    };

    uploadForm.addEventListener("submit", onUploadFormSubmit);

    const initUploadFormListener = () => {
        uploadPictureInput.addEventListener("change", onUploadInputChange);
    };

    window.uploadForm = initUploadFormListener;
})();
