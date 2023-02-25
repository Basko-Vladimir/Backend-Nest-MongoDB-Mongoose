"use strict";
exports.__esModule = true;
exports.IdTypes = exports.AuthType = exports.LikeStatus = exports.ClientRequestSortByField = exports.CommentSortByField = exports.UserSortByField = exports.PostSortByField = exports.BlogSortByField = exports.SortDirection = void 0;
var SortDirection;
(function (SortDirection) {
    SortDirection["desc"] = "desc";
    SortDirection["asc"] = "asc";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
var BlogSortByField;
(function (BlogSortByField) {
    BlogSortByField["name"] = "name";
    BlogSortByField["websiteUrl"] = "websiteUrl";
    BlogSortByField["createdAt"] = "createdAt";
})(BlogSortByField = exports.BlogSortByField || (exports.BlogSortByField = {}));
var PostSortByField;
(function (PostSortByField) {
    PostSortByField["createdAt"] = "createdAt";
    PostSortByField["title"] = "title";
    PostSortByField["blogName"] = "blogName";
    PostSortByField["shortDescription"] = "shortDescription";
    PostSortByField["content"] = "content";
})(PostSortByField = exports.PostSortByField || (exports.PostSortByField = {}));
var UserSortByField;
(function (UserSortByField) {
    UserSortByField["login"] = "login";
    UserSortByField["email"] = "email";
    UserSortByField["createdAt"] = "createdAt";
})(UserSortByField = exports.UserSortByField || (exports.UserSortByField = {}));
var CommentSortByField;
(function (CommentSortByField) {
    CommentSortByField["content"] = "content";
    CommentSortByField["userLogin"] = "userLogin";
    CommentSortByField["createdAt"] = "createdAt";
})(CommentSortByField = exports.CommentSortByField || (exports.CommentSortByField = {}));
var ClientRequestSortByField;
(function (ClientRequestSortByField) {
    ClientRequestSortByField["endpoint"] = "endpoint";
    ClientRequestSortByField["ip"] = "ip";
    ClientRequestSortByField["createTimeStamp"] = "createTimeStamp";
})(ClientRequestSortByField = exports.ClientRequestSortByField || (exports.ClientRequestSortByField = {}));
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["NONE"] = "None";
    LikeStatus["LIKE"] = "Like";
    LikeStatus["DISLIKE"] = "Dislike";
})(LikeStatus = exports.LikeStatus || (exports.LikeStatus = {}));
var AuthType;
(function (AuthType) {
    AuthType["BASIC"] = "basic";
    AuthType["BEARER"] = "bearer";
})(AuthType = exports.AuthType || (exports.AuthType = {}));
var IdTypes;
(function (IdTypes) {
    IdTypes["BLOG_ID"] = "blogId";
    IdTypes["POST_ID"] = "postId";
    IdTypes["USER_ID"] = "userId";
    IdTypes["COMMENT_ID"] = "commentId";
})(IdTypes = exports.IdTypes || (exports.IdTypes = {}));
