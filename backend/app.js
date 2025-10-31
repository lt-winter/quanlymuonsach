const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

const readerRoutes = require("./app/routes/docgia.route");

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.use("/api/readers", readerRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Book Backend API!");
});

module.exports = app;
