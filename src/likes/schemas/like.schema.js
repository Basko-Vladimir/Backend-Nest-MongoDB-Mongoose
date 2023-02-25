"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.likeSchema = exports.Like = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var enums_1 = require("../../common/enums");
var Like = /** @class */ (function () {
    function Like() {
    }
    Like.createLikeEntity = function (userId, userLogin, postId, status, LikeModel, commentId) {
        return new LikeModel({ userId: userId, userLogin: userLogin, postId: postId, status: status, commentId: commentId });
    };
    Like.prototype.updateLikeStatus = function (status, like) {
        like.status = status;
        return like;
    };
    __decorate([
        (0, mongoose_1.Prop)({
            type: mongoose_2.Types.ObjectId,
            required: true
        })
    ], Like.prototype, "userId");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true
        })
    ], Like.prototype, "userLogin");
    __decorate([
        (0, mongoose_1.Prop)({
            type: mongoose_2.Types.ObjectId,
            "default": null
        })
    ], Like.prototype, "commentId");
    __decorate([
        (0, mongoose_1.Prop)({
            type: mongoose_2.Types.ObjectId,
            required: true
        })
    ], Like.prototype, "postId");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            "enum": [enums_1.LikeStatus.LIKE, enums_1.LikeStatus.DISLIKE, enums_1.LikeStatus.NONE],
            required: true
        })
    ], Like.prototype, "status");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Like.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Like.prototype, "updatedAt");
    Like = __decorate([
        (0, mongoose_1.Schema)({ timestamps: true })
    ], Like);
    return Like;
}());
exports.Like = Like;
exports.likeSchema = mongoose_1.SchemaFactory.createForClass(Like);
exports.likeSchema.method('updateLikeStatus', Like.prototype.updateLikeStatus);
exports.likeSchema.static('createLikeEntity', Like.createLikeEntity);
