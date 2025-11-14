const employeeService = new EmployeeService();
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.hoTenNv) {
    return next(new ApiError(400, "Họ tên nhân viên không được để trống"));
  }
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo nhân viên"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    documents = await employeeService.find({});
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất nhân viên"));
  }
  return res.send(documents);
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
    return next(new ApiError(500, "Lỗi khi truy xuất nhân viên"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Nhân viên không tồn tại"));
    }
    return res.send(document);
  } catch (error) {
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
    return next(new ApiError(500, "Lỗi khi xóa nhân viên"));
  }
};
