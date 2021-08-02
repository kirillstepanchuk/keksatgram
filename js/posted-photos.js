"use strict";

(function () {
  const COMMENTS = [
    "Всё отлично!",
    "В целом всё неплохо. Но не всё.",
    "Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.",
    "Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.",
    "Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.",
    "Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!",
  ];

  const NAMES = ["Артем", "Кирилл", "Даник", "Владик", "Валера", "Настя"];

  const DESCRIPTIONS = [
    "Тестим новую камеру!",
    "Затусили с друзьями на море",
    "Как же круто тут кормят",
    "Отдыхаем...",
    "Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......",
    "Вот это тачка!",
  ];

  const MIN_LIKES_COUNT = 15;
  const MAX_LIKES_COUNT = 200;
  const MIN_AVATAR_COUNT = 1;
  const MAX_AVATAR_COUNT = 6;
  const PHOTOS_COUNT = 25;
  const MIN_COMMENTS_COUNT = 0;
  const MAX_COMMENTS_COUNT = 10;
  const AVATAR_WIDTH = 35;
  const AVATAR_HEIGHT = 35;
  const AVATAR_ALTERNATIVE_TEXT = "Аватар автора комментария";

  let postedPhotos = [];

  //functions
  const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

  const getRandomUnitFromList = (list) => list[getRandomInteger(0, list.length - 1)];

  const removeElementsFromList = (list) => {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  };

  const generateCommentsList = () => {
    const comments = [];
    const maxCommentsAmount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

    for (let i = 0; i < maxCommentsAmount; i++) {
      comments.push({
        avatar: `img/avatar-${getRandomInteger(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT)}.svg`,
        message: getRandomUnitFromList(COMMENTS),
        name: getRandomUnitFromList(NAMES),
      });
    }
    return comments;
  };

  const generatePostedPhotos = () => {
    for (let i = 0; i < PHOTOS_COUNT; i++) {
      postedPhotos.push({
        url: `photos/${i + 1}.jpg`,
        likes: getRandomInteger(MIN_LIKES_COUNT, MAX_LIKES_COUNT),
        comments: generateCommentsList(),
        description: getRandomUnitFromList(DESCRIPTIONS),
      });
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

  //generatePostedPhotos();

  const successHandler = (pictureData) => {
    const picturesContainer = document.querySelector(".pictures");
    const pictureFragment = document.createDocumentFragment();

    for (let i = 0; i < PHOTOS_COUNT; i++) {
      const renderedPicture = renderPicture(pictureData[i]);
      renderedPicture.dataset.number = i;

      pictureFragment.append(renderedPicture);
      postedPhotos.push(pictureData[i]);
    };
    console.log('postedPhotos: ', postedPhotos);

    picturesContainer.append(pictureFragment);

    const pictureBlocks = document.querySelectorAll(".picture");
    pictureBlocks.forEach(element => element.addEventListener("click", onPictureBlockClick));

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

    console.log(errorMessage);
  };

  window.backend.load(successHandler, errorHandler);
  console.log('postedPhotos: ', postedPhotos);

  const pictureTemplate = document.querySelector("#picture").content.querySelector(".picture");

  const renderPicture = (pictureInfo) => {
    const picture = pictureTemplate.cloneNode(true);

    picture.querySelector(".picture__img").src = pictureInfo.url;
    picture.querySelector(".picture__likes").textContent = pictureInfo.likes;
    picture.querySelector(".picture__comments").textContent = pictureInfo.comments.length;

    return picture;
  }
  //add event showBigPicture for every picture
  const onPictureBlockClick = (evt) => {
    showBigPicture(postedPhotos[evt.currentTarget.dataset.number])
  };





  //big picture
  const bigPictureCard = document.querySelector(".big-picture");
  const bigPictureImage = bigPictureCard.querySelector(".big-picture__img img");
  const bigPictureLikes = bigPictureCard.querySelector(".likes-count");
  const bigPictureCommentsCount = bigPictureCard.querySelector(".comments-count");
  const bigPictureDescription = bigPictureCard.querySelector(".social__caption");
  const bigPictureCancelButton = bigPictureCard.querySelector("#picture-cancel");

  const showBigPicture = (pictureData) => {
    bigPictureCard.classList.remove("hidden");

    bigPictureImage.src = pictureData.url;
    bigPictureLikes.textContent = pictureData.likes;
    bigPictureCommentsCount.textContent = pictureData.comments.length;
    bigPictureDescription.textContent = pictureData.description;

    const socialCommens = bigPictureCard.querySelector(".social__comments");
    const commentFragment = document.createDocumentFragment();

    removeElementsFromList(socialCommens);

    pictureData.comments.forEach((comment) => {
      commentFragment.append(createComment(comment));
    });

    socialCommens.append(commentFragment);

    const socialCommentsCount = bigPictureCard.querySelector(".social__comment-count");
    const socialCommentsLoaderButton = bigPictureCard.querySelector(".comments-loader");

    //temporary solution--
    socialCommentsCount.classList.add("visually-hidden");
    socialCommentsLoaderButton.classList.add("visually-hidden");
    //--
    document.addEventListener("keydown", onBigPictureEscPress);

    bigPictureCancelButton.addEventListener("click", onBigPictureCancelButtonClick);
    bigPictureCancelButton.addEventListener("keydown", onBigPictureCancelButtonEnterPress);
  };

  //big picture events
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