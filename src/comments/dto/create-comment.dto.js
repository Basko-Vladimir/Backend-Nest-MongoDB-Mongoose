"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateCommentDto = void 0;
var class_validator_1 = require("class-validator");
var constants_1 = require("../../common/constants");
var is_not_empty_content_validator_1 = require("../../common/validators/is-not-empty-content.validator");
var is_exist_entity_validator_1 = require("../../common/validators/is-exist-entity.validator");
var MIN_CONTENT_LENGTH = constants_1.commentsConstants.MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH = constants_1.commentsConstants.MAX_CONTENT_LENGTH;
var MIN_LOGIN_LENGTH = constants_1.usersConstants.MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH = constants_1.usersConstants.MAX_LOGIN_LENGTH, LOGIN_REG_EXP = constants_1.usersConstants.LOGIN_REG_EXP;
var CreateCommentDto = /** @class */ (function () {
    function CreateCommentDto() {
    }
    __decorate([
        (0, class_validator_1.Length)(MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsString)()
    ], CreateCommentDto.prototype, "content");
    __decorate([
        (0, is_exist_entity_validator_1.IsExistEntity)(),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsMongoId)()
    ], CreateCommentDto.prototype, "postId");
    __decorate([
        (0, class_validator_1.IsMongoId)(),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsNotEmpty)()
    ], CreateCommentDto.prototype, "userId");
    __decorate([
        (0, class_validator_1.Length)(MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH),
        (0, class_validator_1.Matches)(LOGIN_REG_EXP),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsString)()
    ], CreateCommentDto.prototype, "userLogin");
    return CreateCommentDto;
}());
exports.CreateCommentDto = CreateCommentDto;
