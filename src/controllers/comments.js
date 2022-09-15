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

// Create comment
// POST /api/v1/posts/:id/comments
// Public
export const createComment = asyncHandler(async (req, res, next) => {
  const { name, body } = req.body;
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    return next(new ErrorResponse(`Không có bài viết với id ${id}`, 404));
  }

  const comment = await Comment.create({
    name,
    body,
    post: id,
  });

  res.status(201).json({ success: true, data: comment });
});

// Delete Comment
// DELETE /api/v1/comments/:id
// Private (admin)
export const deleteComment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const comment = await Comment.findByIdAndDelete(id);

  if (!comment) {
    return next(new ErrorResponse(`Bình luận với ID ${id} không tồn tại`, 404));
  }

  res.status(200).json({ success: true, data: {} });
});
