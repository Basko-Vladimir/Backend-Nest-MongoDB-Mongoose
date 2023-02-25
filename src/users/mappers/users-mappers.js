"use strict";
exports.__esModule = true;
exports.mapDbUserToUserOutputModel = void 0;
var mapDbUserToUserOutputModel = function (user) { return ({
    id: String(user._id),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString()
}); };
exports.mapDbUserToUserOutputModel = mapDbUserToUserOutputModel;
