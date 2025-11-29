const CodeGenerator = require("@/utils/codeGenerator.util");

class BorrowService {
  constructor(client) {
    this.client = client;
    this.TheoDoiMuonSach = client.db().collection("theodoimuonsach");
    this.Sach = client.db().collection("sach");
    this.DocGia = client.db().collection("docgia");
    this.codeGenerator = new CodeGenerator(client);
  }

  // Hạn trả sách: 14 ngày
  static LOAN_PERIOD_DAYS = 14;
  // Phí phạt: 5000đ/ngày quá hạn
  static LATE_FEE_PER_DAY = 5000;

  extractBorrowData(payload) {
    const muonSach = {
      maDocGia: payload.maDocGia, // Giờ là string (DG00001)
      maSach: payload.maSach,     // Giờ là string (SA00001)
      ngayMuon: payload.ngayMuon ? new Date(payload.ngayMuon) : undefined,
      ngayTra: payload.ngayTra ? new Date(payload.ngayTra) : null,
      trangThai: payload.trangThai || "dangMuon", // dangMuon, daTra, matSach
      tienPhat: payload.tienPhat || 0,
      tienBoiThuong: payload.tienBoiThuong || 0,
      ghiChu: payload.ghiChu || "",
    };
    Object.keys(muonSach).forEach(
      (key) => muonSach[key] === undefined && delete muonSach[key]
    );
    return muonSach;
  }

  // Tính hạn trả (14 ngày sau ngày mượn)
  calculateDueDate(ngayMuon) {
    const dueDate = new Date(ngayMuon);
    dueDate.setDate(dueDate.getDate() + BorrowService.LOAN_PERIOD_DAYS);
    return dueDate;
  }

  // Tính tiền phạt quá hạn
  calculateLateFee(ngayMuon, ngayTra) {
    const dueDate = this.calculateDueDate(ngayMuon);
    const returnDate = new Date(ngayTra);
    
    if (returnDate <= dueDate) return 0;
    
    const diffTime = returnDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * BorrowService.LATE_FEE_PER_DAY;
  }

  // Cho mượn sách (Admin tạo phiếu - ghi lại người tạo)
  async create(payload, nguoiTaoId = null) {
    const muonSach = this.extractBorrowData(payload);
    // Sinh mã mượn sách tự động (MS00001, MS00002, ...) - _id để MongoDB tự sinh ObjectId
    muonSach.maMuon = await this.codeGenerator.generateBorrowCode();
    muonSach.ngayTao = new Date();
    muonSach.ngayCapNhat = new Date();
    muonSach.trangThai = "dangMuon";
    muonSach.ngayTra = null;
    muonSach.tienPhat = 0;
    muonSach.tienBoiThuong = 0;
    
    // Ghi lại ID người tạo phiếu (admin)
    if (nguoiTaoId) {
      muonSach.nguoiTao = nguoiTaoId;
    }

    const result = await this.TheoDoiMuonSach.insertOne(muonSach);
    return muonSach;
  }

  // User mượn sách (ghi lại người duyệt khi admin duyệt)
  async createByUser(payload) {
    const muonSach = this.extractBorrowData(payload);
    // Sinh mã mượn sách tự động (MS00001, MS00002, ...) - _id để MongoDB tự sinh ObjectId
    muonSach.maMuon = await this.codeGenerator.generateBorrowCode();
    muonSach.ngayTao = new Date();
    muonSach.ngayCapNhat = new Date();
    muonSach.trangThai = "choDuyet"; // Trạng thái chờ duyệt
    muonSach.ngayTra = null;
    muonSach.tienPhat = 0;
    muonSach.tienBoiThuong = 0;
    muonSach.nguoiDuyet = null; // Sẽ được cập nhật khi admin duyệt

    const result = await this.TheoDoiMuonSach.insertOne(muonSach);
    return muonSach;
  }

  // Admin duyệt phiếu mượn (ghi lại người duyệt)
  async approve(id, nguoiDuyetId) {
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          trangThai: "dangMuon",
          nguoiDuyet: nguoiDuyetId, // Giờ là string (NV00001)
          ngayDuyet: new Date(),
          ngayCapNhat: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    return result;
  }

  // Admin từ chối phiếu mượn
  async reject(id, nguoiDuyetId, lyDo = "") {
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          trangThai: "tuChoi",
          nguoiDuyet: nguoiDuyetId, // Giờ là string (NV00001)
          ngayDuyet: new Date(),
          lyDoTuChoi: lyDo,
          ngayCapNhat: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    return result;
  }

  // Lấy tất cả bản ghi mượn sách (join với độc giả, sách, người tạo, người duyệt)
  async findAll(sort = {}) {
    const pipeline = [
      {
        $lookup: {
          from: "docgia",
          localField: "maDocGia",
          foreignField: "maDocGia",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "maSach",
          as: "sach",
        },
      },
      { $unwind: { path: "$sach", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "nhanvien",
          localField: "nguoiTao",
          foreignField: "maNhanVien",
          as: "nhanVienTao",
        },
      },
      { $unwind: { path: "$nhanVienTao", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "nhanvien",
          localField: "nguoiDuyet",
          foreignField: "maNhanVien",
          as: "nhanVienDuyet",
        },
      },
      { $unwind: { path: "$nhanVienDuyet", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          hanTra: {
            $dateAdd: {
              startDate: "$ngayMuon",
              unit: "day",
              amount: BorrowService.LOAN_PERIOD_DAYS,
            },
          },
        },
      },
      { $sort: sort._id ? sort : { ngayMuon: -1 } },
    ];

    return await this.TheoDoiMuonSach.aggregate(pipeline).toArray();
  }

  // Tìm theo ID (hỗ trợ cả _id và maMuon)
  async findById(id) {
    const { ObjectId } = require("mongodb");
    
    // Xác định filter dựa trên loại id
    let matchFilter;
    if (ObjectId.isValid(id)) {
      // Thử tìm theo _id hoặc maMuon
      matchFilter = { $or: [{ _id: new ObjectId(id) }, { maMuon: id }] };
    } else {
      matchFilter = { maMuon: id };
    }
    
    const pipeline = [
      { $match: matchFilter },
      {
        $lookup: {
          from: "docgia",
          localField: "maDocGia",
          foreignField: "maDocGia",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "maSach",
          as: "sach",
        },
      },
      { $unwind: { path: "$sach", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "nhanvien",
          localField: "nguoiTao",
          foreignField: "maNhanVien",
          as: "nhanVienTao",
        },
      },
      { $unwind: { path: "$nhanVienTao", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "nhanvien",
          localField: "nguoiDuyet",
          foreignField: "maNhanVien",
          as: "nhanVienDuyet",
        },
      },
      { $unwind: { path: "$nhanVienDuyet", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          hanTra: {
            $dateAdd: {
              startDate: "$ngayMuon",
              unit: "day",
              amount: BorrowService.LOAN_PERIOD_DAYS,
            },
          },
        },
      },
    ];

    const results = await this.TheoDoiMuonSach.aggregate(pipeline).toArray();
    return results[0] || null;
  }

  // Trả sách (tính tiền phạt nếu quá hạn)
  async returnBook(id, ngayTra) {
    const borrow = await this.findById(id);
    if (!borrow) return null;

    const tienPhat = this.calculateLateFee(borrow.ngayMuon, ngayTra);

    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      { _id: borrow._id },
      {
        $set: {
          ngayTra: new Date(ngayTra),
          trangThai: "daTra",
          tienPhat,
          ngayCapNhat: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    return result;
  }

  // Báo mất sách (bồi thường = đơn giá sách)
  async reportLost(id) {
    const borrow = await this.findById(id);
    if (!borrow) return null;

    const tienBoiThuong = borrow.sach?.donGia || 0;

    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      { _id: borrow._id },
      {
        $set: {
          trangThai: "matSach",
          tienBoiThuong,
          ngayCapNhat: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    return result;
  }

  // Cập nhật bản ghi
  async update(id, payload) {
    // Tìm document trước để lấy _id thực
    const existing = await this.findById(id);
    if (!existing) return null;
    
    const filter = { _id: existing._id };
    const update = this.extractBorrowData(payload);
    update.ngayCapNhat = new Date();

    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa bản ghi
  async delete(id) {
    // Tìm document trước để lấy _id thực
    const existing = await this.findById(id);
    if (!existing) return null;
    
    return await this.TheoDoiMuonSach.findOneAndDelete({ _id: existing._id });
  }

  // Xóa tất cả
  async deleteAll() {
    const result = await this.TheoDoiMuonSach.deleteMany({});
    return result.deletedCount;
  }

  // Tìm theo độc giả
  async findByReader(readerId) {
    return this.findAll({ maDocGia: readerId });
  }

  // Tìm theo sách
  async findByBook(bookId) {
    return this.findAll({ maSach: bookId });
  }

  // Tìm các sách đang mượn
  async findCurrentlyBorrowed() {
    const pipeline = [
      { $match: { trangThai: "dangMuon" } },
      {
        $lookup: {
          from: "docgia",
          localField: "maDocGia",
          foreignField: "maDocGia",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "maSach",
          as: "sach",
        },
      },
      { $unwind: { path: "$sach", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          hanTra: {
            $dateAdd: {
              startDate: "$ngayMuon",
              unit: "day",
              amount: BorrowService.LOAN_PERIOD_DAYS,
            },
          },
        },
      },
      { $sort: { ngayMuon: -1 } },
    ];

    return await this.TheoDoiMuonSach.aggregate(pipeline).toArray();
  }

  // Tìm các sách quá hạn
  async findOverdue() {
    const today = new Date();
    const pipeline = [
      { $match: { trangThai: "dangMuon" } },
      {
        $addFields: {
          hanTra: {
            $dateAdd: {
              startDate: "$ngayMuon",
              unit: "day",
              amount: BorrowService.LOAN_PERIOD_DAYS,
            },
          },
        },
      },
      { $match: { hanTra: { $lt: today } } },
      {
        $lookup: {
          from: "docgia",
          localField: "maDocGia",
          foreignField: "maDocGia",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "maSach",
          as: "sach",
        },
      },
      { $unwind: { path: "$sach", preserveNullAndEmptyArrays: true } },
      { $sort: { hanTra: 1 } },
    ];

    return await this.TheoDoiMuonSach.aggregate(pipeline).toArray();
  }

  // Thống kê
  async getStats() {
    const today = new Date();
    const [total, choDuyet, dangMuon, daTra, matSach, tuChoi, quaHan] = await Promise.all([
      this.TheoDoiMuonSach.countDocuments(),
      this.TheoDoiMuonSach.countDocuments({ trangThai: "choDuyet" }),
      this.TheoDoiMuonSach.countDocuments({ trangThai: "dangMuon" }),
      this.TheoDoiMuonSach.countDocuments({ trangThai: "daTra" }),
      this.TheoDoiMuonSach.countDocuments({ trangThai: "matSach" }),
      this.TheoDoiMuonSach.countDocuments({ trangThai: "tuChoi" }),
      this.TheoDoiMuonSach.aggregate([
        { $match: { trangThai: "dangMuon" } },
        {
          $addFields: {
            hanTra: {
              $dateAdd: {
                startDate: "$ngayMuon",
                unit: "day",
                amount: BorrowService.LOAN_PERIOD_DAYS,
              },
            },
          },
        },
        { $match: { hanTra: { $lt: today } } },
        { $count: "count" },
      ]).toArray(),
    ]);

    return {
      total,
      choDuyet,
      dangMuon,
      daTra,
      matSach,
      tuChoi,
      quaHan: quaHan[0]?.count || 0,
    };
  }

  // Tìm các phiếu mượn chờ duyệt
  async findPending() {
    const pipeline = [
      { $match: { trangThai: "choDuyet" } },
      {
        $lookup: {
          from: "docgia",
          localField: "maDocGia",
          foreignField: "maDocGia",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "maSach",
          as: "sach",
        },
      },
      { $unwind: { path: "$sach", preserveNullAndEmptyArrays: true } },
      { $sort: { ngayTao: -1 } },
    ];

    return await this.TheoDoiMuonSach.aggregate(pipeline).toArray();
  }
}

module.exports = BorrowService;
