import express, { Request, Response } from "express";
import wishlistModel from "./wishlistModel";
import { verifyToken } from "../../../helper/jwt";
import { JwtPayload } from "jsonwebtoken";
import bookModel from "../book/bookModel";
const wishlistRouter = express.Router();

wishlistRouter.get("/my", async (req: Request, res: Response) => {
  const token = req?.query?.token;
  //
  //console.log(req.query);
  const verifyUser: JwtPayload | string | undefined = verifyToken(token);
  //console.log(req.body);
  const email = typeof verifyUser === "object" ? verifyUser.userEmail : "";

  const myWishlist = await wishlistModel.find({ userEmail: email });
  res.status(200).send({
    user: myWishlist,
    msg: "wishlist data",
  });
});

wishlistRouter.post("/my", async (req: Request, res: Response) => {
  try {
    const { id, token, title } = req.body;
    const verifyUser: JwtPayload | string | undefined = verifyToken(token);
    //console.log(req.body);
    const email = typeof verifyUser === "object" ? verifyUser.userEmail : "";
    const isWishList = await wishlistModel.find({
      userEmail: email,
      bookId: id,
      title: title,
    });
    // console.log(isWishList);
    if (isWishList.length > 0) {
      res.status(200).send({
        msg: "Book already has wishlist menu",
      });
    } else {
      const wishlistData = new wishlistModel({
        bookId: id,
        userEmail: email,
        title: title,
      });

      const saveData = await wishlistData.save();
      res.status(200).send({
        user: saveData,
        msg: "wishlist data",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

wishlistRouter.delete("/my/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  //console.log(id);
  const deleteWishlist = await wishlistModel.findByIdAndDelete({ _id: id });
  res.status(200).send({
    user: deleteWishlist,
    msg: "delete wishlist data",
  });
});

export default wishlistRouter;
