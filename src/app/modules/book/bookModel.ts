import mongoose, { model } from "mongoose";
import { IBook } from "./bookInterface";

const bookSchema = new mongoose.Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String },
  genre: { type: String, required: true },
  publishDate: { type: String, required: true },
  review: [{ type: String }],
  postBy: { type: String, required: true },
});

const bookModel = model<IBook>("Book", bookSchema);

export default bookModel;
