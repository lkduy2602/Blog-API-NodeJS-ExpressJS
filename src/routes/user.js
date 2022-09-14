import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user";
import { advancedResults } from "../middlewares/advancedResults";
import { authorize, protect } from "../middlewares/auth";

import User from "../models/User";

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
