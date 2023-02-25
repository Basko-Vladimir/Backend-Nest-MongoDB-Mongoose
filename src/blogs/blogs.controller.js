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
exports.BlogsController = void 0;
var common_1 = require("@nestjs/common");
var blogs_mappers_1 = require("./mappers/blogs-mappers");
var posts_mapper_1 = require("../posts/mappers/posts-mapper");
var check_param_id_pipe_service_1 = require("../common/pipes/check-param-id-pipe.service");
var auth_guard_1 = require("../common/guards/auth.guard");
var add_user_to_request_guard_1 = require("../common/guards/add-user-to-request.guard");
var user_decorator_1 = require("../common/decorators/user.decorator");
var BlogsController = /** @class */ (function () {
    function BlogsController(blogsService, postsService, likesService) {
        this.blogsService = blogsService;
        this.postsService = postsService;
        this.likesService = likesService;
    }
    BlogsController.prototype.findAllBlogs = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.blogsService.findAllBlogs(query)];
            });
        });
    };
    BlogsController.prototype.findBlogById = function (blogId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetBlog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.blogsService.findBlogById(blogId)];
                    case 1:
                        targetBlog = _a.sent();
                        return [2 /*return*/, (0, blogs_mappers_1.mapDbBlogToBlogOutputModel)(targetBlog)];
                }
            });
        });
    };
    BlogsController.prototype.createBlog = function (creatingData) {
        return __awaiter(this, void 0, void 0, function () {
            var createdBlog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.blogsService.createBlog(creatingData)];
                    case 1:
                        createdBlog = _a.sent();
                        return [2 /*return*/, (0, blogs_mappers_1.mapDbBlogToBlogOutputModel)(createdBlog)];
                }
            });
        });
    };
    BlogsController.prototype.deleteBlog = function (blogId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.blogsService.deleteBlog(blogId)];
            });
        });
    };
    BlogsController.prototype.updateBlog = function (blogId, updatingData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.blogsService.updateBlog(blogId, updatingData)];
            });
        });
    };
    BlogsController.prototype.findAllPostsByBlogId = function (queryParams, blogId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var postsOutputModel, posts, fullPosts, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = userId ? String(userId) : null;
                        return [4 /*yield*/, this.postsService.findPosts(queryParams, blogId)];
                    case 1:
                        postsOutputModel = _c.sent();
                        posts = postsOutputModel.items;
                        fullPosts = [];
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < posts.length)) return [3 /*break*/, 5];
                        _b = (_a = fullPosts).push;
                        return [4 /*yield*/, (0, posts_mapper_1.getFullPostOutputModel)(posts[i], this.likesService, userId)];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, __assign(__assign({}, postsOutputModel), { items: fullPosts })];
                }
            });
        });
    };
    BlogsController.prototype.createPostForBlog = function (blogId, createPostForBlogDto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var createdPost, postOutputModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postsService.createPost(__assign(__assign({}, createPostForBlogDto), { blogId: blogId }))];
                    case 1:
                        createdPost = _a.sent();
                        postOutputModel = (0, posts_mapper_1.mapDbPostToPostOutputModel)(createdPost);
                        return [4 /*yield*/, (0, posts_mapper_1.getFullPostOutputModel)(postOutputModel, this.likesService, userId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)())
    ], BlogsController.prototype, "findAllBlogs");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id', check_param_id_pipe_service_1.checkParamIdPipe))
    ], BlogsController.prototype, "findBlogById");
    __decorate([
        (0, common_1.Post)(),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Body)())
    ], BlogsController.prototype, "createBlog");
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Param)('id', check_param_id_pipe_service_1.checkParamIdPipe))
    ], BlogsController.prototype, "deleteBlog");
    __decorate([
        (0, common_1.Put)(':id'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Param)('id', check_param_id_pipe_service_1.checkParamIdPipe)),
        __param(1, (0, common_1.Body)())
    ], BlogsController.prototype, "updateBlog");
    __decorate([
        (0, common_1.Get)(':blogId/posts'),
        (0, common_1.UseGuards)(add_user_to_request_guard_1.AddUserToRequestGuard),
        __param(0, (0, common_1.Query)()),
        __param(1, (0, common_1.Param)('blogId', check_param_id_pipe_service_1.checkParamIdPipe)),
        __param(2, (0, user_decorator_1.User)('_id'))
    ], BlogsController.prototype, "findAllPostsByBlogId");
    __decorate([
        (0, common_1.Post)(':blogId/posts'),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Param)('blogId', check_param_id_pipe_service_1.checkParamIdPipe)),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, user_decorator_1.User)('_id'))
    ], BlogsController.prototype, "createPostForBlog");
    BlogsController = __decorate([
        (0, common_1.Controller)('blogs')
    ], BlogsController);
    return BlogsController;
}());
exports.BlogsController = BlogsController;
