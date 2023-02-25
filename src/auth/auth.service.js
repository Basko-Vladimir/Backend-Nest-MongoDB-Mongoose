"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AuthService = void 0;
var bcrypt = require("bcrypt");
var uuid_1 = require("uuid");
var mongoose_1 = require("mongoose");
var common_1 = require("@nestjs/common");
var mongoose_2 = require("@nestjs/mongoose");
var user_schema_1 = require("../users/schemas/user.schema");
var constants_1 = require("../common/constants");
var AuthService = /** @class */ (function () {
    function AuthService(usersRepository, emailManager, jwtService, devicesSessionsService, UserModel) {
        this.usersRepository = usersRepository;
        this.emailManager = emailManager;
        this.jwtService = jwtService;
        this.devicesSessionsService = devicesSessionsService;
        this.UserModel = UserModel;
    }
    AuthService_1 = AuthService;
    AuthService.prototype.registerUser = function (createUserDto, isConfirmedByDefault) {
        return __awaiter(this, void 0, void 0, function () {
            var password, passwordHash, createdUser, savedUser, savedUserId, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = createUserDto.password;
                        return [4 /*yield*/, AuthService_1.generatePasswordHash(password)];
                    case 1:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, this.UserModel.createUserEntity(createUserDto, passwordHash, isConfirmedByDefault, this.UserModel)];
                    case 2:
                        createdUser = _a.sent();
                        return [4 /*yield*/, this.usersRepository.saveUser(createdUser)];
                    case 3:
                        savedUser = _a.sent();
                        savedUserId = String(savedUser._id);
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 8]);
                        return [4 /*yield*/, this.emailManager.sendRegistrationEmail(createdUser)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, savedUserId];
                    case 6:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.usersRepository.deleteUser(savedUserId)];
                    case 7:
                        _a.sent();
                        throw new Error(error_1);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.confirmRegistration = function (confirmRegistrationDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmedUser = user.confirmUserRegistration(user);
                        return [4 /*yield*/, this.usersRepository.saveUser(confirmedUser)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.resendRegistrationEmail = function (emailDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            var changedUser, savedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        changedUser = user.updateConfirmationCode(user);
                        return [4 /*yield*/, this.usersRepository.saveUser(changedUser)];
                    case 1:
                        savedUser = _a.sent();
                        return [4 /*yield*/, this.emailManager.sendRegistrationEmail(savedUser)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.login = function (loginUserDto, ip, userAgent) {
        return __awaiter(this, void 0, void 0, function () {
            var loginOrEmail, password, userId, deviceId, _a, accessToken, refreshToken, refreshTokenPayload, deviceSessionData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loginOrEmail = loginUserDto.loginOrEmail, password = loginUserDto.password;
                        return [4 /*yield*/, this.checkCredentials(loginOrEmail, password)];
                    case 1:
                        userId = _b.sent();
                        if (!userId)
                            throw new common_1.UnauthorizedException();
                        deviceId = (0, uuid_1.v4)();
                        return [4 /*yield*/, this.createNewTokensPair({ userId: userId }, constants_1.ACCESS_TOKEN_LIFE_TIME, { userId: userId, deviceId: deviceId }, constants_1.REFRESH_TOKEN_LIFE_TIME)];
                    case 2:
                        _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                        return [4 /*yield*/, this.jwtService.getTokenPayload(refreshToken)];
                    case 3:
                        refreshTokenPayload = _b.sent();
                        if (!refreshTokenPayload) {
                            throw new Error("Couldn't get payload from refresh token!");
                        }
                        deviceSessionData = {
                            issuedAt: refreshTokenPayload.iat,
                            expiredDate: refreshTokenPayload.exp,
                            deviceId: refreshTokenPayload.deviceId,
                            deviceName: userAgent,
                            ip: ip,
                            userId: new mongoose_1.Types.ObjectId(userId)
                        };
                        return [4 /*yield*/, this.devicesSessionsService.createDeviceSession(deviceSessionData)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                }
            });
        });
    };
    AuthService.prototype.recoverPassword = function (emailDto) {
        return __awaiter(this, void 0, void 0, function () {
            var email, targetUser, updatedUser, savedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = emailDto.email;
                        return [4 /*yield*/, this.usersRepository.findUserByFilter({ email: email })];
                    case 1:
                        targetUser = _a.sent();
                        updatedUser = targetUser.updatePasswordRecoveryCode(targetUser);
                        return [4 /*yield*/, this.usersRepository.saveUser(updatedUser)];
                    case 2:
                        savedUser = _a.sent();
                        try {
                            return [2 /*return*/, this.emailManager.recoverPassword(email, savedUser.passwordRecoveryCode)];
                        }
                        catch (error) {
                            throw new Error(error);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.setNewPassword = function (setNewPasswordDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            var newPassword, recoveryCode, newHash, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newPassword = setNewPasswordDto.newPassword, recoveryCode = setNewPasswordDto.recoveryCode;
                        return [4 /*yield*/, AuthService_1.generatePasswordHash(newPassword)];
                    case 1:
                        newHash = _a.sent();
                        return [4 /*yield*/, user.updatePassword(user, newHash, recoveryCode)];
                    case 2:
                        updatedUser = _a.sent();
                        return [4 /*yield*/, this.usersRepository.saveUser(updatedUser)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.refreshTokens = function (userId, session) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accessToken, refreshToken, refreshTokenPayload;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createNewTokensPair({ userId: userId }, constants_1.ACCESS_TOKEN_LIFE_TIME, { userId: userId, deviceId: session.deviceId }, constants_1.REFRESH_TOKEN_LIFE_TIME)];
                    case 1:
                        _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                        return [4 /*yield*/, this.jwtService.getTokenPayload(refreshToken)];
                    case 2:
                        refreshTokenPayload = _b.sent();
                        if (!refreshTokenPayload) {
                            throw new Error("Couldn't get payload from refresh token!");
                        }
                        return [4 /*yield*/, this.devicesSessionsService.updateDeviceSessionData(session, refreshTokenPayload.iat)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                }
            });
        });
    };
    AuthService.prototype.logout = function (deviceSessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.devicesSessionsService.deleteDeviceSessionById(deviceSessionId)];
            });
        });
    };
    AuthService.prototype.checkCredentials = function (loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isMatchedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findUserByFilter({
                            login: loginOrEmail,
                            email: loginOrEmail
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, bcrypt.compare(password, user.passwordHash)];
                    case 2:
                        isMatchedUser = _a.sent();
                        return [2 /*return*/, isMatchedUser ? String(user._id) : null];
                }
            });
        });
    };
    AuthService.generatePasswordHash = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordSalt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.genSalt(10)];
                    case 1:
                        passwordSalt = _a.sent();
                        return [2 /*return*/, bcrypt.hash(password, passwordSalt)];
                }
            });
        });
    };
    AuthService.prototype.createNewTokensPair = function (accessTokenPayload, accessTokenLifetime, refreshTokenPayload, refreshTokenLifetime) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jwtService.createJWT(__assign(__assign({}, accessTokenPayload), { iat: Date.now() }), accessTokenLifetime)];
                    case 1:
                        accessToken = _a.sent();
                        return [4 /*yield*/, this.jwtService.createJWT(__assign(__assign({}, refreshTokenPayload), { iat: Date.now() }), refreshTokenLifetime)];
                    case 2:
                        refreshToken = _a.sent();
                        return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                }
            });
        });
    };
    var AuthService_1;
    AuthService = AuthService_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(4, (0, mongoose_2.InjectModel)(user_schema_1.User.name))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
