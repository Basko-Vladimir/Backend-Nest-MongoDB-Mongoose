"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.postSchema = exports.Post = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var error_messages_1 = require("../../common/error-messages");
var constants_1 = require("../../common/constants");
var MAX_TITLE_LENGTH = constants_1.postsConstants.MAX_TITLE_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH = constants_1.postsConstants.MAX_SHORT_DESCRIPTION_LENGTH, MAX_CONTENT_LENGTH = constants_1.postsConstants.MAX_CONTENT_LENGTH;
var Post = /** @class */ (function () {
    function Post() {
    }
    Post.prototype.updatePost = function (updatingData, currentPost) {
        var title = updatingData.title, content = updatingData.content, shortDescription = updatingData.shortDescription, blogId = updatingData.blogId;
        currentPost.title = title;
        currentPost.content = content;
        currentPost.shortDescription = shortDescription;
        currentPost.blogId = new mongoose_2.Types.ObjectId(blogId);
        return currentPost;
    };
    Post.createPostEntity = function (postData, blogName, PostModel) {
        return new PostModel(__assign(__assign({}, postData), { blogName: blogName }));
    };
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            minlength: [
                constants_1.MIN_STRINGS_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('title', constants_1.MIN_STRINGS_LENGTH, 'min'),
            ],
            maxlength: [
                MAX_TITLE_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('title', MAX_TITLE_LENGTH, 'max'),
            ]
        })
    ], Post.prototype, "title");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            minlength: [
                constants_1.MIN_STRINGS_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('shortDescription', constants_1.MIN_STRINGS_LENGTH, 'min'),
            ],
            maxlength: [
                MAX_SHORT_DESCRIPTION_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('shortDescription', MAX_SHORT_DESCRIPTION_LENGTH, 'max'),
            ]
        })
    ], Post.prototype, "shortDescription");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            minlength: [
                constants_1.MIN_STRINGS_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('content', constants_1.MIN_STRINGS_LENGTH, 'min'),
            ],
            maxlength: [
                MAX_CONTENT_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('content', MAX_CONTENT_LENGTH, 'max'),
            ]
        })
    ], Post.prototype, "content");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true
        })
    ], Post.prototype, "blogName");
    __decorate([
        (0, mongoose_1.Prop)({
            type: mongoose_2.Types.ObjectId,
            required: true
        })
    ], Post.prototype, "blogId");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Post.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Post.prototype, "updatedAt");
    Post = __decorate([
        (0, mongoose_1.Schema)({ timestamps: true })
    ], Post);
    return Post;
}());
exports.Post = Post;
exports.postSchema = mongoose_1.SchemaFactory.createForClass(Post);
exports.postSchema.method('updatePost', Post.prototype.updatePost);
exports.postSchema.static('createPostEntity', Post.createPostEntity);
