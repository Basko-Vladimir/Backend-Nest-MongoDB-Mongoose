"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateBlogDto = void 0;
var class_validator_1 = require("class-validator");
var constants_1 = require("../../common/constants");
var is_not_empty_content_validator_1 = require("../../common/validators/is-not-empty-content.validator");
var MAX_NAME_LENGTH = constants_1.blogsConstants.MAX_NAME_LENGTH, MAX_WEBSITE_URL_LENGTH = constants_1.blogsConstants.MAX_WEBSITE_URL_LENGTH, MAX_DESCRIPTION_LENGTH = constants_1.blogsConstants.MAX_DESCRIPTION_LENGTH, WEBSITE_URL_REG_EXP = constants_1.blogsConstants.WEBSITE_URL_REG_EXP;
var UpdateBlogDto = /** @class */ (function () {
    function UpdateBlogDto() {
    }
    __decorate([
        (0, class_validator_1.Length)(constants_1.MIN_STRINGS_LENGTH, MAX_NAME_LENGTH),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsString)()
    ], UpdateBlogDto.prototype, "name");
    __decorate([
        (0, class_validator_1.MaxLength)(MAX_WEBSITE_URL_LENGTH),
        (0, class_validator_1.Matches)(WEBSITE_URL_REG_EXP),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsString)()
    ], UpdateBlogDto.prototype, "websiteUrl");
    __decorate([
        (0, class_validator_1.Length)(constants_1.MIN_STRINGS_LENGTH, MAX_DESCRIPTION_LENGTH),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsString)()
    ], UpdateBlogDto.prototype, "description");
    return UpdateBlogDto;
}());
exports.UpdateBlogDto = UpdateBlogDto;
