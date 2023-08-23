import mongoose, { model } from "mongoose";
import { IWishlist } from "./wishlistInterface";

const WishlistSchema = new mongoose.Schema<IWishlist>({
  title: { type: String, required: true },
  bookId: { type: String, required: true },
  userEmail: { type: String, required: true },
});

const wishlistModel = model<IWishlist>("Wishlist", WishlistSchema);

export default wishlistModel;
