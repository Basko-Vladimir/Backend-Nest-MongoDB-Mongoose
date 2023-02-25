"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.commentSchema = exports.Comment = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var constants_1 = require("../../common/constants");
var error_messages_1 = require("../../common/error-messages");
var Comment = /** @class */ (function () {
    function Comment() {
    }
    Comment.prototype.updateComment = function (content, comment) {
        comment.content = content;
        return comment;
    };
    Comment.createCommentEntity = function (createCommentDto, CommentModel) {
        return new CommentModel(createCommentDto);
    };
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            minlength: [
                constants_1.commentsConstants.MIN_CONTENT_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('content', constants_1.commentsConstants.MIN_CONTENT_LENGTH, 'min'),
            ],
            maxlength: [
                constants_1.commentsConstants.MAX_CONTENT_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('content', constants_1.commentsConstants.MAX_CONTENT_LENGTH, 'max'),
            ]
        })
    ], Comment.prototype, "content");
    __decorate([
        (0, mongoose_1.Prop)({
            type: mongoose_2.Types.ObjectId,
            required: true
        })
    ], Comment.prototype, "userId");
    __decorate([
        (0, mongoose_1.Prop)({
            type: mongoose_2.Types.ObjectId,
            required: true
        })
    ], Comment.prototype, "postId");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true
        })
    ], Comment.prototype, "userLogin");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Comment.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Comment.prototype, "updatedAt");
    Comment = __decorate([
        (0, mongoose_1.Schema)({ timestamps: true })
    ], Comment);
    return Comment;
}());
exports.Comment = Comment;
exports.commentSchema = mongoose_1.SchemaFactory.createForClass(Comment);
exports.commentSchema.static('createCommentEntity', Comment.createCommentEntity);
exports.commentSchema.method('updateComment', Comment.prototype.updateComment);
