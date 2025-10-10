import express from "express";

import dbConnection from "./config/db-connection.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`App is listening at https://localhost:${3000}`);
});
