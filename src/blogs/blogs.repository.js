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
exports.BlogsRepository = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var blog_schema_1 = require("./schemas/blog.schema");
var enums_1 = require("../common/enums");
var utils_1 = require("../common/utils");
var blogs_mappers_1 = require("./mappers/blogs-mappers");
var BlogsRepository = /** @class */ (function () {
    function BlogsRepository(BlogModel) {
        this.BlogModel = BlogModel;
    }
    BlogsRepository.prototype.findAllBlogs = function (queryParams) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sortBy, _b, sortDirection, _c, pageNumber, _d, pageSize, _e, searchNameTerm, skip, sortSetting, totalCount, blogs;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = queryParams.sortBy, sortBy = _a === void 0 ? enums_1.BlogSortByField.createdAt : _a, _b = queryParams.sortDirection, sortDirection = _b === void 0 ? enums_1.SortDirection.desc : _b, _c = queryParams.pageNumber, pageNumber = _c === void 0 ? 1 : _c, _d = queryParams.pageSize, pageSize = _d === void 0 ? 10 : _d, _e = queryParams.searchNameTerm, searchNameTerm = _e === void 0 ? '' : _e;
                        skip = (0, utils_1.countSkipValue)(pageNumber, pageSize);
                        sortSetting = (0, utils_1.setSortValue)(sortBy, sortDirection);
                        return [4 /*yield*/, this.BlogModel.countDocuments().where('name', new RegExp(searchNameTerm, 'i'))];
                    case 1:
                        totalCount = _f.sent();
                        return [4 /*yield*/, this.BlogModel.find({})
                                .where('name', new RegExp(searchNameTerm, 'i'))
                                .skip(skip)
                                .limit(pageSize)
                                .sort(sortSetting)];
                    case 2:
                        blogs = _f.sent();
                        return [2 /*return*/, {
                                pagesCount: Math.ceil(totalCount / pageSize),
                                page: Number(pageNumber),
                                pageSize: Number(pageSize),
                                totalCount: totalCount,
                                items: blogs.map(blogs_mappers_1.mapDbBlogToBlogOutputModel)
                            }];
                }
            });
        });
    };
    BlogsRepository.prototype.findBlogById = function (blogId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetBlog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.BlogModel.findById(blogId)];
                    case 1:
                        targetBlog = _a.sent();
                        if (!targetBlog)
                            throw new common_1.NotFoundException();
                        return [2 /*return*/, targetBlog];
                }
            });
        });
    };
    BlogsRepository.prototype.saveBlog = function (blog) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, blog.save()];
            });
        });
    };
    BlogsRepository.prototype.deleteBlog = function (blogId) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.BlogModel.deleteOne((0, utils_1.getFilterByDbId)(blogId))];
                    case 1:
                        deletedCount = (_a.sent()).deletedCount;
                        if (!deletedCount)
                            throw new common_1.NotFoundException();
                        return [2 /*return*/];
                }
            });
        });
    };
    BlogsRepository = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, mongoose_1.InjectModel)(blog_schema_1.Blog.name))
    ], BlogsRepository);
    return BlogsRepository;
}());
exports.BlogsRepository = BlogsRepository;
