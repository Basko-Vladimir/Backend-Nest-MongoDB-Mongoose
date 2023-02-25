"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.IsNotEmptyContent = void 0;
var class_validator_1 = require("class-validator");
var IsNotEmptyContentValidator = /** @class */ (function () {
    function IsNotEmptyContentValidator() {
    }
    IsNotEmptyContentValidator.prototype.validate = function (text) {
        return typeof text === 'string' && text.trim() !== '';
    };
    IsNotEmptyContentValidator.prototype.defaultMessage = function (args) {
        return "Field \"".concat(args.property, "\" can not be empty string!");
    };
    IsNotEmptyContentValidator = __decorate([
        (0, class_validator_1.ValidatorConstraint)({ name: 'IsNotEmptyString', async: false })
    ], IsNotEmptyContentValidator);
    return IsNotEmptyContentValidator;
}());
function IsNotEmptyContent(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotEmptyContentValidator
        });
    };
}
exports.IsNotEmptyContent = IsNotEmptyContent;
