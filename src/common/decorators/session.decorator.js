"use strict";
exports.__esModule = true;
exports.Session = void 0;
var common_1 = require("@nestjs/common");
exports.Session = (0, common_1.createParamDecorator)(function (data, ctx) {
    var _a;
    var request = ctx.switchToHttp().getRequest();
    var session = (_a = request === null || request === void 0 ? void 0 : request.context) === null || _a === void 0 ? void 0 : _a.session;
    return data ? session === null || session === void 0 ? void 0 : session[data] : session;
});
