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
exports.__esModule = true;
exports.clientRequestSchema = exports.ClientRequest = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var ClientRequest = /** @class */ (function () {
    function ClientRequest() {
    }
    ClientRequest.createClientEntity = function (clientRequestData, ClientRequestModel) {
        return new ClientRequestModel(__assign(__assign({}, clientRequestData), { createTimeStamp: Date.now() }));
    };
    ClientRequest.prototype.updateClientRequest = function (currentClientRequest) {
        currentClientRequest.createTimeStamp = Date.now();
        return currentClientRequest;
    };
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true
        })
    ], ClientRequest.prototype, "endpoint");
    __decorate([
        (0, mongoose_1.Prop)({
            type: String,
            required: true
        })
    ], ClientRequest.prototype, "ip");
    __decorate([
        (0, mongoose_1.Prop)({
            type: Number,
            required: true
        })
    ], ClientRequest.prototype, "createTimeStamp");
    __decorate([
        (0, mongoose_1.Prop)()
    ], ClientRequest.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)()
    ], ClientRequest.prototype, "updatedAt");
    ClientRequest = __decorate([
        (0, mongoose_1.Schema)({ timestamps: true })
    ], ClientRequest);
    return ClientRequest;
}());
exports.ClientRequest = ClientRequest;
exports.clientRequestSchema = mongoose_1.SchemaFactory.createForClass(ClientRequest);
exports.clientRequestSchema.static('createClientEntity', ClientRequest.createClientEntity);
exports.clientRequestSchema.method('updateClientRequest', ClientRequest.prototype.updateClientRequest);
