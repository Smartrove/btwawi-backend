import mongoose from "mongoose";
import { nanoid } from "nanoid";

export interface PostDocument extends mongoose.Document {
  title: string;
  body: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    author: {
      type: String,
      required: true,
    },
    category: { type: String, required: true },
    title: { type: String, required: true, minlength: 5, maxLength: 255 },
    body: { type: String, required: true },
    image: { type: String },
    otherImages: { type: [String] },
  },
  { timestamps: true }
);

const Post = mongoose.model<PostDocument>("Post", PostSchema);

export default Post;
