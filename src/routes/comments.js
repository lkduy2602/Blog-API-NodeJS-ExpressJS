import express from "express";
import { getComments } from "../controllers/comments";
import { advancedResults } from "../middlewares/advancedResults";

import Comment from "../models/Comment";

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResults(Comment), getComments);

module.exports = router;
