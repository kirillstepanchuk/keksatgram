"use strict";

(function () {

	const AVATAR_WIDTH = 35;
	const AVATAR_HEIGHT = 35;
	const NEW_COMMENTS_INTERVAL = 5;
	const AVATAR_ALTERNATIVE_TEXT = "Аватар автора комментария";

	const bigPictureCard = document.querySelector(".big-picture");
	const socialCommens = bigPictureCard.querySelector(".social__comments");
	const socialCommentsCount = bigPictureCard.querySelector(".social__comment-count");
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

	const renderComments = (pictureInfo) => {
		window.utils.removeElementsFromList(socialCommens);

		const comments = pictureInfo.comments;

		let currentCommentsIndex = 0;
		let maxCommentsIndex = getMaxCommentIndex(currentCommentsIndex, comments.length);

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

		const onSocialCommentsLoaderButtonClick = () => {
			showMoreComments();
		};

		if (comments.length <= NEW_COMMENTS_INTERVAL) {
			socialCommentsLoaderButton.classList.add("visually-hidden");
		} else {
			socialCommentsLoaderButton.classList.remove("visually-hidden");

			socialCommentsLoaderButton.addEventListener("click", onSocialCommentsLoaderButtonClick);
		};

		showMoreComments();
	};

	window.renderComments = renderComments;

})();