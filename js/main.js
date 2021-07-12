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
const MAX_HASHTAGS_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const AVATAR_ALTERNATIVE_TEXT = "Аватар автора комментария";
const ESC_KEY_NAME = "Escape";
const ENTER_KEY_NAME = "Enter";

const postedPhotos = [];

//functions

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const getRandomUnitFromList = (list) => list[getRandomInteger(0, list.length - 1)];

const removeElementsFromList = (list) => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

const getCountSimilarElementsInList = (numsArr, target) => {
  let count = 0;
  for (let i = 0; i < numsArr.length; i++) {
    if (numsArr[i] == target) count++
  }
  return count;
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

//calculate and return effect level for every effect
const getEffectLevel = (effectName) => {
  const effectLevelLineWidth = getComputedStyle(document.querySelector(".effect-level__line")).width;//get bounsing
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

const showBigPicture = (pictureData) => {
  bigPictureCard.classList.remove("hidden");

  bigPictureImage.src = pictureData.url;
  bigPictureLikes.textContent = pictureData.likes;
  bigPictureCommentsCount.textContent = pictureData.comments.length;
  bigPictureDescription.textContent = pictureData.description;

  //comments
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

const onPictureBlockClick = (evt) => {
  showBigPicture(postedPhotos[evt.currentTarget.dataset.number])
};

//big picture events
const onBigPictureEscPress = (evt) => {
  if (evt.key === ESC_KEY_NAME) {
    closeBigPicture();
  }
};

const onBigPictureCancelButtonClick = () => {
  closeBigPicture();
};

const onBigPictureCancelButtonEnterPress = (evt) => {
  if (evt.key === ENTER_KEY_NAME) {
    closeBigPicture();
  }
};

const closeBigPicture = () => {
  bigPictureCard.classList.add("hidden");
  document.removeEventListener("keydown", onBigPictureEscPress);

  bigPictureCancelButton.removeEventListener("click", onBigPictureCancelButtonClick);
  bigPictureCancelButton.removeEventListener("keydown", onBigPictureCancelButtonEnterPress);
};

// Upload form events
const uploadCancelButton = document.querySelector("#upload-cancel");
const uploadForm = document.querySelector(".img-upload__overlay");


const onUploadCancelButtonClick = () => {
  closeUploadForm();
}

const onUploadFormEscPress = (evt) => {
  if (evt.key === ESC_KEY_NAME) {
    closeUploadForm();
  }
};

const onUploadCancelButtonEnterPress = (evt) => {
  if (evt.key === ENTER_KEY_NAME) {
    closeUploadForm();
  }
};

const effectItems = document.querySelectorAll(".effects__item");

const showUploadForm = () => {
  effectLevelBlock.classList.add("hidden");
  formPicture.className = "img-upload__preview";
  formPicture.style = "";
  uploadForm.classList.remove("hidden");
  uploadCancelButton.addEventListener("click", onUploadCancelButtonClick);
  uploadCancelButton.addEventListener("keydown", onUploadCancelButtonEnterPress);
  document.addEventListener("keydown", onUploadFormEscPress);
  effectItems.forEach(element => element.addEventListener("click", onEffectButtonClick));
};

const uploadPictureInput = document.querySelector("#upload-file");
const uploadHashtagsInput = document.querySelector(".text__hashtags");
const uploadDescriptionInput = document.querySelector(".text__description");

const closeUploadForm = () => {
  uploadPictureInput.value = "";
  uploadHashtagsInput.value = "";
  uploadDescriptionInput.value = "";
  uploadForm.classList.add("hidden");
  uploadCancelButton.removeEventListener("click", onUploadCancelButtonClick);
  uploadCancelButton.removeEventListener("keydown", onUploadCancelButtonEnterPress);
  document.removeEventListener("keydown", onUploadFormEscPress);
  effectLevelPin.removeEventListener("mouseup", onEffectLevelPinMouseup);
  effectItems.forEach(element => element.removeEventListener("click", onEffectButtonClick));
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

const onUploadInputChange = () => {
  showUploadForm();
};

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

uploadPictureInput.addEventListener("change", onUploadInputChange);

//add event showBigPicture for every picture
const pictureBlocks = document.querySelectorAll(".picture");

pictureBlocks.forEach(element => element.addEventListener("click", onPictureBlockClick));

//hashtags

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

const uploadFormSubmitButton = uploadForm.querySelector(".img-upload__submit");

uploadFormSubmitButton.addEventListener("click", () => {
  checkHashtagsValidity();
  console.log(errorsState);
  console.log(createErrorMessage());
  uploadHashtagsInput.setCustomValidity(createErrorMessage());
});




