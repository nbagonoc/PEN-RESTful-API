const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// INIT App
const app = express();

// CONFIG
const db = require("./config/dbSecretKeys").mongoURI;

// DB CONNECT
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("we are connected to the DB");
  })
  .catch(err => console.log(err));

//   MIDDLEWARES
// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// REQUIRE ROUTES
const items = require("./routes/api/items");

// USE ROUTES
app.use("/api/items", items);

// SET PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`we are live at ${port}`);
});