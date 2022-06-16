const mongoose = require("mongoose");
// const dotenv = require('dotenv')
const config = require("config");

const db = config.get("mongoURI");

// dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      // server: { socketOptions: { keepAlive: 1 } },
      //    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("mongodb connected");
  } catch (err) {
    console.log(err.message);
    // exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
