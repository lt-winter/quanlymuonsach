const EmployeeService = require("@/services/admin/employee.service");
const MongoDB = require("@/utils/mongodb.util");
const ApiError = require("@/api-error");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new ApiError(400, "Vui lòng nhập username và mật khẩu"));
    }

    const employeeService = new EmployeeService(MongoDB.client);
    const user = await employeeService.login(username, password);

    if (!user) {
      return next(new ApiError(401, "Sai tài khoản hoặc mật khẩu"));
    }

    // Tạo token
    const token = jwt.sign(
      {
        id: user._id,
        hoTenNv: user.hoTenNv,
        role: user.vaiTro,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.send({
      message: "Đăng nhập thành công",
      user: {
        _id: user._id,
        username: user.tenNguoiDung,
        fullName: user.hoTenNv,
        role: user.vaiTro,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.create = async (req, res, next) => {
  if (!req.body?.hoTenNv) {
    return next(new ApiError(400, "Họ tên nhân viên không được để trống"));
  }

  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi tạo nhân viên: " + error.message));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const documents = await employeeService.find({});
    return res.send(documents);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi truy xuất danh sách nhân viên"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Nhân viên không tồn tại"));
    }

    return res.send(document);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi truy xuất nhân viên"));
  }
};

// ======================================================
// UPDATE
// ======================================================
exports.update = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Nhân viên không tồn tại"));
    }

    return res.send(document);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi cập nhật nhân viên"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Nhân viên không tồn tại"));
    }

    return res.send({ message: "Nhân viên đã được xóa thành công" });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi xóa nhân viên"));
  }
};
