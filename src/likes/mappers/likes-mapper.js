"use strict";
exports.__esModule = true;
exports.mapDbLikeToLikeInfoOutputModel = void 0;
var mapDbLikeToLikeInfoOutputModel = function (like) {
    return {
        userId: String(like.userId),
        login: like.userLogin,
        addedAt: like.createdAt.toISOString()
    };
};
exports.mapDbLikeToLikeInfoOutputModel = mapDbLikeToLikeInfoOutputModel;
