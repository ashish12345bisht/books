const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    enum: ["Male", "Female", "Other"],
    type: String,
    required: false,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedBooks: [{}],
  readLater: [{}],
  token: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
