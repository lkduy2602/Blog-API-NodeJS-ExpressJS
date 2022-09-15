import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  postBannerUpload,
  updatePost,
} from "../controllers/posts";
import { advancedResults } from "../middlewares/advancedResults";
import { authorize, protect } from "../middlewares/auth";

import Post from "../models/Post";

const router = express.Router();

router
  .route("/")
  .get(
    advancedResults(Post, [
      "comments",
      { path: "user", select: "firstName lastName email -_id" },
    ]),
    getPosts
  )
  .post(protect, createPost);

router
  .route("/:id")
  .get(getPost)
  .put(protect, authorize("guest", "admin"), updatePost)
  .delete(protect, authorize("admin"), deletePost);

router.put("/:id/banner", protect, postBannerUpload);

module.exports = router;
