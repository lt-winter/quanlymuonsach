const express = require("express");
const cors = require("cors");

const readerRoutes = require("./app/routes/reader.route");
const publisherRoutes = require("./app/routes/publisher.route");
const bookRoutes = require("./app/routes/book.route");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Book Backend API!");
});

app.use("/api/readers", readerRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/books", bookRoutes);

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
