// Importing external files
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

// Importing local files
const database = require("./config/database");

const todoRoutes = require("./routes/todo");

let corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Defining the port
const port = process.env.PORT || 4000;

// Listening to the app
app.listen(port, () => {
  console.log(`App is started at ${port}`);
});

// Calling the database functions
database.dbConnect();

// Creating default routes
app.get("/", (req, res) => {
  res.send("<h1>Home Route</h1>");
});

app.use("/api/v1/", todoRoutes);
