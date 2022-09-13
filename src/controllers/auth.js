import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../utils/errorResponse";
import crypto from "crypto";

import User from "../models/User";
import { sendEmail } from "../utils/sendEmail";

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
// PUT /api/v1/auth/updatedetails
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
// PUT /api/v1/auth/updatepassword
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

// Gửi email quên mật khẩu
// POST /api/v1/auth/forgotpassword
// Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse("Chưa có tài khoản nào được tạo bằng email này", 403)
    );
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu. ${resetUrl}`;

  console.log(resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Đặt lại mật khẩu",
      message,
    });

    res.status(200).json({
      success: true,
      data: "Đã gửi email đặt lại mật khẩu",
    });
  } catch (err) {
    console.log(err);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Không thể gửi được Email", 500));
  }
});

// Đổi mật khẩu khi nhận được email
// PUT /api/v1/auth/resetpassword/:resettoken
// Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Mã token không hợp lệ", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

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
