import express, { urlencoded } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Book } from "./models/bookModel.js";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Default Page");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/books", bookRoutes);
app.use("/", authRoutes);
app.use(errorMiddleware); 

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDb");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`App is listening at Port : ${process.env.PORT}`);
});
