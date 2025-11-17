const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
  const { sortBy, order } = req.query;
  let documents = [];
  try {
    const bookService = new BookService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await bookService.findByName(name);
    } else {
      const sort = {};
      if (!sortBy) {
        sort["_id"] = order === "desc" ? -1 : 1;
      } else {
        const sortOrder = order === "desc" ? -1 : 1;
        sort[sortBy] = sortOrder;
      }
      documents = await bookService.find({}, sort);
    }
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi truy xuất sách: ${error.message}`),
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Sách không tồn tại"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi truy xuất sách: ${error.message}`),
    );
  }
};
