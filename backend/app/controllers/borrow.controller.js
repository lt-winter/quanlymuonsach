const BorrowService = require("../services/borrow.service");
const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const { name, sortBy, order } = req.query;
    if (name) {
      documents = await borrowService.findByName(name);
    } else {
      const sort = {};
      if (!sortBy) sort["_id"] = order === "desc" ? -1 : 1;
      else sort[sortBy] = order === "desc" ? -1 : 1;
      documents = await borrowService.findAll(sort);
    }
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "Lỗi khi tìm bản ghi mượn sách: " + error.message),
    );
  }
};

exports.borrowBook = async (req, res, next) => {
  if (!req.body?.maDocGia || !req.body?.maSach || !req.body?.ngayMuon) {
    return next(
      new ApiError(
        400,
        "Thiếu thông tin mượn sách " + JSON.stringify(req.body),
      ),
    );
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const borrowRecord = await borrowService.borrow(
      req.body.maDocGia,
      req.body.maSach,
      req.body.ngayMuon,
    );
    
    // Gửi thông báo cho độc giả
    try {
      const readerService = new ReaderService(MongoDB.client);
      await readerService.addNotification(req.body.maDocGia, {
        tieuDe: "Tạo phiếu mượn thành công",
        noiDung: `Bạn đã tạo phiếu mượn sách thành công. Vui lòng chờ nhân viên thư viện duyệt.`,
        loai: "BORROW_CREATED",
        maMuon: borrowRecord.maMuon,
      });
    } catch (notifError) {
      // Không throw lỗi notification để không ảnh hưởng flow chính
    }
    
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
  if (!req.params?.maSach) {
    return next(new ApiError(400, "Thiếu thông tin sách"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const records = await borrowService.findByBook(req.params.maSach);
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

exports.getMyBorrows = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    // req.user.maDocGia được set từ JWT token
    const records = await borrowService.findByReaderWithMaDocGia(
      req.user.maDocGia,
    );
    return res.send(records);
  } catch (error) {
    return next(
      new ApiError(500, "Lỗi khi lấy danh sách sách đã mượn: " + error.message),
    );
  }
};

exports.reportLost = async (req, res, next) => {
  if (!req.params?.maMuon) {
    return next(new ApiError(400, "Thiếu mã phiếu mượn"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const updatedRecord = await borrowService.reportLost(
      req.params.maMuon,
      req.user.maDocGia,
    );
    return res.send(updatedRecord);
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi khi báo mất sách"));
  }
};
