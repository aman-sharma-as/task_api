const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: 100,
    require: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  lastModified: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  tagName: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tag",
    },
  ],
});

module.exports = mongoose.model("todo", todoSchema);
