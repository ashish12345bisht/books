const express = require("express");
const app = express();
require("dotenv").config();
const userRoute = require("./controllers/userController");
const adminRoute = require("./controllers/adminController");
const mongoose = require("mongoose");

app.use(express.json());
const mongoURI = "mongodb://localhost:27017/books";
console.log(__dirname);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch((err) => {
    console.log("error ", err);
  });

app.use(userRoute);
app.use(adminRoute);
app.listen(process.env.PORT, () => {
  console.log("Server is running at port ", process.env.PORT);
});
