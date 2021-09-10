"use strict";

(function () {
    const pictureTemplate = document.querySelector("#picture").content.querySelector(".picture");

    const renderPicture = (pictureInfo) => {
        const picture = pictureTemplate.cloneNode(true);

        picture.querySelector(".picture__img").src = pictureInfo.url;
        picture.querySelector(".picture__likes").textContent = pictureInfo.likes;
        picture.querySelector(".picture__comments").textContent = pictureInfo.comments.length;

        picture.dataset.number = pictureInfo.id;

        return picture;
    };

    window.renderPicture = renderPicture;
})()