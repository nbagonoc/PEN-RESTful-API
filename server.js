const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// INIT App
const app = express();

// MIDDLEWARES
// cors
app.use(cors());
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
