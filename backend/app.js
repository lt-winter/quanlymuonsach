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
const reportAdminRoutes = require("./app/routes/admin/report.route");

const auth = require("./app/middlewares/auth");
const superadmin = require("./app/middlewares/superadmin");

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

// Admin login - không cần auth
const employeeController = require("./app/controllers/admin/employee.controller");
app.post("/api/admin/employees/login", employeeController.login);

// Admin routes with auth
app.use("/api/admin/readers", auth, superadmin, readerAdminRoutes);
app.use("/api/admin/publishers", auth, superadmin, publisherAdminRoutes);
app.use("/api/admin/books", auth, superadmin, bookAdminRoutes);
app.use("/api/admin/borrows", auth, superadmin, borrowAdminRoutes);
app.use("/api/admin/employees", auth, superadmin, employeeAdminRoutes);
app.use("/api/admin/reports", auth, superadmin, reportAdminRoutes);

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
