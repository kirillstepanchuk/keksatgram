"use strict";

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
]

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

const postedPhotos = [];

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const getRandomUnitFromList = (list) => list[getRandomInteger(0, list.length - 1)];

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

const createCommentImage = (elementNumber) => {
  const commentImage = document.createElement("img");

  commentImage.classList.add("social__picture");

  commentImage.src = postedPhotos[0].comments[elementNumber].avatar;
  commentImage.alt = AVATAR_ALTERNATIVE_TEXT;
  commentImage.width = AVATAR_WIDTH;
  commentImage.height = AVATAR_HEIGHT;

  return commentImage;
};

const createCommentText = (elementNumber) => {
  const commentText = document.createElement("p");

  commentText.classList.add("social__text");

  commentText.textContent = postedPhotos[0].comments[elementNumber].message;

  return commentText;
};

const createComment = (elementNumber) => {
  const commentElement = document.createElement("li");

  commentElement.classList.add("social__comment");

  commentElement.append(createCommentImage(elementNumber));
  commentElement.append(createCommentText(elementNumber));

  return commentElement;
};

const removeElementsFromList = (list) => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

// const showUploadForm = () => {
//   document.querySelector(".img-upload__overlay").classList.remove("hidden");
// }

// const closeUploadForm = () => {
//   document.querySelector(".img-upload__overlay").classList.add("hidden");
// }

generatePostedPhotos();

const pictures = document.querySelector(".pictures");
const pictureTemplate = document.querySelector("#picture").content.querySelector(".picture");
const pictureFragment = document.createDocumentFragment();

for (let i = 0; i < postedPhotos.length; i++) {
  const picture = pictureTemplate.cloneNode(true);
  picture.querySelector(".picture__img").src = postedPhotos[i].url;
  picture.querySelector(".picture__likes").textContent = postedPhotos[i].likes;
  picture.querySelector(".picture__comments").textContent = postedPhotos[i].comments.length;
  pictureFragment.append(picture);
};

pictures.append(pictureFragment);

//big picture
const showBigPicture = () =>{
  const bigPictureCard = document.querySelector(".big-picture");
  const bigPictureImage = bigPictureCard.querySelector(".big-picture__img img");
  const bigPictureLikes = bigPictureCard.querySelector(".likes-count");
  const bigPictureCommentsCount = bigPictureCard.querySelector(".comments-count");
  const bigPictureDescription = bigPictureCard.querySelector(".social__caption");

  bigPictureCard.classList.remove("hidden");

  bigPictureImage.src = postedPhotos[0].url;
  bigPictureLikes.textContent = postedPhotos[0].likes;
  bigPictureCommentsCount.textContent = postedPhotos[0].comments.length;
  bigPictureDescription.textContent = postedPhotos[0].description;

  //comments

  const socialCommens = bigPictureCard.querySelector(".social__comments");
  const socialComment = socialCommens.querySelector(".social__comment");
  const commentFragment = document.createDocumentFragment();

  removeElementsFromList(socialCommens);

  for (let i = 0; i < postedPhotos[0].comments.length; i++) {
    const commentElement = createComment(i);

    commentFragment.append(commentElement);
  };

  socialCommens.append(commentFragment);

  const socialCommentsCount = bigPictureCard.querySelector(".social__comment-count");
  const socialCommentsLoaderButton = bigPictureCard.querySelector(".comments-loader");

  socialCommentsCount.classList.add("visually-hidden");
  socialCommentsLoaderButton.classList.add("visually-hidden");
};

showBigPicture();
//events
// const uploadInput = document.querySelector("#upload-file");
// const uploadCancelButton = document.querySelector("#upload-cancel");

// uploadInput.addEventListener("change", showUploadForm);

// uploadCancelButton.addEventListener("click", closeUploadForm);

