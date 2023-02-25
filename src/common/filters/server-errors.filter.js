"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ServerErrorsFilter = void 0;
var common_1 = require("@nestjs/common");
var error_messages_1 = require("../error-messages");
var ServerErrorsFilter = /** @class */ (function () {
    function ServerErrorsFilter() {
    }
    ServerErrorsFilter.prototype["catch"] = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var result = error_messages_1.INTERNAL_SERVER_ERROR;
        // if (process.env.NODE_ENV !== 'production') {
        result = {
            error: exception.toString(),
            stack: exception.stack
        };
        // }
        response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send(result);
    };
    ServerErrorsFilter = __decorate([
        (0, common_1.Catch)(Error)
    ], ServerErrorsFilter);
    return ServerErrorsFilter;
}());
exports.ServerErrorsFilter = ServerErrorsFilter;
