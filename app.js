const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const apiRouter = require("./routes/api-router.js");
const { DB_URL } =
  process.env.NODE_ENV === "production" ? process.env : require("./config");
const bodyParser = require("body-parser");

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.set("view-engine", "ejs");
app.use(express.static("public"));
mongoose
  .connect(
    "mongodb://kai:checking123@ds261136.mlab.com:61136/checkingdb",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log(`connect to ${DB_URL}...`);
  });

app.get("/", (req, res, next) => {
  res.sendFile(`${__dirname}/views/home.html`);
});

app.use("/api", apiRouter);

app.get("/*", (req, res, next) => {
  next({ status: 404, msg: "Resource not found" });
});

app.use((err, req, res, next) => {
  if (err.name === "CastError" || err.status === 400)
    res.status(400).send({ msg: "Bad request" });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: "Page not found" });
  else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
