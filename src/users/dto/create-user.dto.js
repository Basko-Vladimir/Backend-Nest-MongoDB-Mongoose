"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateUserDto = void 0;
var class_validator_1 = require("class-validator");
var constants_1 = require("../../common/constants");
var is_not_empty_content_validator_1 = require("../../common/validators/is-not-empty-content.validator");
var email_dto_1 = require("../../auth/dto/email.dto");
var MIN_LOGIN_LENGTH = constants_1.usersConstants.MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH = constants_1.usersConstants.MAX_LOGIN_LENGTH, LOGIN_REG_EXP = constants_1.usersConstants.LOGIN_REG_EXP, MIN_PASSWORD_LENGTH = constants_1.usersConstants.MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH = constants_1.usersConstants.MAX_PASSWORD_LENGTH;
var CreateUserDto = /** @class */ (function (_super) {
    __extends(CreateUserDto, _super);
    function CreateUserDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.Length)(MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH),
        (0, class_validator_1.Matches)(LOGIN_REG_EXP),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsString)()
    ], CreateUserDto.prototype, "login");
    __decorate([
        (0, class_validator_1.Length)(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH),
        (0, is_not_empty_content_validator_1.IsNotEmptyContent)(),
        (0, class_validator_1.IsString)()
    ], CreateUserDto.prototype, "password");
    return CreateUserDto;
}(email_dto_1.EmailDto));
exports.CreateUserDto = CreateUserDto;
