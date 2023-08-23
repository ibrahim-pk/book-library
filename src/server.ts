import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
dotenv.config();
const PORT = process.env.PORT || 5000;
const Main = async () => {
  await mongoose.connect(process.env.DB_URL as string);
  try {
    app.listen(PORT, () => console.log(`server is running port:${PORT}`));
    console.log("DB is connected!");
  } catch (err) {
    console.log(err);
  }
};

Main();
