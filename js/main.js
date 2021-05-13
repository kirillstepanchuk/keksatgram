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

const MIN_LIKES_COUNT = 15;
const MAX_LIKES_COUNT = 200;
const MIN_AVATAR_COUNT = 1;
const MAX_AVATAR_COUNT = 6;
const PHOTOS_COUNT = 25;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 10;

const postedPhotos = [];

const getRandomInteger = (min, max) =>
  Math.floor(min + Math.random() * (max + 1 - min));

const getRandomUnitFromList = (list) => list[getRandomInteger(0, list.length - 1)];

const generateComments = () => {
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
      comments: generateComments(),
    });
  }
};

// const createList = (count, generateFunction) => {
//   const list = [];
//   for (let i = 0; i < count; i++) {
//     list.push(generateFunction());
//   }
//   return list;
// };

const removeElementsFromList = (list) => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

generatePostedPhotos();

const pictureList = document.querySelector(".pictures");
const pictureCard = document.querySelector("#picture");
const pictureImage = picture.content.querySelector(".picture__img");
const pictureLikes = picture.content.querySelector(".picture__likes");
const pictureCommentsCount = picture.content.querySelector(".picture__comments");

for (let i = 0; i < postedPhotos.length; i++) {
  pictureImage.src = postedPhotos[i].url;
  pictureLikes.textContent = postedPhotos[i].likes;
  pictureCommentsCount.textContent = postedPhotos[i].comments.length;
  let picture = pictureCard.content.cloneNode(true);
  pictureList.append(picture);
}

//big picture
const bigPictureCard = document.querySelector(".big-picture");
const bigPictureImage = bigPictureCard.querySelector(".big-picture__img img");
const bigPictureLikes = bigPictureCard.querySelector(".likes-count");
const bigPictureCommentsCount = bigPictureCard.querySelector(".comments-count");

bigPictureCard.classList.remove("hidden");

bigPictureImage.src = postedPhotos[0].url;
bigPictureLikes.textContent = postedPhotos[0].likes;
bigPictureCommentsCount.textContent = postedPhotos[0].comments.length;

//comments

const socialCommentList = bigPictureCard.querySelector(".social__comments");
const socialComment = socialCommentList.querySelector(".social__comment");
const socialCommentsCount = bigPictureCard.querySelector(
  ".social__comment-count"
);
const socialCommentPicture = socialComment.querySelector(".social__picture");
const socialCommentText = socialComment.querySelector(".social__text");
const socialCommentsLoaderButton =
  bigPictureCard.querySelector(".comments-loader");

removeElementsFromList(socialCommentList);

for (let i = 0; i < postedPhotos[0].comments.length; i++) {
  socialCommentPicture.src = postedPhotos[0].comments[i].avatar;
  socialCommentText.textContent = postedPhotos[0].comments[i].message;
  let comment = socialComment.cloneNode(true);
  socialCommentList.append(comment);
}

socialCommentsCount.classList.add("visually-hidden");
socialCommentsLoaderButton.classList.add("visually-hidden");
