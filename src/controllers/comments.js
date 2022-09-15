import { asyncHandler } from "../middlewares/async";

import ErrorResponse from "../utils/errorResponse";

import Post from "../models/Post";
import Comment from "../models/Comment";

// Get comments by post
// GET /api/v1/posts/:id/comments
// Public
export const getComments = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    return next(new ErrorResponse(`Không có bài viết với id ${id}`, 404));
  }

  const comments = await Comment.find({ post: id });

  res.status(200).json({ success: true, data: comments });
});
