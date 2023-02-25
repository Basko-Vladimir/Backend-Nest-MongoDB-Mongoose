"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CommonQueryParamsDto = void 0;
var class_validator_1 = require("class-validator");
var enums_1 = require("./enums");
var class_transformer_1 = require("class-transformer");
var CommonQueryParamsDto = /** @class */ (function () {
    function CommonQueryParamsDto() {
        this.sortDirection = enums_1.SortDirection.desc;
        this.pageNumber = 1;
        this.pageSize = 10;
    }
    __decorate([
        (0, class_validator_1.IsEnum)(enums_1.SortDirection),
        (0, class_validator_1.IsOptional)()
    ], CommonQueryParamsDto.prototype, "sortDirection");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Type)(function () { return Number; }),
        (0, class_validator_1.Min)(1)
    ], CommonQueryParamsDto.prototype, "pageNumber");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Type)(function () { return Number; }),
        (0, class_validator_1.Min)(1)
    ], CommonQueryParamsDto.prototype, "pageSize");
    return CommonQueryParamsDto;
}());
exports.CommonQueryParamsDto = CommonQueryParamsDto;
