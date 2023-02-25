"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.DevicesSessionsController = void 0;
var common_1 = require("@nestjs/common");
var user_decorator_1 = require("../common/decorators/user.decorator");
var refresh_token_guard_1 = require("../common/guards/refresh-token.guard");
var session_decorator_1 = require("../common/decorators/session.decorator");
var DevicesSessionsController = /** @class */ (function () {
    function DevicesSessionsController(devicesSessionsService) {
        this.devicesSessionsService = devicesSessionsService;
    }
    DevicesSessionsController.prototype.getAllActiveDevicesSessions = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.devicesSessionsService.getAllActiveDevicesSessions({
                        userId: user._id
                    })];
            });
        });
    };
    DevicesSessionsController.prototype.deleteAllDevicesSessionsExceptCurrent = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devicesSessionsService.deleteAllDevicesSessionsExceptCurrent(session._id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevicesSessionsController.prototype.deleteDeviceSessionByDeviceId = function (deviceId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var targetDeviceSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devicesSessionsService.findDeviceSessionByFilter({ deviceId: deviceId })];
                    case 1:
                        targetDeviceSession = _a.sent();
                        if (!targetDeviceSession)
                            throw new common_1.NotFoundException();
                        if (String(targetDeviceSession.userId) !== String(user._id)) {
                            throw new common_1.ForbiddenException();
                        }
                        return [4 /*yield*/, this.devicesSessionsService.deleteDeviceSessionById(String(targetDeviceSession._id))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('devices'),
        (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
        __param(0, (0, user_decorator_1.User)())
    ], DevicesSessionsController.prototype, "getAllActiveDevicesSessions");
    __decorate([
        (0, common_1.Delete)('devices'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
        __param(0, (0, session_decorator_1.Session)())
    ], DevicesSessionsController.prototype, "deleteAllDevicesSessionsExceptCurrent");
    __decorate([
        (0, common_1.Delete)('devices/:deviceId'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
        __param(0, (0, common_1.Param)('deviceId')),
        __param(1, (0, user_decorator_1.User)())
    ], DevicesSessionsController.prototype, "deleteDeviceSessionByDeviceId");
    DevicesSessionsController = __decorate([
        (0, common_1.Controller)('security')
    ], DevicesSessionsController);
    return DevicesSessionsController;
}());
exports.DevicesSessionsController = DevicesSessionsController;
