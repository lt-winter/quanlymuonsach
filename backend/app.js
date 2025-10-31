const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const readerRoutes = require("./app/routes/docgia.route");

app.use("/api/readers", readerRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Book Backend API!");
});

module.exports = app;
