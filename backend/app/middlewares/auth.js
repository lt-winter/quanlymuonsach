const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ApiError(401, "Không có token đăng nhập"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn"));
  }
};
