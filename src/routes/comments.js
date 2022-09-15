import express from "express";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comments";
import { advancedResults } from "../middlewares/advancedResults";
import { authorize, protect } from "../middlewares/auth";

import Comment from "../models/Comment";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advancedResults(Comment), getComments)
  .post(createComment);

router.route("/:id").delete(protect, authorize("admin"), deleteComment);

module.exports = router;
