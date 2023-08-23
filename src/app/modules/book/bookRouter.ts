import express, { Request, Response } from "express";
import bookModel from "./bookModel";
import pick from "../../../share/pick";

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

bookRouter.post("/addbook", async (req: Request, res: Response) => {
  try {
    const { title, author, genre, publishDate, postBy } = req.body;
    const isTitle = await bookModel.findOne({ title: title });
    if (!isTitle) {
      const bookData = new bookModel({
        title: title,
        autor: author,
        genre: genre,
        publishDate: publishDate,
        postBy: postBy,
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

bookRouter.delete("/deletebook/:id", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const bookId = req.params.id;
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

bookRouter.patch("/updatebook/:id", async (req: Request, res: Response) => {
  try {
    const { email, data } = req.body;
    const bookId = req.params.id;
    const isUser = await bookModel.findOne({ postBy: email });
    if (isUser) {
      const updatebook = await bookModel.findByIdAndUpdate(
        { _id: bookId },
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

bookRouter.get("/filter", async (req: Request, res: Response) => {
  try {
    const andCondition: { [key: string]: any }[] = [];
    if (Object.keys(req.query).length) {
      andCondition.push({
        $and: Object.entries(req.query).map(([field, value]: any) => ({
          //Object.entries giver array from object with key value pair
          [field]: value,
        })),
      });
    }

    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const filterBook = await bookModel.find(whereCondition);

    res.status(200).send({
      book: filterBook,
      msg: "filter Book",
    });
  } catch (err) {
    console.log(err.message);
  }
});

bookRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const andCondition: { [key: string]: any }[] = [];
    if (Object.keys(req.query).length) {
      andCondition.push({
        $or: Object.entries(req.query).map(([field, value]: any) => ({
          //Object.entries giver array from object with key value pair
          [field]: {
            $regex: value,
            $options: "i", //case insensetive
          },
        })),
      });
    }

    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const filterBook = await bookModel.find(whereCondition);

    res.status(200).send({
      book: filterBook,
      msg: "searching Book",
    });
  } catch (err) {
    console.log(err.message);
  }
});

export default bookRouter;
