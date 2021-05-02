"use strict";

const comments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const userNames = [
    'Артем',
    'Кирилл',
    'Даник',
    'Владик',
    'Валера',
    'Настя',
];

const randomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const randomUnitFromList = (list) => list[randomInteger(0, list.length - 1)];

const createList = (count, generateFunction) => {
    const list = [];
    for (let i = 0; i < count; i++) {
        list.push(generateFunction());
    };
    return list;
};

const createComment = () => {
    return {
        avatar: `img/avatar-${randomInteger(1, 6)}.svg`,
        message: randomUnitFromList(comments),
        name: randomUnitFromList(userNames),
    };
};

const createPost = () => {
    return {
        url : `photos/${randomInteger(1, 25)}.jpg`,
        likes : randomInteger(15, 200),
        comments : createList(randomInteger(1, 7), createComment),
    };
};

const postList = createList(25, createPost);
console.log('postList: ', postList);

