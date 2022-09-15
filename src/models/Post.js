import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      minlength: [6, "Tiêu đề phải có ít nhất 6 ký tự"],
      required: [true, "Tiều đề không được để trống"],
    },
    body: {
      type: String,
      minlength: [6, "Nội dung phải có ít nhất 6 ký tự"],
      required: [true, "Nội dung không được để trống"],
    },
    banner_image: {
      type: String,
      default: "default.jpg",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

    timestamps: true,
  }
);

PostSchema.pre("remove", async function (next) {
  console.log(`Nhận xét đã được xoá khỏi bài viết ${this._id}`);
  await this.modelName("Comment").deleteMany({ post: this._id });

  next();
});

PostSchema.virtual("comment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

module.exports = mongoose.model("Post", PostSchema);
