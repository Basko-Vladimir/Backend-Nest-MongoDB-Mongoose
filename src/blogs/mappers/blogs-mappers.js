"use strict";
exports.__esModule = true;
exports.mapDbBlogToBlogOutputModel = void 0;
var mapDbBlogToBlogOutputModel = function (blog) {
    return {
        id: String(blog._id),
        name: blog.name,
        websiteUrl: blog.websiteUrl,
        description: blog.description,
        isMembership: blog.isMembership,
        createdAt: blog.createdAt.toISOString()
    };
};
exports.mapDbBlogToBlogOutputModel = mapDbBlogToBlogOutputModel;
