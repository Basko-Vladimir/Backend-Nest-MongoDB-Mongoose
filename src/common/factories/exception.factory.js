"use strict";
exports.__esModule = true;
exports.exceptionFactory = void 0;
var common_1 = require("@nestjs/common");
var exceptionFactory = function (errors) {
    var errorsMessages = errors
        .map(function (error) {
        return Object.keys(error.constraints).map(function (cKey) {
            return {
                message: error.constraints[cKey],
                field: error.property
            };
        });
    })
        .flat();
    throw new common_1.BadRequestException(errorsMessages);
};
exports.exceptionFactory = exceptionFactory;
