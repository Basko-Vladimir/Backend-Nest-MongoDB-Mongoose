"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.blogSchema = exports.Blog = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var constants_1 = require("../../common/constants");
var error_messages_1 = require("../../common/error-messages");
var MAX_NAME_LENGTH = constants_1.blogsConstants.MAX_NAME_LENGTH, MAX_WEBSITE_URL_LENGTH = constants_1.blogsConstants.MAX_WEBSITE_URL_LENGTH, MAX_DESCRIPTION_LENGTH = constants_1.blogsConstants.MAX_DESCRIPTION_LENGTH, WEBSITE_URL_REG_EXP = constants_1.blogsConstants.WEBSITE_URL_REG_EXP;
var Blog = /** @class */ (function () {
    function Blog() {
    }
    Blog.prototype.updateBlog = function (updatingData, currentBlog) {
        var name = updatingData.name, websiteUrl = updatingData.websiteUrl, description = updatingData.description;
        currentBlog.name = name;
        currentBlog.websiteUrl = websiteUrl;
        currentBlog.description = description;
        return currentBlog;
    };
    Blog.createBlogEntity = function (blogData, BlogModel) {
        return new BlogModel(blogData);
    };
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            minlength: [
                constants_1.MIN_STRINGS_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('name', constants_1.MIN_STRINGS_LENGTH, 'min'),
            ],
            maxlength: [
                MAX_NAME_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('name', MAX_NAME_LENGTH, 'max'),
            ]
        })
    ], Blog.prototype, "name");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            maxlength: [
                MAX_WEBSITE_URL_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('websiteUrl', MAX_WEBSITE_URL_LENGTH, 'max'),
            ],
            validate: [
                WEBSITE_URL_REG_EXP,
                (0, error_messages_1.generateRegExpError)('websiteUrl', WEBSITE_URL_REG_EXP),
            ]
        })
    ], Blog.prototype, "websiteUrl");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            minlength: [
                constants_1.MIN_STRINGS_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('description', constants_1.MIN_STRINGS_LENGTH, 'min'),
            ],
            maxlength: [
                MAX_DESCRIPTION_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('description', MAX_DESCRIPTION_LENGTH, 'max'),
            ]
        })
    ], Blog.prototype, "description");
    __decorate([
        (0, mongoose_1.Prop)({
            type: Boolean,
            "default": false
        })
    ], Blog.prototype, "isMembership");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Blog.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Blog.prototype, "updatedAt");
    Blog = __decorate([
        (0, mongoose_1.Schema)({ timestamps: true })
    ], Blog);
    return Blog;
}());
exports.Blog = Blog;
exports.blogSchema = mongoose_1.SchemaFactory.createForClass(Blog);
exports.blogSchema.method('updateBlog', Blog.prototype.updateBlog);
exports.blogSchema.static('createBlogEntity', Blog.createBlogEntity);
