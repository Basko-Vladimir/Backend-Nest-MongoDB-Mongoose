"use strict";
exports.__esModule = true;
exports.generateMissedPropError = exports.generateExistingFieldError = exports.generateRegExpError = exports.generateLengthRangeErrorMessage = exports.generateLengthErrorMessage = exports.INTERNAL_SERVER_ERROR = exports.authErrorsMessages = exports.confirmationCodeErrorMessages = exports.emailErrorMessages = exports.DATE_ERROR_MESSAGE = void 0;
var utils_1 = require("./utils");
exports.DATE_ERROR_MESSAGE = 'Can not create an entity with a past Date';
exports.emailErrorMessages = {
    MISSING_USER_WITH_EMAIL_ERROR: "User with such email hasn't been found!",
    EMAIL_SERVICE_ERROR_MESSAGE: 'Some error with email service, try later!',
    CONFIRMED_EMAIL_ERROR: 'Provided email was confirmed already!`'
};
exports.confirmationCodeErrorMessages = {
    INVALID_CONFIRMATION_CODE: 'Confirmation code is not valid!',
    EXISTED_CONFIRMATION_CODE: 'Confirmation code is confirmed already!'
};
exports.authErrorsMessages = {
    INCORRECT_LOGIN_OR_PASSWORD: 'Incorrect Login or Password!',
    INVALID_TOKEN: 'Invalid token!'
};
exports.INTERNAL_SERVER_ERROR = 'Something went wrong...';
var generateLengthErrorMessage = function (fieldName, value, type) {
    fieldName = (0, utils_1.makeCapitalizeString)(fieldName);
    switch (type) {
        case 'min': {
            return "".concat(fieldName, " length can't be less than ").concat(value, " symbol!");
        }
        case 'max': {
            return "".concat(fieldName, " length can't be more than ").concat(value, " symbol!");
        }
        default:
            throw new Error('Incorrect input parameters for generateLengthErrorMessage function');
    }
};
exports.generateLengthErrorMessage = generateLengthErrorMessage;
var generateLengthRangeErrorMessage = function (fieldName, minValue, maxValue) {
    return "".concat((0, utils_1.makeCapitalizeString)(fieldName), " should be from ").concat(minValue, " to ").concat(maxValue, " chars");
};
exports.generateLengthRangeErrorMessage = generateLengthRangeErrorMessage;
var generateRegExpError = function (fieldName, regExp) {
    return "".concat((0, utils_1.makeCapitalizeString)(fieldName), " doesn't match to pattern ").concat(regExp);
};
exports.generateRegExpError = generateRegExpError;
var generateExistingFieldError = function (entity, field) {
    var message = "".concat((0, utils_1.makeCapitalizeString)(entity), "\n   with such ").concat(field, " already exists.");
    (0, utils_1.generateCustomBadRequestException)(message, field);
};
exports.generateExistingFieldError = generateExistingFieldError;
var generateMissedPropError = function (fieldName) {
    return "You didn't provide '".concat(fieldName.toLowerCase(), "' field");
};
exports.generateMissedPropError = generateMissedPropError;
