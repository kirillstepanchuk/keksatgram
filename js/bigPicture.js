"use strict";

(function () {
  const bigPictureCard = document.querySelector(".big-picture");
  const bigPictureImage = bigPictureCard.querySelector(".big-picture__img img");
  const bigPictureLikes = bigPictureCard.querySelector(".likes-count");
  const bigPictureDescription = bigPictureCard.querySelector(".social__caption");
  const bigPictureCancelButton = bigPictureCard.querySelector("#picture-cancel");
  const socialCommentsCount = bigPictureCard.querySelector(".social__comment-count");
  const bigPictureCommentsCount = socialCommentsCount.querySelector(".comments-count");

  const renderBigPicture = (pictureInfo) => {
    bigPictureImage.src = pictureInfo.url;
    bigPictureLikes.textContent = pictureInfo.likes;
    bigPictureDescription.textContent = pictureInfo.description;
    bigPictureCommentsCount.textContent = pictureInfo.comments.length;
  };

  const showBigPicture = (pictureData) => {
    renderBigPicture(pictureData);

    window.renderComments(pictureData);

    document.addEventListener("keydown", onBigPictureEscPress);

    bigPictureCancelButton.addEventListener("click", onBigPictureCancelButtonClick);
    bigPictureCancelButton.addEventListener("keydown", onBigPictureCancelButtonEnterPress);

    bigPictureCard.classList.remove("hidden");
  };

  const onBigPictureEscPress = (evt) => {
    window.utils.isEscKey(evt, closeBigPicture);
  };

  const onBigPictureCancelButtonClick = () => {
    closeBigPicture();
  };

  const onBigPictureCancelButtonEnterPress = (evt) => {
    window.utils.isEnterKey(evt, closeBigPicture);
  };

  const closeBigPicture = () => {
    bigPictureCard.classList.add("hidden");
    document.removeEventListener("keydown", onBigPictureEscPress);

    bigPictureCancelButton.removeEventListener("click", onBigPictureCancelButtonClick);
    bigPictureCancelButton.removeEventListener("keydown", onBigPictureCancelButtonEnterPress);
  };

  const onPictureBlockClick = (evt) => {
    showBigPicture(window.allPhotos[evt.currentTarget.dataset.number])
  };

  const initBigPictureListener = () => {
    document.querySelectorAll(".picture").forEach(element => element.addEventListener("click", onPictureBlockClick));
  };

  window.bigPicture = initBigPictureListener;

})();
