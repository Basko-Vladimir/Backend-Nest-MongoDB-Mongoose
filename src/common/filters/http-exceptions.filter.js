"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HttpExceptionsFilter = void 0;
var common_1 = require("@nestjs/common");
var HttpExceptionsFilter = /** @class */ (function () {
    function HttpExceptionsFilter() {
    }
    HttpExceptionsFilter.prototype["catch"] = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var errorStatus = exception.getStatus();
        var errorResponseBody = exception.getResponse();
        if (errorStatus === common_1.HttpStatus.BAD_REQUEST) {
            var result = { errorsMessages: errorResponseBody.message };
            response.status(errorStatus).send(result);
            return;
        }
        response.status(errorStatus).json({
            statusCode: errorStatus,
            message: errorResponseBody.message
        });
    };
    HttpExceptionsFilter = __decorate([
        (0, common_1.Catch)(common_1.HttpException)
    ], HttpExceptionsFilter);
    return HttpExceptionsFilter;
}());
exports.HttpExceptionsFilter = HttpExceptionsFilter;
