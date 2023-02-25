"use strict";
exports.__esModule = true;
exports.commentsConstants = exports.usersConstants = exports.postsConstants = exports.blogsConstants = exports.REFRESH_TOKEN_LIFE_TIME = exports.ACCESS_TOKEN_LIFE_TIME = exports.MIN_STRINGS_LENGTH = exports.EMPTY_SEARCH_VALUE = exports.DEFAULT_PAGE_SIZE = exports.DEFAULT_PAGE_NUMBER = void 0;
exports.DEFAULT_PAGE_NUMBER = 1;
exports.DEFAULT_PAGE_SIZE = 10;
exports.EMPTY_SEARCH_VALUE = '';
exports.MIN_STRINGS_LENGTH = 1;
exports.ACCESS_TOKEN_LIFE_TIME = '10s';
exports.REFRESH_TOKEN_LIFE_TIME = '20s';
exports.blogsConstants = {
    MAX_NAME_LENGTH: 15,
    MAX_DESCRIPTION_LENGTH: 500,
    WEBSITE_URL_REG_EXP: new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'),
    MAX_WEBSITE_URL_LENGTH: 100
};
exports.postsConstants = {
    MAX_TITLE_LENGTH: 30,
    MAX_SHORT_DESCRIPTION_LENGTH: 100,
    MAX_CONTENT_LENGTH: 1000
};
exports.usersConstants = {
    MIN_LOGIN_LENGTH: 3,
    MAX_LOGIN_LENGTH: 10,
    LOGIN_REG_EXP: new RegExp('^[a-zA-Z0-9_-]*$'),
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 20,
    EMAIL_REG_EXP: new RegExp('^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
};
exports.commentsConstants = {
    MIN_CONTENT_LENGTH: 20,
    MAX_CONTENT_LENGTH: 300
};
