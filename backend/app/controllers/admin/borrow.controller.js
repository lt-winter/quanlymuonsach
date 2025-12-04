const BorrowService = require("@/services/admin/borrow.service");
const ReaderService = require("@/services/reader.service");
const MongoDB = require("@/utils/mongodb.util");
const ApiError = require("@/api-error");

// Tạo phiếu mượn sách (Admin tạo - ghi lại người tạo)
exports.create = async (req, res, next) => {
  if (!req.body?.maDocGia || !req.body?.maSach) {
    return next(
      new ApiError(400, "Thiếu thông tin mượn sách (độc giả hoặc sách)"),
    );
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    // Lấy ID người tạo từ token (đã được xác thực qua middleware)
    const nguoiTaoId = req.user?._id || null;
    const document = await borrowService.create(req.body, nguoiTaoId);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi tạo phiếu mượn: ${error.message}`),
    );
  }
};

// Lấy tất cả bản ghi mượn sách
exports.findAll = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const { sortBy, order, filter } = req.query;

    let documents;
    if (filter === "dangMuon") {
      documents = await borrowService.findCurrentlyBorrowed();
    } else if (filter === "quaHan") {
      documents = await borrowService.findOverdue();
    } else if (filter === "choDuyet") {
      documents = await borrowService.findPending();
    } else {
      const sort = {};
      if (!sortBy) sort["_id"] = order === "desc" ? -1 : 1;
      else sort[sortBy] = order === "desc" ? -1 : 1;
      documents = await borrowService.findAll(sort);
    }
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi truy xuất danh sách mượn sách: ${error.message}`,
      ),
    );
  }
};

// Lấy một bản ghi theo ID
exports.findOne = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất phiếu mượn: ${error.message}`),
    );
  }
};

// Cập nhật bản ghi
exports.update = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật phiếu mượn: ${error.message}`),
    );
  }
};

// Trả sách
exports.returnBook = async (req, res, next) => {
  if (!req.body?.ngayTra) {
    return next(new ApiError(400, "Thiếu ngày trả sách"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.returnBook(
      req.params.id,
      req.body.ngayTra,
    );
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    
    // Gửi thông báo cho độc giả
    try {
      const readerService = new ReaderService(MongoDB.client);
      await readerService.addNotification(document.maDocGia, {
        tieuDe: "Trả sách thành công",
        noiDung: `Bạn đã trả sách "${document.sach?.tenSach || 'Unknown'}" thành công.`,
        loai: "BORROW_RETURNED",
        maMuon: document.maMuon,
      });
    } catch (notifError) {
      // Không throw lỗi notification để không ảnh hưởng flow chính
    }
    
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi trả sách: ${error.message}`));
  }
};

// Báo mất sách
exports.reportLost = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.reportLost(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi báo mất sách: ${error.message}`));
  }
};

// Xóa bản ghi
exports.delete = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send({ message: "Phiếu mượn đã được xóa thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa phiếu mượn: ${error.message}`));
  }
};

// Xóa tất cả
exports.deleteAll = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const deletedCount = await borrowService.deleteAll();
    return res.send({
      message: `${deletedCount} phiếu mượn đã được xóa thành công`,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa tất cả phiếu mượn: ${error.message}`),
    );
  }
};

// Thống kê
exports.getStats = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const stats = await borrowService.getStats();
    return res.send(stats);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy thống kê: ${error.message}`));
  }
};

// Duyệt phiếu mượn (cho user mượn)
exports.approve = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    // Lấy ID người duyệt từ token (đã được xác thực qua middleware)
    const nguoiDuyetId = req.user?._id || null;
    const document = await borrowService.approve(req.params.id, nguoiDuyetId);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    
    // Gửi thông báo cho độc giả
    try {
      const readerService = new ReaderService(MongoDB.client);
      await readerService.addNotification(document.maDocGia, {
        tieuDe: "Phiếu mượn được duyệt",
        noiDung: `Phiếu mượn sách "${document.sach?.tenSach || 'Unknown'}" của bạn đã được duyệt. Vui lòng đến thư viện để nhận sách.`,
        loai: "BORROW_APPROVED",
        maMuon: document.maMuon,
      });
    } catch (notifError) {
      // Không throw lỗi notification để không ảnh hưởng flow chính
    }
    
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi duyệt phiếu mượn: ${error.message}`),
    );
  }
};

// Từ chối phiếu mượn
exports.reject = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    // Lấy ID người duyệt từ token (đã được xác thực qua middleware)
    const nguoiDuyetId = req.user?._id || null;
    const lyDo = req.body?.lyDo || "";
    const document = await borrowService.reject(req.params.id, nguoiDuyetId, lyDo);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    
    // Gửi thông báo cho độc giả
    try {
      const readerService = new ReaderService(MongoDB.client);
      const lyDoText = lyDo ? ` Lý do: ${lyDo}` : "";
      await readerService.addNotification(document.maDocGia, {
        tieuDe: "Phiếu mượn bị từ chối",
        noiDung: `Phiếu mượn sách "${document.sach?.tenSach || 'Unknown'}" của bạn đã bị từ chối.${lyDoText}`,
        loai: "BORROW_REJECTED",
        maMuon: document.maMuon,
      });
    } catch (notifError) {
      // Không throw lỗi notification để không ảnh hưởng flow chính
    }
    
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi từ chối phiếu mượn: ${error.message}`),
    );
  }
};

// Lấy danh sách phiếu chờ duyệt
exports.findPending = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const documents = await borrowService.findPending();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy danh sách phiếu chờ duyệt: ${error.message}`),
    );
  }
};
