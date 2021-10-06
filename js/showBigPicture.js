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
    renderComments(pictureData);

    bigPictureCard.classList.remove("hidden");

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
      socialCommentsLoaderButton.removeEventListener("click", onSocialCommentsLoaderButtonClick);
    };

    document.addEventListener("keydown", onBigPictureEscPress);
    bigPictureCancelButton.addEventListener("click", onBigPictureCancelButtonClick);
    bigPictureCancelButton.addEventListener("keydown", onBigPictureCancelButtonEnterPress);
  };

  //comments
  const AVATAR_WIDTH = 35;
  const AVATAR_HEIGHT = 35;
  const NEW_COMMENTS_INTERVAL = 5;
  const AVATAR_ALTERNATIVE_TEXT = "Аватар автора комментария";

  // const bigPictureCard = document.querySelector(".big-picture");
  const socialCommens = bigPictureCard.querySelector(".social__comments");
  // const socialCommentsCount = bigPictureCard.querySelector(".social__comment-count");
  const socialCommentsLoaderButton = bigPictureCard.querySelector(".comments-loader");

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

  const getMaxCommentIndex = (currentIndex, commentsCount) => {
    return Math.min(currentIndex + NEW_COMMENTS_INTERVAL, commentsCount);
  };

  let comments = [];

  let currentCommentsIndex;
  let maxCommentsIndex;

  const showMoreComments = () => {
    const commentFragment = document.createDocumentFragment();

    comments.slice(currentCommentsIndex, maxCommentsIndex)
      .forEach(comment => commentFragment.appendChild(createComment(comment)));

    socialCommens.append(commentFragment);

    //update indexes
    currentCommentsIndex = maxCommentsIndex;
    maxCommentsIndex = getMaxCommentIndex(currentCommentsIndex, comments.length);

    socialCommentsCount.firstChild.textContent = `${currentCommentsIndex} из `;

    // comments-count
    if (currentCommentsIndex === comments.length) {
      socialCommentsLoaderButton.classList.add("visually-hidden");
      socialCommentsLoaderButton.removeEventListener("click", onSocialCommentsLoaderButtonClick);
    };
  };

  const renderComments = (pictureInfo) => {
    comments = pictureInfo.comments.slice();
    console.log('comments: ', comments);

    window.utils.removeElementsFromList(socialCommens);

    currentCommentsIndex = 0;
    maxCommentsIndex = getMaxCommentIndex(currentCommentsIndex, comments.length);

    if (comments.length <= NEW_COMMENTS_INTERVAL) {
      socialCommentsLoaderButton.classList.add("visually-hidden");
    } else {
      socialCommentsLoaderButton.classList.remove("visually-hidden");

      socialCommentsLoaderButton.addEventListener("click", onSocialCommentsLoaderButtonClick);
    };

    showMoreComments();
  };

  const onSocialCommentsLoaderButtonClick = () => {
    showMoreComments();
  };

  // window.renderComments = renderComments;


  window.showBigPicture = showBigPicture;

})();
