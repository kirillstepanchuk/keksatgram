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
];

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

const MIN_LIKES_COUNT = 15;
const MAX_LIKES_COUNT = 200;
const MIN_AVATAR_COUNT = 1;
const MAX_AVATAR_COUNT = 6;
const PHOTOS_COUNT = 25;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 10;
const AVATAR_WIDTH = 35;
const AVATAR_HEIGHT = 35;
const MAX_EFFECT_VALUE = 100;
const AVATAR_ALTERNATIVE_TEXT = "Аватар автора комментария";

const postedPhotos = [];

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

const createCommentImage = (elementNumber, elementFromList) => {
  const commentImage = document.createElement("img");

  commentImage.classList.add("social__picture");

  commentImage.src = postedPhotos[elementFromList].comments[elementNumber].avatar;
  commentImage.alt = AVATAR_ALTERNATIVE_TEXT;
  commentImage.width = AVATAR_WIDTH;
  commentImage.height = AVATAR_HEIGHT;

  return commentImage;
};

const createCommentText = (elementNumber, elementFromList) => {
  const commentText = document.createElement("p");

  commentText.classList.add("social__text");

  commentText.textContent = postedPhotos[elementFromList].comments[elementNumber].message;

  return commentText;
};

const createComment = (elementNumber, elementFromList) => {
  const commentElement = document.createElement("li");

  commentElement.classList.add("social__comment");

  commentElement.append(createCommentImage(elementNumber, elementFromList));
  commentElement.append(createCommentText(elementNumber, elementFromList));

  return commentElement;
};

//calculate and return effect level for every effect
const getEffectLevel = (effectName) => {
  const effectLevelLineWidth = getComputedStyle(document.querySelector(".effect-level__line")).width;
  const effectLevelDepthWidth = getComputedStyle(document.querySelector(".effect-level__pin")).left;

  const maxEffectLevelValue = +effectLevelLineWidth.substring(0, effectLevelLineWidth.length - 2);
  const deptEffectLevelValue = +effectLevelDepthWidth.substring(0, effectLevelDepthWidth.length - 2);

  const deptEffectLevelPercent = MAX_EFFECT_VALUE * deptEffectLevelValue / maxEffectLevelValue;

  return (EFFECTS[effectName].maxValue - EFFECTS[effectName].minValue) * deptEffectLevelPercent / MAX_EFFECT_VALUE + EFFECTS[effectName].minValue;
}

const bigPictureCard = document.querySelector(".big-picture");
const bigPictureImage = bigPictureCard.querySelector(".big-picture__img img");
const bigPictureLikes = bigPictureCard.querySelector(".likes-count");
const bigPictureCommentsCount = bigPictureCard.querySelector(".comments-count");
const bigPictureDescription = bigPictureCard.querySelector(".social__caption");
const bigPictureCancelButton = bigPictureCard.querySelector("#picture-cancel");

const showBigPicture = (elementFromList) => {
  bigPictureCard.classList.remove("hidden");

  bigPictureImage.src = postedPhotos[elementFromList].url;
  bigPictureLikes.textContent = postedPhotos[elementFromList].likes;
  bigPictureCommentsCount.textContent = postedPhotos[elementFromList].comments.length;
  bigPictureDescription.textContent = postedPhotos[elementFromList].description;

  //comments
  const socialCommens = bigPictureCard.querySelector(".social__comments");
  const commentFragment = document.createDocumentFragment();

  removeElementsFromList(socialCommens);

  for (let i = 0; i < postedPhotos[elementFromList].comments.length; i++) {
    const commentElement = createComment(i, elementFromList);

    commentFragment.append(commentElement);
  };

  socialCommens.append(commentFragment);

  const socialCommentsCount = bigPictureCard.querySelector(".social__comment-count");
  const socialCommentsLoaderButton = bigPictureCard.querySelector(".comments-loader");

  socialCommentsCount.classList.add("visually-hidden");
  socialCommentsLoaderButton.classList.add("visually-hidden");

  document.addEventListener("keydown", onBigPictureEscPress);

  bigPictureCancelButton.addEventListener("click", closeBigPicture);
  bigPictureCancelButton.addEventListener("keydown", onBigPictureCancelButtonEnterPress);
};

const onPictureBlockClick = (evt) => {
  showBigPicture(evt.currentTarget.dataset.number)
};

//big picture events
const onBigPictureEscPress = (evt) => {
  if (evt.keyCode === 27) {
    closeBigPicture();
  }
};

const onBigPictureCancelButtonEnterPress = (evt) => {
  if (evt.keyCode === 13) {
    closeBigPicture();
  }
};

const closeBigPicture = () => {
  bigPictureCard.classList.add("hidden");
  document.removeEventListener("keydown", onBigPictureEscPress);

  bigPictureCancelButton.removeEventListener("click", closeBigPicture);
  bigPictureCancelButton.removeEventListener("keydown", onBigPictureCancelButtonEnterPress);
};

// Upload form events
const uploadCancelButton = document.querySelector("#upload-cancel");
const uploadForm = document.querySelector(".img-upload__overlay");

const onUploadFormEscPress = (evt) => {
  if (evt.keyCode === 27) {
    closeUploadForm();
  }
};

const onUploadCancelButtonEnterPress = (evt) => {
  if (evt.keyCode === 13) {
    closeUploadForm();
  }
};

const showUploadForm = () => {
  effectLevelBlock.classList.add("hidden");
  formPicture.className = "img-upload__preview";
  formPicture.style = "";
  uploadForm.classList.remove("hidden");
  uploadCancelButton.addEventListener("click", closeUploadForm);
  uploadCancelButton.addEventListener("keydown", onUploadCancelButtonEnterPress);
  document.addEventListener("keydown", onUploadFormEscPress);
};

const closeUploadForm = () => {
  uploadInput.value = "";
  uploadForm.classList.add("hidden");
  uploadCancelButton.removeEventListener("click", closeUploadForm);
  uploadCancelButton.removeEventListener("keydown", onUploadCancelButtonEnterPress);
  document.removeEventListener("keydown", onUploadFormEscPress);
  effectLevelPin.removeEventListener("mouseup", onEffectLevelPinMouseup);
};

//effect events
const formPicture = document.querySelector(".img-upload__preview");
const effectLevelBlock = document.querySelector(".img-upload__effect-level");
const effectLevelPin = effectLevelBlock.querySelector(".effect-level__pin");
const effectLevelDepth = effectLevelBlock.querySelector(".effect-level__depth");
const effectLevelValue = effectLevelBlock.querySelector(".effect-level__value");

const addEffectLevel = (effectName) => {
  formPicture.style.filter = EFFECTS[effectName].filterName + "(" + getEffectLevel(effectName) + EFFECTS[effectName].unit + ")";
};

const onEffectLevelPinMouseup = () => {
  addEffectLevel(currentEffect);
};

const showEffect = () => {
  formPicture.className = "img-upload__preview";
  formPicture.style = "";

  if (currentEffect == "none") {
    effectLevelBlock.classList.add("hidden");
  } else {
    if (effectLevelBlock.classList.contains("hidden")) {
      effectLevelBlock.classList.remove("hidden");
    }

    formPicture.classList.add(`effects__preview--${currentEffect}`);
    effectLevelValue.setAttribute("value", MAX_EFFECT_VALUE);
    effectLevelPin.style.left = `${MAX_EFFECT_VALUE}%`;
    effectLevelDepth.style.width = `${MAX_EFFECT_VALUE}%`;
    effectLevelPin.addEventListener("mouseup", onEffectLevelPinMouseup);
  }
};

const onEffectButtonClick = (evt) => {
  currentEffect = evt.currentTarget.querySelector("input").value;
  showEffect();
};

const onUploadInputChange = () => showUploadForm();

generatePostedPhotos();

//show all pictures
const picturesContainer = document.querySelector(".pictures");
const pictureTemplate = document.querySelector("#picture").content.querySelector(".picture");
const pictureFragment = document.createDocumentFragment();

for (let i = 0; i < postedPhotos.length; i++) {
  const picture = pictureTemplate.cloneNode(true);
  picture.dataset.number = i;
  picture.querySelector(".picture__img").src = postedPhotos[i].url;
  picture.querySelector(".picture__likes").textContent = postedPhotos[i].likes;
  picture.querySelector(".picture__comments").textContent = postedPhotos[i].comments.length;
  pictureFragment.append(picture);
};

picturesContainer.append(pictureFragment);

//upload form
const uploadInput = document.querySelector("#upload-file");

uploadInput.addEventListener("change", onUploadInputChange);

//add event showBigPicture for every picture
const pictureBlocks = document.querySelectorAll(".picture");

pictureBlocks.forEach(element => element.addEventListener("click", onPictureBlockClick));

//effects
const effectItems = document.querySelectorAll(".effects__item");

effectItems.forEach(element => element.addEventListener("click", onEffectButtonClick));
