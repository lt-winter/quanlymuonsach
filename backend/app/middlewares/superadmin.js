const ApiError = require("../api-error");

module.exports = (req, res, next) => {
  if (!req.user || (req.user.role !== "superadmin" && req.user.role !== "admin")) {
    return next(
      new ApiError(403, "Bạn không có quyền truy cập tài nguyên này"),
    );
  }
  next();
};
