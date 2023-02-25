"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var config_1 = require("@nestjs/config");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var user_schema_1 = require("./users/schemas/user.schema");
var blog_schema_1 = require("./blogs/schemas/blog.schema");
var post_schema_1 = require("./posts/schemas/post.schema");
var like_schema_1 = require("./likes/schemas/like.schema");
var comment_schema_1 = require("./comments/schemas/comment.schema");
var blogs_controller_1 = require("./blogs/blogs.controller");
var posts_controller_1 = require("./posts/posts.controller");
var users_controller_1 = require("./users/users.controller");
var users_service_1 = require("./users/users.service");
var blogs_service_1 = require("./blogs/blogs.service");
var posts_service_1 = require("./posts/posts.service");
var likes_service_1 = require("./likes/likes.service");
var users_repository_1 = require("./users/users.repository");
var blogs_repository_1 = require("./blogs/blogs.repository");
var posts_repository_1 = require("./posts/posts.repository");
var likes_repository_1 = require("./likes/likes.repository");
var comments_controller_1 = require("./comments/comments.controller");
var comments_service_1 = require("./comments/comments.service");
var comments_repository_1 = require("./comments/comments.repository");
var jwt_service_1 = require("./auth/jwt.service");
var auth_service_1 = require("./auth/auth.service");
var auth_controller_1 = require("./auth/auth.controller");
var email_manager_1 = require("./common/managers/email.manager");
var email_adapter_1 = require("./common/adapters/email.adapter");
var is_exist_entity_validator_1 = require("./common/validators/is-exist-entity.validator");
var devices_sessions_controller_1 = require("./devices-sessions/devices-sessions.controller");
var devices_sessions_service_1 = require("./devices-sessions/devices-sessions.service");
var devices_sessions_repository_1 = require("./devices-sessions/devices-sessions.repository");
var device_session_schema_1 = require("./devices-sessions/schemas/device-session.schema");
var clients_requests_repository_1 = require("./clients-requests/clients-requests.repository");
var clients_requests_service_1 = require("./clients-requests/clients-requests.service");
var client_request_schema_1 = require("./clients-requests/schemas/client-request.schema");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot(),
                mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI, {
                    dbName: process.env.DB_NAME
                }),
                mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.userSchema }]),
                mongoose_1.MongooseModule.forFeature([{ name: blog_schema_1.Blog.name, schema: blog_schema_1.blogSchema }]),
                mongoose_1.MongooseModule.forFeature([{ name: post_schema_1.Post.name, schema: post_schema_1.postSchema }]),
                mongoose_1.MongooseModule.forFeature([{ name: like_schema_1.Like.name, schema: like_schema_1.likeSchema }]),
                mongoose_1.MongooseModule.forFeature([{ name: comment_schema_1.Comment.name, schema: comment_schema_1.commentSchema }]),
                mongoose_1.MongooseModule.forFeature([
                    { name: device_session_schema_1.DeviceSession.name, schema: device_session_schema_1.deviceSessionSchema },
                ]),
                mongoose_1.MongooseModule.forFeature([
                    { name: client_request_schema_1.ClientRequest.name, schema: client_request_schema_1.clientRequestSchema },
                ]),
            ],
            controllers: [
                app_controller_1.AppController,
                users_controller_1.UsersController,
                blogs_controller_1.BlogsController,
                posts_controller_1.PostsController,
                comments_controller_1.CommentsController,
                auth_controller_1.AuthController,
                devices_sessions_controller_1.DevicesSessionsController,
            ],
            providers: [
                app_service_1.AppService,
                users_service_1.UsersService,
                users_repository_1.UsersRepository,
                blogs_service_1.BlogsService,
                blogs_repository_1.BlogsRepository,
                posts_service_1.PostsService,
                posts_repository_1.PostsRepository,
                likes_service_1.LikesService,
                likes_repository_1.LikesRepository,
                comments_service_1.CommentsService,
                comments_repository_1.CommentsRepository,
                auth_service_1.AuthService,
                jwt_service_1.JwtService,
                devices_sessions_service_1.DevicesSessionsService,
                devices_sessions_repository_1.DevicesSessionsRepository,
                clients_requests_service_1.ClientsRequestsService,
                clients_requests_repository_1.ClientsRequestsRepository,
                email_manager_1.EmailManager,
                email_adapter_1.EmailAdapter,
                is_exist_entity_validator_1.IsExistEntityValidator,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
