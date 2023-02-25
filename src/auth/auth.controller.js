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
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var registration_confirmation_guard_1 = require("../common/guards/registration-confirmation.guard");
var user_decorator_1 = require("../common/decorators/user.decorator");
var resending_registration_email_guard_1 = require("../common/guards/resending-registration-email.guard");
var password_recovery_code_guard_1 = require("../common/guards/password-recovery-code.guard");
var refresh_token_guard_1 = require("../common/guards/refresh-token.guard");
var session_decorator_1 = require("../common/decorators/session.decorator");
var clients_requests_guard_1 = require("../common/guards/clients-requests.guard");
var AuthController = /** @class */ (function () {
    function AuthController(authService) {
        this.authService = authService;
    }
    AuthController.prototype.authMe = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        userId: String(user._id),
                        email: user.email,
                        login: user.login
                    }];
            });
        });
    };
    AuthController.prototype.registration = function (createUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.registerUser(createUserDto)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.confirmRegistration = function (confirmRegistrationDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.confirmRegistration(confirmRegistrationDto, user)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.resendRegistrationEmail = function (emailDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.authService.resendRegistrationEmail(emailDto, user)];
            });
        });
    };
    AuthController.prototype.login = function (loginUserDto, response, request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accessToken, refreshToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.authService.login(loginUserDto, request.ip, request.headers['user-agent'])];
                    case 1:
                        _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                        response.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: true
                        });
                        return [2 /*return*/, { accessToken: accessToken }];
                }
            });
        });
    };
    AuthController.prototype.recoverPassword = function (emailDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.authService.recoverPassword(emailDto)];
            });
        });
    };
    AuthController.prototype.setNewPassword = function (setNewPasswordDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.authService.setNewPassword(setNewPasswordDto, user)];
            });
        });
    };
    AuthController.prototype.refreshTokens = function (user, session, response) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, accessToken, refreshToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = String(user._id);
                        return [4 /*yield*/, this.authService.refreshTokens(userId, session)];
                    case 1:
                        _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                        response.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: true
                        });
                        return [2 /*return*/, { accessToken: accessToken }];
                }
            });
        });
    };
    AuthController.prototype.logout = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.logout(String(session._id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('me'),
        (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
        __param(0, (0, user_decorator_1.User)())
    ], AuthController.prototype, "authMe");
    __decorate([
        (0, common_1.Post)('registration'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(clients_requests_guard_1.ClientsRequestsGuard),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "registration");
    __decorate([
        (0, common_1.Post)('registration-confirmation'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(registration_confirmation_guard_1.RegistrationConfirmationGuard, clients_requests_guard_1.ClientsRequestsGuard),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, user_decorator_1.User)())
    ], AuthController.prototype, "confirmRegistration");
    __decorate([
        (0, common_1.Post)('registration-email-resending'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(resending_registration_email_guard_1.ResendingRegistrationEmailGuard, clients_requests_guard_1.ClientsRequestsGuard),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, user_decorator_1.User)())
    ], AuthController.prototype, "resendRegistrationEmail");
    __decorate([
        (0, common_1.Post)('login'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, common_1.UseGuards)(clients_requests_guard_1.ClientsRequestsGuard),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)({ passthrough: true })),
        __param(2, (0, common_1.Req)())
    ], AuthController.prototype, "login");
    __decorate([
        (0, common_1.Post)('password-recovery'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(clients_requests_guard_1.ClientsRequestsGuard),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "recoverPassword");
    __decorate([
        (0, common_1.Post)('new-password'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(password_recovery_code_guard_1.PasswordRecoveryCodeGuard, clients_requests_guard_1.ClientsRequestsGuard),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, user_decorator_1.User)())
    ], AuthController.prototype, "setNewPassword");
    __decorate([
        (0, common_1.Post)('refresh-token'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
        __param(0, (0, user_decorator_1.User)()),
        __param(1, (0, session_decorator_1.Session)()),
        __param(2, (0, common_1.Res)({ passthrough: true }))
    ], AuthController.prototype, "refreshTokens");
    __decorate([
        (0, common_1.Post)('logout'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
        __param(0, (0, session_decorator_1.Session)())
    ], AuthController.prototype, "logout");
    AuthController = __decorate([
        (0, common_1.Controller)('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
