const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "todo",
    },
  ],
  userCreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const user = mongoose.model("user", userSchema);
module.exports = user;
