const express = require("express");
const router = express.Router();
const Books = require("../models/books");
const Admin = require("../models/admin");
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Admin Register
router.post("/AdminRegister", async (req, res) => {
  try {
    const admin = await Admin.findOne({
      email: req.body.email,
    });
    const mobile = await Admin.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (admin || mobile) {
      res.send("Email/Number Already exists");
    } else {
      var salt = await bcrypt.genSalt(10);
      var hashedPassword = await bcrypt.hash(req.body.password, salt);
      const token = await jwt.sign(
        { _id: req.body.email },
        "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
      );
      var newAdmin = new Admin({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        age: req.body.age,
        gender: req.body.gender,
        token: token,
      });

      await newAdmin.save();
      res.send(newAdmin);
    }
  } catch (err) {
    console.log("error ", err);
  }
});

//Admin Login
router.post("/AdminLogin", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    !admin && res.send("No user with submitted credentials");

    const validated = await bcrypt.compare(req.body.password, admin.password);
    !validated && res.send("Invalid Email or Password");
    const token = await jwt.sign(
      { _id: admin.email },
      "qwertyuiopasdfghjklzxcvbnmpzoxicuvybtnremwq"
    );
    admin.token = token;
    await admin.save();
    // console.log(admin);
    res.status(200).send(admin);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//Admin Logout
router.post("/AdminLogout", async (req, res) => {
  try {
    let admin = await Admin.findOne({ token: req.body.token });
    if (admin) {
      admin.token = "";
      await admin.save();
      res.send("Admin Logged Out...");
    } else {
      res.send("Login Required");
    }
  } catch (err) {
    res.send(err);
  }
});

//Admin Create User
router.post("/userCreate", async (req, res) => {
  try {
    let adminCheck = await Admin.findOne({ token: req.body.token });
    if (adminCheck) {
      var salt = await bcrypt.genSalt(10);
      var hashedPassword = await bcrypt.hash(req.body.password, salt);
      let newUser = new Users({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        age: req.body.age,
        gender: req.body.gender,
        token: "",
      });
      const user = await newUser.save();
      res.send(user);
    } else {
      res.send("Admin Not Logged in");
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});
//Admin Create Books
router.post("/bookCreate", async (req, res) => {
  try {
    let adminCheck = await Admin.findOne({ token: req.body.token });

    if (adminCheck) {
      let newBook = new Books({
        title: req.body.title,
        author: req.body.author,
        releaseDate: req.body.releaseDate,
        language: req.body.language,
        ratings: req.body.ratings,
      });
      const books = await newBook.save();
      res.send(books);
    } else {
      res.send("Admin Not Logged in");
    }
  } catch (err) {
    res.send(err);
  }
});

//Admin Delete User
router.delete("/UserDelete", async (req, res) => {
  try {
    let adminCheck = await Admin.findOne({ token: req.body.token });

    if (adminCheck) {
      let user = await Users.findById(req.body.id);
      if (user) {
        var user1 = await Users.findByIdAndDelete(req.body.id);
        res.send("User has been deleted...");
      } else {
        res.send("No user with given id");
      }
    } else {
      res.send("Token Expired");
    }
  } catch (err) {
    // console.log(err);
    res.send(err);
  }
});

//Admin Update User
router.put("/UserUpdate", async (req, res) => {
  try {
    let adminCheck = await Admin.findOne({ token: req.body.token });

    if (adminCheck) {
      let user = await Users.findById(req.body.id);
      if (user) {
        const updatedUser = await Users.findByIdAndUpdate(
          req.body.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.send(updatedUser);
      } else {
        res.send("No user with given id");
      }
    } else {
      res.send("Token Expired");
    }
  } catch (err) {
    res.send(err);
  }
});

//Admin Book Delete
router.delete("/BookDelete", async (req, res) => {
  try {
    let adminCheck = await Admin.findOne({ token: req.body.token });

    if (adminCheck) {
      var book = await Books.findByIdAndDelete(req.body.id);
      // console.log(user);
      if (book) {
        res.send("Book has been deleted...");
      } else {
        res.send("No book with given id");
      }
    } else {
      res.send("Token Expired");
    }
  } catch (err) {
    // console.log(err);
    res.send(err);
  }
});

//Admin Book Update
router.put("/BookUpdate", async (req, res) => {
  try {
    let adminCheck = await Admin.findOne({ token: req.body.token });

    if (adminCheck) {
      let book = await Books.findById(req.body.id);
      if (book) {
        const updatedBook = await Books.findByIdAndUpdate(
          req.body.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.send(updatedBook);
      } else {
        res.send("No book given id");
      }
    } else {
      res.send("Token Expired");
    }
  } catch (err) {
    res.send(err);
  }
});

//Admin Read All Users
router.post("/users", async (req, res) => {
  try {
    let admin = await Admin.findOne({ token: req.body.token });
    if (admin) {
      let users = await Users.find();
      res.send(users);
    } else {
      res.send("Token Expired");
    }
  } catch (err) {
    // console.log(err);
    res.json(err);
  }
});

module.exports = router;
