"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SetNewPasswordDto = void 0;
var class_validator_1 = require("class-validator");
var is_not_empty_content_validator_1 = require("../../common/validators/is-not-empty-content.validator");
var constants_1 = require("../../common/constants");
var MIN_PASSWORD_LENGTH = constants_1.usersConstants.MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH = constants_1.usersConstants.MAX_PASSWORD_LENGTH;
var SetNewPasswordDto = /** @class */ (function () {
    function SetNewPasswordDto() {
    }
    __decorate([
        (0, class_validator_1.Length)(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsString)()
    ], SetNewPasswordDto.prototype, "newPassword");
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsString)()
    ], SetNewPasswordDto.prototype, "recoveryCode");
    return SetNewPasswordDto;
}());
exports.SetNewPasswordDto = SetNewPasswordDto;
