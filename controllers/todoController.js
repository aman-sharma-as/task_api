const todo = require("../models/todo");
const userModel = require("../models/user");

exports.createTodo = async (req, res) => {
  try {
    const { title, description, user, tagName } = req.body;

    if (!title || !description) {
      res.status(500).json({
        success: false,
        message: "Fill details",
      });
    }

    const userID = await userModel.findOne({ email: req.user.email });

    const newTodo = new todo({
      title,
      description,
      user: userID,
      tagName,
    });

    await userModel.findOneAndUpdate(
      { _id: userID },
      { $push: { notes: newTodo } }
    );

    const todoResponse = await newTodo.save();

    res.status(201).json({
      success: true,
      response: todoResponse,
      message: "Todo is created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Todo creation",
    });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const todos = await userModel
      .findOne({ email: req.user.email })
      .populate("notes");

    res.status(200).send(todos);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todoID = req.params.id;
    const { title, description, tagName } = req.body;

    const updatedTodo = await todo.findOneAndUpdate(
      { _id: todoID },
      { title, description, lastModified: Date.now(), tagName },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Todo is updated",
      response: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todoID = req.params.id;

    await todo.findByIdAndDelete(todoID);
    res.status(204).json({
      success: true,
      message: "Todo is deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
