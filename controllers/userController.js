const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    // Fetching user details from req body
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      res.status(500).json({
        success: false,
        message: "Fill all details",
      });
    }

    // Checking if the user is already exists
    let existingUser = await user.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Account already exists",
      });
    }

    // Hasing password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password, please try again later",
      });
    }

    // Creating new registred user entry in database
    const newUser = user.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User is created",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      data: "Unable to create user",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // Fetching user details from req body
    const { username, password } = req.body;

    // Validating entries
    if (!username || !password) {
      return res.status(500).json({
        success: false,
        message: "Fill all details",
      });
    }

    // Check if user exists or not
    const isUser = await user.findOne({
      $or: [{ email: username }, { username: username }],
    });
    // console.log(isUser.username, isUser.password);
    if (!isUser) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    if (bcrypt.compare(password, isUser.password)) {
      const payload = {
        email: isUser.email,
        id: isUser._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2hr",
      });

      isUser.toObject();
      isUser.token = token;
      isUser.password = undefined;

      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        isUser,
        message: "Logged in successfully.",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password Incorrect",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // const loggedInUser = req.user;
    console.log(`Delete User: ${req.user.email}`);
    // const email = loggedInUser.email;
    // const response = await user.findOneAndDelete({ email });

    res.status(200).json({
      success: true,
      message: "User is deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      data: "Unable to delete user",
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const response = await user.create({ username, password, userCreatedAt });

    res.status(201).json({
      success: true,
      data: response,
      message: "User is created",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      data: "Unable to create user",
      message: error.message,
    });
  }
};
