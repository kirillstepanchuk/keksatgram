"use strict";

(function () {
    const MAX_EFFECT_VALUE = 100;

    const EFFECTS = {
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

    //calculate and return effect level for every effect
    const getEffectLevel = () => {
        const maxEffectLevelValue = effectLevelLine.offsetWidth;
        const deptEffectLevelValue = effectLevelDepth.offsetWidth;

        const deptEffectLevelPercent = MAX_EFFECT_VALUE * deptEffectLevelValue / maxEffectLevelValue;

        return (EFFECTS[currentEffect].maxValue - EFFECTS[currentEffect].minValue) * deptEffectLevelPercent / MAX_EFFECT_VALUE + EFFECTS[currentEffect].minValue;
    };

    const uploadCancelButton = document.querySelector("#upload-cancel");
    const uploadOverlay = document.querySelector(".img-upload__overlay");
    const effectItems = document.querySelectorAll(".effects__item");

    const showUploadOverlay = () => {
        effectLevelBlock.classList.add("hidden");

        formPicture.className = "img-upload__preview";

        formPicture.style = "";

        uploadOverlay.classList.remove("hidden");

        uploadCancelButton.addEventListener("click", onUploadCancelButtonClick);
        uploadCancelButton.addEventListener("keydown", onUploadCancelButtonEnterPress);
        document.addEventListener("keydown", onUploadOverlayEscPress);

        effectItems.forEach(element => element.addEventListener("click", onEffectButtonClick));
    };

    const uploadPictureInput = document.querySelector("#upload-file");
    const uploadHashtagsInput = document.querySelector(".text__hashtags");
    const uploadDescriptionInput = document.querySelector(".text__description");

    const closeUploadOverlay = () => {
        uploadPictureInput.value = "";
        uploadHashtagsInput.value = "";
        uploadDescriptionInput.value = "";

        uploadOverlay.classList.add("hidden");

        uploadCancelButton.removeEventListener("click", onUploadCancelButtonClick);
        uploadCancelButton.removeEventListener("keydown", onUploadCancelButtonEnterPress);
        document.removeEventListener("keydown", onUploadOverlayEscPress);
        effectLevelPin.removeEventListener("mouseup", onEffectLevelPinMouseup);
        uploadFormSubmitButton.removeEventListener("click", onuploadFormSubmitButtonClick);

        effectItems.forEach(element => element.removeEventListener("click", onEffectButtonClick));
    };

    const onUploadCancelButtonClick = () => {
        closeUploadOverlay();
    };

    const onUploadOverlayEscPress = (evt) => {
        if (window.utils.isEscKey(evt)) {
            closeUploadOverlay();
        }
    };

    const onUploadCancelButtonEnterPress = (evt) => {
        if (window.utils.isEnterKey(evt)) {
            closeUploadOverlay();
        }
    };

    const formPicture = document.querySelector(".img-upload__preview");
    const effectLevelBlock = document.querySelector(".img-upload__effect-level");
    const effectLevelLine = document.querySelector(".effect-level__line");
    const effectLevelPin = effectLevelBlock.querySelector(".effect-level__pin");
    const effectLevelDepth = effectLevelBlock.querySelector(".effect-level__depth");
    const effectLevelValue = effectLevelBlock.querySelector(".effect-level__value");

    const addEffectLevel = () => {
        formPicture.style.filter = EFFECTS[currentEffect].filterName + "(" + getEffectLevel(currentEffect) + EFFECTS[currentEffect].unit + ")";
    };

    const onEffectLevelPinMouseup = () => {
        addEffectLevel();
    };

    const showEffect = () => {
        formPicture.className = "img-upload__preview";
        formPicture.style = "";

        if (currentEffect == "none") {
            effectLevelBlock.classList.add("hidden");
        } else {
            if (effectLevelBlock.classList.contains("hidden")) {
                effectLevelBlock.classList.remove("hidden");
            };

            formPicture.classList.add(`effects__preview--${currentEffect}`);
            effectLevelValue.setAttribute("value", MAX_EFFECT_VALUE);
            effectLevelPin.style.left = `${MAX_EFFECT_VALUE}%`;
            effectLevelDepth.style.width = `${MAX_EFFECT_VALUE}%`;
            effectLevelPin.addEventListener("mouseup", onEffectLevelPinMouseup);
        };
    };

    const onEffectButtonClick = (evt) => {
        currentEffect = evt.currentTarget.querySelector("input").value;
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

            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    effectLevelPin.addEventListener("mousedown", onEffectLevelPinMouseDown);

    //upload form
    uploadPictureInput.addEventListener("change", onUploadInputChange);


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
    }

    const onUploadSuccessEscPress = (evt) => {
        if (window.utils.isEscKey(evt)) {
            closeUploadSuccess();
        }
    };

    const onUploadSuccessButtonClick = () => {
        closeUploadSuccess();
    };

    const onUploadErrorEscPress = (evt) => {
        if (window.utils.isEscKey(evt)) {
            closeUploadError();
        }
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

    const uploadForm = document.querySelector(".img-upload__form");
    const errorTemplate = document.querySelector("#error").content.querySelector(".error");
    const successTemplate = document.querySelector("#success").content.querySelector(".success");

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

    uploadForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        window.backend.upload(new FormData(uploadForm), successHandler, errorHandler);
    })

    //hashtags
    const MAX_HASHTAGS_COUNT = 5;
    const MAX_HASHTAG_LENGTH = 20;

    const getCountSimilarElementsInList = (numsArr, target) => {
        let count = 0;

        for (let i = 0; i < numsArr.length; i++) {
            if (numsArr[i] == target) count++
        };

        return count;
    };

    const ErrorNameToErrorDescription = {
        tagContainsOnlySharp: "Хештег состоит только из решетки. ",
        similarTags: "Имеются одинаковые хештеги. ",
        noSpacesBetweenTags: "Хештеги должны разделяться пробелами. ",
        moreThan20Letters: "Хештег более 20 символов. ",
        moreThan5Tags: "Указано больше 5 хештегов. ",
        hashtagDoesNotStartWithSharp: "Хештеги должны начинаться с #. ",
    };

    const errorsState = Object.assign({}, ErrorNameToErrorDescription);

    for (let key in errorsState) {
        errorsState[key] = false;
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

    const isMoreThan20Letters = (hashTag) => {
        return hashTag.length > MAX_HASHTAG_LENGTH;
    };

    const isSimilarTags = (hashTagList, hashTag) => {
        return getCountSimilarElementsInList(hashTagList, hashTag) > 1;
    };

    const isMoreThan5Tags = (hashTagList) => {
        return hashTagList.length > MAX_HASHTAGS_COUNT;
    };

    const checkHashtagsValidity = () => {
        for (let key in errorsState) {
            errorsState[key] = false;
        };

        const hashTags = uploadHashtagsInput.value.split(" ");

        errorsState.moreThan5Tags = errorsState.moreThan5Tags || isMoreThan5Tags(hashTags);

        for (let i = 0; i < hashTags.length; i++) {
            errorsState.hashtagDoesNotStartWithSharp = errorsState.hashtagDoesNotStartWithSharp || isHashtagStartWithSharp(hashTags[i], uploadHashtagsInput);
            errorsState.tagContainsOnlySharp = errorsState.tagContainsOnlySharp || isTagContainsOnlySharp(hashTags[i]);
            errorsState.noSpacesBetweenTags = errorsState.noSpacesBetweenTags || isSpacesBetweenTags(hashTags[i]);
            errorsState.moreThan20Letters = errorsState.moreThan20Letters || isMoreThan20Letters(hashTags[i]);
            errorsState.similarTags = errorsState.similarTags || isSimilarTags(hashTags, hashTags[i]);
        };
    };

    const createErrorMessage = () => {
        let errorMessage = "";

        for (let key in errorsState) {
            if (errorsState[key] === true) {
                errorMessage = errorMessage + ErrorNameToErrorDescription[key];
            }
        }
        return errorMessage;
    };

    const uploadFormSubmitButton = uploadOverlay.querySelector(".img-upload__submit");

    const onuploadFormSubmitButtonClick = () => {
        checkHashtagsValidity();
        uploadHashtagsInput.setCustomValidity(createErrorMessage());
    };

    uploadFormSubmitButton.addEventListener("click", onuploadFormSubmitButtonClick);
})();
