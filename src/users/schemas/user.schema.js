"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.userSchema = exports.User = void 0;
var uuid_1 = require("uuid");
var date_fns_1 = require("date-fns");
var mongoose_1 = require("@nestjs/mongoose");
var constants_1 = require("../../common/constants");
var error_messages_1 = require("../../common/error-messages");
var email_confirmation_schema_1 = require("./email-confirmation.schema");
var error_messages_2 = require("../../common/error-messages");
var MIN_LOGIN_LENGTH = constants_1.usersConstants.MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH = constants_1.usersConstants.MAX_LOGIN_LENGTH, LOGIN_REG_EXP = constants_1.usersConstants.LOGIN_REG_EXP, EMAIL_REG_EXP = constants_1.usersConstants.EMAIL_REG_EXP;
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.confirmUserRegistration = function (user) {
        user.emailConfirmation.isConfirmed = true;
        return user;
    };
    User.prototype.updateConfirmationCode = function (user) {
        user.emailConfirmation.confirmationCode = (0, uuid_1.v4)();
        user.emailConfirmation.expirationDate = (0, date_fns_1.add)(new Date(), { hours: 1 });
        return user;
    };
    User.prototype.updatePasswordRecoveryCode = function (user) {
        user.passwordRecoveryCode = (0, uuid_1.v4)();
        return user;
    };
    User.prototype.updatePassword = function (user, hash, code) {
        user.passwordHash = hash;
        user.passwordRecoveryCode = code;
        return user;
    };
    User.createUserEntity = function (createUserDto, passwordHash, isConfirmed, UserModel) {
        if (isConfirmed === void 0) { isConfirmed = false; }
        return __awaiter(this, void 0, void 0, function () {
            var login, email, password, existingUserWithLogin, existingUserWithEmail, emailConfirmation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        login = createUserDto.login, email = createUserDto.email, password = createUserDto.password;
                        return [4 /*yield*/, UserModel.findOne({ login: login })];
                    case 1:
                        existingUserWithLogin = _a.sent();
                        return [4 /*yield*/, UserModel.findOne({ email: email })];
                    case 2:
                        existingUserWithEmail = _a.sent();
                        if (existingUserWithLogin)
                            (0, error_messages_2.generateExistingFieldError)('user', 'login');
                        if (existingUserWithEmail)
                            (0, error_messages_2.generateExistingFieldError)('user', 'email');
                        emailConfirmation = {
                            confirmationCode: (0, uuid_1.v4)(),
                            expirationDate: (0, date_fns_1.add)(new Date(), { hours: 1 }),
                            isConfirmed: isConfirmed
                        };
                        return [2 /*return*/, new UserModel({
                                login: login,
                                email: email,
                                password: password,
                                passwordHash: passwordHash,
                                isConfirmed: isConfirmed,
                                emailConfirmation: emailConfirmation
                            })];
                }
            });
        });
    };
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            minlength: [
                MIN_LOGIN_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('login', MIN_LOGIN_LENGTH, 'min'),
            ],
            maxlength: [
                MAX_LOGIN_LENGTH,
                (0, error_messages_1.generateLengthErrorMessage)('login', MAX_LOGIN_LENGTH, 'max'),
            ],
            validate: [LOGIN_REG_EXP, (0, error_messages_1.generateRegExpError)('login', LOGIN_REG_EXP)]
        })
    ], User.prototype, "login");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true,
            validate: [EMAIL_REG_EXP, (0, error_messages_1.generateRegExpError)('email', EMAIL_REG_EXP)]
        })
    ], User.prototype, "email");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true
        })
    ], User.prototype, "passwordHash");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            "default": null
        })
    ], User.prototype, "passwordRecoveryCode");
    __decorate([
        (0, mongoose_1.Prop)({
            required: true,
            type: email_confirmation_schema_1.EmailConfirmationSchema
        })
    ], User.prototype, "emailConfirmation");
    __decorate([
        (0, mongoose_1.Prop)()
    ], User.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)()
    ], User.prototype, "updatedAt");
    User = __decorate([
        (0, mongoose_1.Schema)({ timestamps: true })
    ], User);
    return User;
}());
exports.User = User;
exports.userSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.userSchema.static('createUserEntity', User.createUserEntity);
exports.userSchema.methods = {
    confirmUserRegistration: User.prototype.confirmUserRegistration,
    updateConfirmationCode: User.prototype.updateConfirmationCode,
    updatePasswordRecoveryCode: User.prototype.updatePasswordRecoveryCode,
    updatePassword: User.prototype.updatePassword
};
