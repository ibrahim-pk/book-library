import express, { Request, Response } from "express";
import bookModel from "./bookModel";
import pick from "../../../share/pick";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../../helper/jwt";

const bookRouter = express.Router();

bookRouter.get("/allbook", async (req: Request, res: Response) => {
  try {
    // console.log(req?.query);

    const SearchField = ["title", "genre", "author"];
    const andCondition: { [key: string]: any }[] = [];
    if (req?.query?.value) {
      andCondition.push({
        $or: SearchField.map((field) => ({
          [field]: {
            $regex: req.query.value,
            $options: "i", // 'i' specifies case insensitivity
          },
        })),
      });
    }

    if (req?.query?.filter && req?.query?.filter !== "all") {
      andCondition.push({
        $and: Object.entries(req?.query).map(([field, value]: any) => ({
          //Object.entries giver array from object with key value pair
          ["genre"]: req?.query?.filter,
        })),
      });
    }

    if (req?.query?.filter === "all") {
      andCondition.length = 0;
    }
    const whereCondition = andCondition.length > 0 ? { $or: andCondition } : {};
    const allBook = await bookModel.find(whereCondition);

    res.status(200).send({
      books: allBook,
      msg: "Fetching all book",
    });
  } catch (err) {
    console.log(err);
  }
});

bookRouter.get("/my/allbook", async (req: Request, res: Response) => {
  try {
    //console.log(req?.query);
    const token = req.query.token;
    //console.log(token);
    const verifyUser: JwtPayload | string | undefined = verifyToken(token);

    const email = typeof verifyUser === "object" ? verifyUser.userEmail : "";

    const myAllbook = await bookModel.find({ postBy: email });
    if (myAllbook) {
      res.status(200).send({
        books: myAllbook,
        msg: "Fetching all book",
      });
    } else {
      res.status(200).send({
        msg: "No Book Post",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

bookRouter.post("/addbook", async (req: Request, res: Response) => {
  try {
    const { title, author, genre, publishDate, token } = req.body;
    //console.log(req.body);
    const verifyUser: JwtPayload | string | undefined = verifyToken(token);
    //console.log(req.body);
    const email = typeof verifyUser === "object" ? verifyUser.userEmail : "";
    const isTitle = await bookModel.findOne({ title: title });
    if (!isTitle) {
      const bookData = new bookModel({
        title: title,
        author: author,
        genre: genre,
        publishDate: publishDate,
        postBy: email,
      });

      const saveData = await bookData.save();
      res.status(200).send({
        book: saveData,
        msg: "Added Book",
      });
    } else {
      res.status(200).send({
        msg: "Same tittle is exist!",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
});

bookRouter.delete("/deletebook", async (req: Request, res: Response) => {
  try {
    const { token, id } = req.body;
    const verifyUser: JwtPayload | string | undefined = verifyToken(token);

    const email = typeof verifyUser === "object" ? verifyUser.userEmail : "";
    const bookId = id;
    const isUser = await bookModel.findOne({ postBy: email });
    if (isUser) {
      const deletebook = await bookModel.findByIdAndDelete({ _id: bookId });

      res.status(200).send({
        book: deletebook,
        msg: "Delete Book",
      });
    } else {
      res.status(200).send({
        msg: "Invalid Publisher",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
});

bookRouter.patch("/updatebook", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { token, data } = req.body;
    const verifyUser: JwtPayload | string | undefined = verifyToken(token);

    const email = typeof verifyUser === "object" ? verifyUser.userEmail : "";
    const isUser = await bookModel.findOne({ postBy: email });
    if (isUser) {
      const updatebook = await bookModel.findByIdAndUpdate(
        { _id: data.bookId },
        data,
        { new: true }
      );
      res.status(200).send({
        book: updatebook,
        msg: "updated Book",
      });
    } else {
      res.status(200).send({
        msg: "Invalid Publisher",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
});

export default bookRouter;
