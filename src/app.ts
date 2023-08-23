import express, { Request, Response } from "express";
import cors from "cors";
import userRoute from "./app/modules/user/userRouter";
import bookRouter from "./app/modules/book/bookRouter";
import wishlistRouter from "./app/modules/wishlist/wishlistRouter";

const app = express();
app.use(cors());
app.use(express.json());

//routes
app.use("/api/user", userRoute);
app.use("/api/book", bookRouter);
app.use("/api/wishlist", wishlistRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

export default app;
