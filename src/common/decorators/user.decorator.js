"use strict";
exports.__esModule = true;
exports.User = void 0;
var common_1 = require("@nestjs/common");
exports.User = (0, common_1.createParamDecorator)(function (data, ctx) {
    var _a;
    var request = ctx.switchToHttp().getRequest();
    var user = (_a = request === null || request === void 0 ? void 0 : request.context) === null || _a === void 0 ? void 0 : _a.user;
    return data ? user === null || user === void 0 ? void 0 : user[data] : user;
});
