import mongoose, { model } from "mongoose";
import { IUser } from "./userInterface";
const userSchema = new mongoose.Schema<IUser>({
  fname: { type: String, required: true },
  lname: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const userModel = model<IUser>("User", userSchema);

export default userModel;
