import express, { Request, Response } from "express";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { createToken } from "../../../helper/jwt";
const userRoute = express.Router();

userRoute.post("/signup", async (req: Request, res: Response) => {
  try {
    const { fname, lname, email, password } = req.body;
    console.log(req.body);
    const UserPass = await bcrypt.hash(password, 10);
    const userData = new userModel({
      fname: fname,
      lname: lname,
      email: email,
      password: UserPass,
    });

    const saveData = await userData.save();
    const userId = saveData._id;
    const userEmail = saveData.email;
    const token = createToken({ userId, userEmail });
    res.status(200).send({
      user: saveData,
      token: token,
      msg: "User Create Successfully",
    });
  } catch (err) {
    console.log(err);
  }
});

userRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isUser = await userModel.findOne({ email: email });
    if (isUser) {
      const match = await bcrypt.compare(password, isUser.password);

      if (match) {
        const userId = isUser._id;
        const userEmail = isUser.email;
        const token = createToken({ userId, userEmail });
        res.status(200).send({
          user: isUser,
          token: token,
          msg: "User login successfully",
        });
      } else {
        res.status(200).send({
          msg: "Invalid Password",
        });
      }
    } else {
      res.status(200).send({
        msg: "User dosen't exist",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

export default userRoute;
