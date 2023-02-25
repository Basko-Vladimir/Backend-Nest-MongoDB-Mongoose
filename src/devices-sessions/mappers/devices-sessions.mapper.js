"use strict";
exports.__esModule = true;
exports.mapDbDeviceSessionToDeviceSessionOutputModel = void 0;
var mapDbDeviceSessionToDeviceSessionOutputModel = function (deviceSession) {
    return {
        ip: deviceSession.ip,
        title: deviceSession.deviceName,
        lastActiveDate: deviceSession.issuedAt
            ? new Date(deviceSession.issuedAt).toISOString()
            : 'No lastActiveDate',
        deviceId: String(deviceSession.deviceId) || ''
    };
};
exports.mapDbDeviceSessionToDeviceSessionOutputModel = mapDbDeviceSessionToDeviceSessionOutputModel;
