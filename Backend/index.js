import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";

import dbConnection from "./config/db-connection.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`App is listening at https://localhost:${3000}`);
});
