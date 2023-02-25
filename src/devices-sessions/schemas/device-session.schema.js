"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.deviceSessionSchema = exports.DeviceSession = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var DeviceSession = /** @class */ (function () {
    function DeviceSession() {
    }
    DeviceSession.createDeviceSessionEntity = function (deviceSessionData, DeviceSessionModel) {
        return new DeviceSessionModel(deviceSessionData);
    };
    DeviceSession.prototype.updateDeviceSessionData = function (issuedAt, currentDeviceSession) {
        currentDeviceSession.issuedAt = issuedAt;
        return currentDeviceSession;
    };
    __decorate([
        (0, mongoose_1.Prop)({
            type: Number,
            required: true
        })
    ], DeviceSession.prototype, "issuedAt");
    __decorate([
        (0, mongoose_1.Prop)({
            type: Number,
            required: true
        })
    ], DeviceSession.prototype, "expiredDate");
    __decorate([
        (0, mongoose_1.Prop)({
            type: mongoose_2.Types.ObjectId,
            required: true,
            trim: true
        })
    ], DeviceSession.prototype, "deviceId");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true
        })
    ], DeviceSession.prototype, "deviceName");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true,
            trim: true
        })
    ], DeviceSession.prototype, "ip");
    __decorate([
        (0, mongoose_1.Prop)({
            type: mongoose_2.Types.ObjectId,
            required: true
        })
    ], DeviceSession.prototype, "userId");
    __decorate([
        (0, mongoose_1.Prop)()
    ], DeviceSession.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)()
    ], DeviceSession.prototype, "updatedAt");
    DeviceSession = __decorate([
        (0, mongoose_1.Schema)({ timestamps: true })
    ], DeviceSession);
    return DeviceSession;
}());
exports.DeviceSession = DeviceSession;
exports.deviceSessionSchema = mongoose_1.SchemaFactory.createForClass(DeviceSession);
exports.deviceSessionSchema.static('createDeviceSessionEntity', DeviceSession.createDeviceSessionEntity);
exports.deviceSessionSchema.method('updateDeviceSessionData', DeviceSession.prototype.updateDeviceSessionData);
