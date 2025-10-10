import mongoose from "mongoose";

const mongodb_uri =
  process.env.MONGO_URI ||
  "mongodb://admin:password@localhost:27017/codingClub?authSource=admin";

mongoose
  .connect(mongodb_uri)
  .then((res) => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

export default mongoose.connection;
