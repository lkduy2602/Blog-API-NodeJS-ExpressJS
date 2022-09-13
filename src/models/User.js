import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Vui lòng nhập họ !!"],
    },
    lastName: {
      type: String,
      required: [true, "Vui lòng nhập tên !!"],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email !!"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email không đúng định dạng !!",
      ],
    },
    role: {
      type: String,
      enum: ["guest", "admin"],
      default: "guest",
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu !!"],
      minlength: [6, "Mật khẩu phải nhiều hơn 6 ký tự"],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Mã hoá mật khẩu
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// So sánh mật khẩu
UserSchema.methods.mathPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phut

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
