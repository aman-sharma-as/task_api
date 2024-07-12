const mongoose = require("mongoose");

require("dotenv").config();

exports.dbConnect = () => {
  mongoose
    .connect(process.env.DBURL)
    .then(() => {
      console.log("Database is connected");
    })
    .catch((error) => {
      console.log("Error in Database connection");
      console.log(error);
      process.exit(1);
    });
};

// module.exports = dbConnect;
