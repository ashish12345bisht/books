const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Books = require("../models/books");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("hello world");
});
//User Register
router.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    const mobile = await User.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (user || mobile) {
      res.send("Email/Number Already exists");
    } else {
      var salt = await bcrypt.genSalt(10);
      var hashedPassword = await bcrypt.hash(req.body.password, salt);
      const token = await jwt.sign(
        { _id: req.body.email },
        "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
      );
      var newUser = new User({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        age: req.body.age,
        gender: req.body.gender,
        token: token,
      });

      await newUser.save();

      res.send(newUser);
    }
  } catch (err) {
    console.log("error ", err);
    res.send(err);
  }
});

//User Login
router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    !user && res.send("No user with submitted credentials");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.send("Invalid Email or Password");

    const token = await jwt.sign(
      { _id: user.email },
      "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
    );

    user.token = token;
    await user.save();
    res.send(user);
  } catch (err) {
    // console.log(err);
    res.send(err);
  }
});

router.post("/logout", async (req, res) => {
  try {
    let userCheck = await jwt.verify(
      req.body.token,
      "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
    );
    if (userCheck) {
      // jwt_token = "";
      let user = await User.findOne({ token: req.body.token });
      // console.log(user);
      user.token = "";
      await user.save();
      res.send("Logged Out Succesfully...");
    } else {
      res.send("Logout Failed because of wrong token");
    }
  } catch (err) {
    res.send(err);
  }
});
//User Read Books
router.get("/books", async (req, res) => {
  try {
    let books = await Books.find();
    res.send(books);
  } catch (err) {
    res.send(err);
  }
});

//User Reads all Liked Books
router.get("/likebooks", async (req, res) => {
  try {
    let userCheck = await jwt.verify(
      req.body.token,
      "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
    );
    if (!userCheck) {
      res.send("You need to login first");
    } else {
      let user = await User.findOne({ token: req.body.token });
      // console.log(user);
      res.send(user?.likedBooks || "Login Required For This Action");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
//User Reads all Read Later Books
router.get("/readlaterbooks", async (req, res) => {
  try {
    let userCheck = await jwt.verify(
      req.body.token,
      "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
    );
    if (!userCheck) {
      res.send("You need to login first");
    } else {
      let user = await User.findOne({ token: req.body.token });
      if (user) {
        res.send(user.readLater);
      } else {
        res.send("Login Required For This Action");
      }
    }
  } catch (err) {
    // console.log(err);
    res.send(err);
  }
});

//User Add book to Liked Books
router.post("/likebooks", async (req, res) => {
  try {
    let userCheck = await jwt.verify(
      req.body.token,
      "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
    );
    if (!userCheck) {
      res.send("You need to login first");
    } else {
      let book = await Books.findById({ _id: req.body.book_id });
      let user = await User.findOne({ token: req.body.token });
      if (user) {
        user.likedBooks.push(book);
        await user.save();
        res.send(user);
      } else {
        res.send("Login Required For This Action");
      }
    }
  } catch (err) {
    res.send(err);
  }
});

//User Add book to Read Later Books
router.post("/readlaterbooks", async (req, res) => {
  try {
    let userCheck = await jwt.verify(
      req.body.token,
      "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
    );
    if (!userCheck) {
      res.send("You need to login first");
    } else {
      let book = await Books.findById({ _id: req.body.book_id });
      let user = await User.findOne({ token: req.body.token });
      if (user) {
        user.readLater.push(book);
        await user.save();
        res.send(user);
      } else {
        res.send("Login Required For this Action");
      }
    }
  } catch (err) {
    // console.log(err);
    res.send(err);
  }
});

//User Read any single Books
router.get("/books/:id", async (req, res) => {
  try {
    let book = await Books.find({ _id: req.params.id });
    res.send(book);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
