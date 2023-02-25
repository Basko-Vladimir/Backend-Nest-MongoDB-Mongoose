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
exports.PostsController = void 0;
var common_1 = require("@nestjs/common");
var posts_mapper_1 = require("./mappers/posts-mapper");
var comments_mapper_1 = require("../comments/mappers/comments-mapper");
var check_param_id_pipe_service_1 = require("../common/pipes/check-param-id-pipe.service");
var auth_guard_1 = require("../common/guards/auth.guard");
var user_decorator_1 = require("../common/decorators/user.decorator");
var add_user_to_request_guard_1 = require("../common/guards/add-user-to-request.guard");
var PostsController = /** @class */ (function () {
    function PostsController(postsService, likesService, commentsService) {
        this.postsService = postsService;
        this.likesService = likesService;
        this.commentsService = commentsService;
    }
    PostsController.prototype.findPosts = function (queryParams, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var postsOutputModel, posts, fullPosts, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = userId ? String(userId) : null;
                        return [4 /*yield*/, this.postsService.findPosts(queryParams)];
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
    PostsController.prototype.getCommentsForPost = function (postId, queryParams, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var commentsOutputModel, comments, fullComments, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = userId ? String(userId) : null;
                        return [4 /*yield*/, this.commentsService.findComments(queryParams, postId)];
                    case 1:
                        commentsOutputModel = _c.sent();
                        comments = commentsOutputModel.items;
                        fullComments = [];
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < comments.length)) return [3 /*break*/, 5];
                        _b = (_a = fullComments).push;
                        return [4 /*yield*/, (0, comments_mapper_1.getFullCommentOutputModel)(comments[i], this.likesService, userId)];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, __assign(__assign({}, commentsOutputModel), { items: fullComments })];
                }
            });
        });
    };
    PostsController.prototype.findPostById = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetPost, postOutputModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = userId ? String(userId) : null;
                        return [4 /*yield*/, this.postsService.findPostById(postId)];
                    case 1:
                        targetPost = _a.sent();
                        postOutputModel = (0, posts_mapper_1.mapDbPostToPostOutputModel)(targetPost);
                        return [2 /*return*/, (0, posts_mapper_1.getFullPostOutputModel)(postOutputModel, this.likesService, userId)];
                }
            });
        });
    };
    PostsController.prototype.createPost = function (body, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var createdPost, postOutputModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postsService.createPost(body)];
                    case 1:
                        createdPost = _a.sent();
                        postOutputModel = (0, posts_mapper_1.mapDbPostToPostOutputModel)(createdPost);
                        return [2 /*return*/, (0, posts_mapper_1.getFullPostOutputModel)(postOutputModel, this.likesService, userId)];
                }
            });
        });
    };
    PostsController.prototype.deletePost = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.postsService.deletePost(postId)];
            });
        });
    };
    PostsController.prototype.updatePost = function (postId, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.postsService.updatePost(postId, body)];
            });
        });
    };
    PostsController.prototype.createCommentForPost = function (postId, createCommentForPostDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            var createdComment, commentOutputModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commentsService.createComment({
                            postId: postId,
                            content: createCommentForPostDto.content,
                            userId: user.id,
                            userLogin: user.login
                        })];
                    case 1:
                        createdComment = _a.sent();
                        commentOutputModel = (0, comments_mapper_1.mapDbCommentToCommentOutputModel)(createdComment);
                        return [2 /*return*/, (0, comments_mapper_1.getFullCommentOutputModel)(commentOutputModel, this.likesService, String(user._id))];
                }
            });
        });
    };
    PostsController.prototype.updatePostLikeStatus = function (postId, likeStatusDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            var likeStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        likeStatus = likeStatusDto.likeStatus;
                        return [4 /*yield*/, this.postsService.updatePostLikeStatus(user, postId, likeStatus)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, common_1.UseGuards)(add_user_to_request_guard_1.AddUserToRequestGuard),
        __param(0, (0, common_1.Query)()),
        __param(1, (0, user_decorator_1.User)('_id'))
    ], PostsController.prototype, "findPosts");
    __decorate([
        (0, common_1.Get)(':postId/comments'),
        (0, common_1.UseGuards)(add_user_to_request_guard_1.AddUserToRequestGuard),
        __param(0, (0, common_1.Param)('postId', check_param_id_pipe_service_1.checkParamIdPipe)),
        __param(1, (0, common_1.Query)()),
        __param(2, (0, user_decorator_1.User)('_id'))
    ], PostsController.prototype, "getCommentsForPost");
    __decorate([
        (0, common_1.Get)(':id'),
        (0, common_1.UseGuards)(add_user_to_request_guard_1.AddUserToRequestGuard),
        __param(0, (0, common_1.Param)('id', check_param_id_pipe_service_1.checkParamIdPipe)),
        __param(1, (0, user_decorator_1.User)('_id'))
    ], PostsController.prototype, "findPostById");
    __decorate([
        (0, common_1.Post)(),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, user_decorator_1.User)('_id'))
    ], PostsController.prototype, "createPost");
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Param)('id', check_param_id_pipe_service_1.checkParamIdPipe))
    ], PostsController.prototype, "deletePost");
    __decorate([
        (0, common_1.Put)(':id'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Param)('id', check_param_id_pipe_service_1.checkParamIdPipe)),
        __param(1, (0, common_1.Body)())
    ], PostsController.prototype, "updatePost");
    __decorate([
        (0, common_1.Post)(':postId/comments'),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Param)('postId', check_param_id_pipe_service_1.checkParamIdPipe)),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, user_decorator_1.User)())
    ], PostsController.prototype, "createCommentForPost");
    __decorate([
        (0, common_1.Put)(':postId/like-status'),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, common_1.Param)('postId', check_param_id_pipe_service_1.checkParamIdPipe)),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, user_decorator_1.User)())
    ], PostsController.prototype, "updatePostLikeStatus");
    PostsController = __decorate([
        (0, common_1.Controller)('posts')
    ], PostsController);
    return PostsController;
}());
exports.PostsController = PostsController;
