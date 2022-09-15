import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Tên phải có ít nhất 3 ký tự"],
      required: [true, "Vui lòng nhập tên"],
    },
    body: {
      type: String,
      minlength: [4, "Nhận xét phải có 4 ít nhất ký tự"],
      required: [true, "Vui lòng nhập nhận xét"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
