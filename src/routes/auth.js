import express from "express";

import {
  getMe,
  login,
  logout,
  register,
  updateDetails,
  updatePassword,
} from "../controllers/auth";
import { protect } from "../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/updatedetails", protect, updateDetails);
router.post("/updatepassword", protect, updatePassword);

module.exports = router;
