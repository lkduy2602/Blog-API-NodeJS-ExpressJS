import path from "path";

import { asyncHandler } from "../middlewares/async";

import Post from "../models/Post";
import ErrorResponse from "../utils/errorResponse";

// Get all posts
// GET /api/v1/posts
// Public
export const getPosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Create Posts
// POST /api/v1/posts
// Private
export const createPost = asyncHandler(async (req, res, next) => {
  const { title, body, banner_image } = req.body;

  const post = await Post.create({
    title,
    body,
    banner_image,
    user: req.user.id,
  });

  res.status(201).json({ success: true, data: post });
});

// Get Posts
// GET /api/v1/posts/:id
// Public
export const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Bài viết với ID ${req.params.id} không tồn tại`, 404)
    );
  }

  res.status(200).json({ success: true, data: post });
});

// Update Posts
// PUT /api/v1/posts/:id
// Private
export const updatePost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const post = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(
      new ErrorResponse(`Bài viết với ID ${req.params.id} không tồn tại`, 404)
    );
  }

  res.status(200).json({ success: true, data: post });
});

// Delete Posts
// DELETE /api/v1/posts/:id
// Private
export const deletePost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const post = await Post.findById(id);

  if (!post)
    return next(
      new ErrorResponse(`Bài viết với ID ${req.params.id} không tồn tại`, 404)
    );

  post.remove();

  res.status(200).json({ success: true, data: {} });
});

// Upload banner image Posts
// PUT /api/v1/posts/:id/banner
// Private
export const postBannerUpload = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Bài viết với ID ${req.params.id} không tồn tại`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Vui lòng tải lên file`, 404));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Vui lòng tải lên ảnh`, 404));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / 1000 / 1000
        }mb`,
        404
      )
    );
  }

  file.name = `photo_${post._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Lỗi tải lên ảnh`, 500));
    }

    await Post.findByIdAndUpdate(req.params.id, { banner_image: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});
