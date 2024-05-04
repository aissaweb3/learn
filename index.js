require("dotenv").config();
const express = require("express");
const app = express();

//--------------cors
const cors = require("cors");
app.use(cors());
//--------------cors

//--------------bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//--------------bodyParser

//--------------routes
const main = require("./routers/main");
app.use("/", main);
const auth = require("./routers/auth");
app.use("/auth", auth);
const root = require("./routers/root");
app.use("/root", root);
const user = require("./routers/user");
app.use("/user", user);
//--------------routes

app.listen(5000, () => {
  console.log("running on 5000");
});
