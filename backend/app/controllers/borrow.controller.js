const BorrowService = require("../services/borrow.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.borrowBook = async (req, res, next) => {
  if (!req.body?.maDocGia || !req.body?.maSach || !req.body?.ngayMuon) {
    return next(new ApiError(400, "Thiếu thông tin mượn sách"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const borrowRecord = await borrowService.borrow(
      req.body.maDocGia,
      req.body.maSach,
      req.body.ngayMuon,
    );
    return res.send(borrowRecord);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cho độc giả mượn sách"));
  }
};

exports.returnBook = async (req, res, next) => {
  if (!req.params?.borrowId || !req.body?.ngayTra) {
    return next(new ApiError(400, "Thiếu thông tin trả sách"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const updatedRecord = await borrowService.returnBook(
      req.params.borrowId,
      req.body.ngayTra,
    );
    return res.send(updatedRecord);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi trả sách"));
  }
};

exports.findBorrowsByReader = async (req, res, next) => {
  if (!req.params?.readerId) {
    return next(new ApiError(400, "Thiếu thông tin độc giả"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const records = await borrowService.findByReader(req.params.readerId);
    return res.send(records);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm bản ghi mượn theo độc giả"));
  }
};

exports.findBorrowsByBook = async (req, res, next) => {
  if (!req.params?.bookId) {
    return next(new ApiError(400, "Thiếu thông tin sách"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const records = await borrowService.findByBook(req.params.bookId);
    return res.send(records);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm bản ghi mượn theo sách"));
  }
};
exports.findUnreturnedBorrows = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const records = await borrowService.findUnreturned();
    return res.send(records);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm bản ghi chưa trả"));
  }
};
exports.findOverdueBorrows = async (req, res, next) => {
  if (!req.query?.today) {
    return next(new ApiError(400, "Thiếu thông tin ngày hiện tại"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const records = await borrowService.findOverdue(req.query.today);
    return res.send(records);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm bản ghi quá hạn"));
  }
};
