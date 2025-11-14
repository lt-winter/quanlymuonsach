const PublisherService = require("../services/publisher.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.tenNXB) {
    return next(new ApiError(400, "Tên nhà xuất bản không được để trống"));
  }
  if (!req.body?.diaChi) {
    return next(new ApiError(400, "Địa chỉ không được để trống"));
  }
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi thêm nhà xuất bản: ${error.message}`,
      ),
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await publisherService.findByName(name);
    } else {
      documents = await publisherService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi truy xuất nhà xuất bản: ${error.message}`,
      ),
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Nhà xuất bản không tồn tại"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi truy xuất nhà xuất bản: ${error.message}`,
      ),
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu để cập nhật không được để trống"));
  }
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Nhà xuất bản không tồn tại"));
    }
    return res.send({ message: "Nhà xuất bản đã được cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi cập nhật nhà xuất bản: ${error.message}`,
      ),
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Nhà xuất bản không tồn tại"));
    }
    return res.send({ message: "Nhà xuất bản đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Có lỗi xảy ra khi xóa nhà xuất bản: ${error.message}`),
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const deletedCount = await publisherService.deleteAll();
    return res.send({
      message: `${deletedCount} nhà xuất bản đã được xóa thành công`,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi xóa tất cả nhà xuất bản: ${error.message}`,
      ),
    );
  }
};
