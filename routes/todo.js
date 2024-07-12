const express = require("express");
const router = express.Router();

const { signup, login, deleteUser } = require("../controllers/userController");
const { auth } = require("../middlewares/Authz");
const todoController = require("../controllers/todoController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/deleteUser", auth, deleteUser);

// Protected route
router.get("/auth", auth, (req, res) => {
  res.send({
    success: true,
    message: "Welcome to Auth page",
  });
});

router.post("/createTodo", auth, todoController.createTodo);
router.get("/getTodos", auth, todoController.getTodos);
router.put("/updateTodo/:id", auth, todoController.updateTodo);
router.delete("/deleteTodo/:id", auth, todoController.deleteTodo);

module.exports = router;
