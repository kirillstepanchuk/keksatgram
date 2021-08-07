"use strict";

(function () {
  const AVATAR_WIDTH = 35;
  const AVATAR_HEIGHT = 35;
  const AVATAR_ALTERNATIVE_TEXT = "Аватар автора комментария";

  const removeElementsFromList = (list) => {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  };

  const createCommentImage = (avatarData) => {
    const commentImage = document.createElement("img");

    commentImage.classList.add("social__picture");

    commentImage.src = avatarData;
    commentImage.alt = AVATAR_ALTERNATIVE_TEXT;
    commentImage.width = AVATAR_WIDTH;
    commentImage.height = AVATAR_HEIGHT;

    return commentImage;
  };

  const createCommentText = (messageData) => {
    const commentText = document.createElement("p");

    commentText.classList.add("social__text");

    commentText.textContent = messageData;

    return commentText;
  };

  const createComment = (commentData) => {
    const commentElement = document.createElement("li");

    commentElement.classList.add("social__comment");

    commentElement.append(createCommentImage(commentData.avatar));
    commentElement.append(createCommentText(commentData.message));

    return commentElement;
  };

  const bigPictureCard = document.querySelector(".big-picture");
  const bigPictureImage = bigPictureCard.querySelector(".big-picture__img img");
  const bigPictureLikes = bigPictureCard.querySelector(".likes-count");
  const bigPictureCommentsCount = bigPictureCard.querySelector(".comments-count");
  const bigPictureDescription = bigPictureCard.querySelector(".social__caption");
  const bigPictureCancelButton = bigPictureCard.querySelector("#picture-cancel");

  window.showBigPicture = (pictureData) => {
    bigPictureCard.classList.remove("hidden");

    bigPictureImage.src = pictureData.url;
    bigPictureLikes.textContent = pictureData.likes;
    bigPictureCommentsCount.textContent = pictureData.comments.length;
    bigPictureDescription.textContent = pictureData.description;

    //comments
    const socialCommens = bigPictureCard.querySelector(".social__comments");

    removeElementsFromList(socialCommens);

    const NEW_COMMENTS_INTERVAL = 5;

    const socialCommentsCount = bigPictureCard.querySelector(".social__comment-count");
    const socialCommentsLoaderButton = bigPictureCard.querySelector(".comments-loader");

    socialCommentsLoaderButton.classList.remove("visually-hidden");

    const comments = pictureData.comments;

    let currentCommentsIndex = 0;
    let maxCommentsIndex = Math.min(currentCommentsIndex + NEW_COMMENTS_INTERVAL, comments.length);

    const showMoreComments = () => {
      const commentFragment = document.createDocumentFragment();

      for (let i = currentCommentsIndex; i < maxCommentsIndex; i++) {
        commentFragment.appendChild(createComment(comments[i]));
      };

      socialCommens.append(commentFragment);

      //update indexes
      currentCommentsIndex = maxCommentsIndex;
      maxCommentsIndex = Math.min(currentCommentsIndex + NEW_COMMENTS_INTERVAL, comments.length);

      socialCommentsCount.textContent = `${currentCommentsIndex} из ${comments.length} комментариев`

      if (currentCommentsIndex === comments.length) {
        socialCommentsLoaderButton.classList.add("visually-hidden");
      }
    };

    showMoreComments();

    socialCommentsLoaderButton.addEventListener("click", showMoreComments)

    //close events
    document.addEventListener("keydown", onBigPictureEscPress);

    bigPictureCancelButton.addEventListener("click", onBigPictureCancelButtonClick);
    bigPictureCancelButton.addEventListener("keydown", onBigPictureCancelButtonEnterPress);
  };

  const onBigPictureEscPress = (evt) => {
    if (window.utils.isEscKey(evt)) {
      closeBigPicture();
    }
  };

  const onBigPictureCancelButtonClick = () => {
    closeBigPicture();
  };

  const onBigPictureCancelButtonEnterPress = (evt) => {
    if (window.utils.isEnterKey(evt)) {
      closeBigPicture();
    }
  };

  const closeBigPicture = () => {
    bigPictureCard.classList.add("hidden");
    document.removeEventListener("keydown", onBigPictureEscPress);

    bigPictureCancelButton.removeEventListener("click", onBigPictureCancelButtonClick);
    bigPictureCancelButton.removeEventListener("keydown", onBigPictureCancelButtonEnterPress);
  };

})();