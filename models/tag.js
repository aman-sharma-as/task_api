const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  tagName: {
    type: String,
    maxLength: 64,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "todo",
    },
  ],
});

const tagModel = mongoose.model("tag", tagSchema);

module.exports = tagModel;
