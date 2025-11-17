const express = require("express");
const cors = require("cors");

require("module-alias/register");

const readerRoutes = require("./app/routes/reader.route");
const publisherRoutes = require("./app/routes/publisher.route");
const bookRoutes = require("./app/routes/book.route");
const borrowRoutes = require("./app/routes/borrow.route");
const employeeRoutes = require("./app/routes/employee.route");

const readerAdminRoutes = require("./app/routes/admin/reader.route");
const publisherAdminRoutes = require("./app/routes/admin/publisher.route");
const bookAdminRoutes = require("./app/routes/admin/book.route");
const borrowAdminRoutes = require("./app/routes/admin/borrow.route");
const employeeAdminRoutes = require("./app/routes/admin/employee.route");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Book Backend API!");
});
// routes
app.use("/api/readers", readerRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);
// app.use("/api/employees", employeeRoutes);

app.use("/api/admin/readers", readerAdminRoutes);
app.use("/api/admin/publishers", publisherAdminRoutes);
app.use("/api/admin/books", bookAdminRoutes);
app.use("/api/admin/borrows", borrowAdminRoutes);
app.use("/api/admin/employees", employeeAdminRoutes);

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
