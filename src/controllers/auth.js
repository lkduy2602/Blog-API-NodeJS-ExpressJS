import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../utils/errorResponse";

import User from "../models/User";

//Đăng ký
// POST /api/v1/auth/register
// Public
export const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse("Email đã tồn tại", 401));
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// Đăng nhập
// POST /api/v1/auth/login
// Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Vui lòng nhập email và mật khẩu !!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Tài khoản hoặc mật khẩu không đúng", 400));
  }

  const isMatch = await user.mathPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Tài khoản hoặc mật khẩu không đúng", 400));
  }

  sendTokenResponse(user, 200, res);
});

// Đăng xuất
// GET /api/v1/auth/logout
// Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), //10s
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

// Lấy thông tin của mình
// GET /api/v1/auth/me
// Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({ success: true, data: user });
});

// Cập nhật thông tin tài khoản
// POST /api/v1/auth/updatedetails
// Private
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true,
  }).catch((err) => {
    res.status(400).json({ success: false, data: "Email đã tồn tại" });
  });

  res.status(200).json({ success: true, data: user });
});

// Cập nhật mật khẩu
// POST /api/v1/auth/updatepassword
// Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.mathPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Mật khẩu cũ không đúng", 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // bien * 1 ngày
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
