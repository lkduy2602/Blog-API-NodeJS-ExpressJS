import { asyncHandler } from "../middlewares/async";

import User from "../models/User";
import ErrorResponse from "../utils/errorResponse";

// Get all users
// GET /api/v1/users
// Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// create new user
// POST /api/v1/users
// Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

// Get all users
// GET /api/v1/users/:id
// Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`Không có người dùng nào có id này ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// update user
// PUT /api/v1/users/:id
// Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  req.body.password = "";
  delete req.body.password;

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorResponse(`Không có người dùng nào có id này ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// delete user
// DELETE /api/v1/users/:id
// Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`Không có người dùng nào có id này ${req.params.id}`)
    );
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
