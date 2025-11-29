const { ObjectId } = require("mongodb");

class BorrowService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection("theodoimuonsach");
    this.Sach = client.db().collection("sach");
    this.DocGia = client.db().collection("docgia");
  }

  // Hạn trả sách: 14 ngày
  static LOAN_PERIOD_DAYS = 14;
  // Phí phạt: 5000đ/ngày quá hạn
  static LATE_FEE_PER_DAY = 5000;

  extractBorrowData(payload) {
    const muonSach = {
      maDocGia: payload.maDocGia ? new ObjectId(payload.maDocGia) : undefined,
      maSach: payload.maSach ? new ObjectId(payload.maSach) : undefined,
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

  // Cho mượn sách
  async create(payload) {
    const muonSach = this.extractBorrowData(payload);
    muonSach.ngayTao = new Date();
    muonSach.ngayCapNhat = new Date();
    muonSach.trangThai = "dangMuon";
    muonSach.ngayTra = null;
    muonSach.tienPhat = 0;
    muonSach.tienBoiThuong = 0;

    const result = await this.TheoDoiMuonSach.insertOne(muonSach);
    return { _id: result.insertedId, ...muonSach };
  }

  // Lấy tất cả bản ghi mượn sách (join với độc giả và sách)
  async findAll(sort = {}) {
    const pipeline = [
      {
        $lookup: {
          from: "docgia",
          localField: "maDocGia",
          foreignField: "_id",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "_id",
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
      { $sort: sort._id ? sort : { ngayMuon: -1 } },
    ];

    return await this.TheoDoiMuonSach.aggregate(pipeline).toArray();
  }

  // Tìm theo ID
  async findById(id) {
    const pipeline = [
      { $match: { _id: ObjectId.isValid(id) ? new ObjectId(id) : null } },
      {
        $lookup: {
          from: "docgia",
          localField: "maDocGia",
          foreignField: "_id",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "_id",
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
      { _id: new ObjectId(id) },
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
      { _id: new ObjectId(id) },
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
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
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
    return await this.TheoDoiMuonSach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Xóa tất cả
  async deleteAll() {
    const result = await this.TheoDoiMuonSach.deleteMany({});
    return result.deletedCount;
  }

  // Tìm theo độc giả
  async findByReader(readerId) {
    return this.findAll({ maDocGia: new ObjectId(readerId) });
  }

  // Tìm theo sách
  async findByBook(bookId) {
    return this.findAll({ maSach: new ObjectId(bookId) });
  }

  // Tìm các sách đang mượn
  async findCurrentlyBorrowed() {
    const pipeline = [
      { $match: { trangThai: "dangMuon" } },
      {
        $lookup: {
          from: "docgia",
          localField: "maDocGia",
          foreignField: "_id",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "_id",
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
          foreignField: "_id",
          as: "docGia",
        },
      },
      { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sach",
          localField: "maSach",
          foreignField: "_id",
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
    const [total, dangMuon, daTra, matSach, quaHan] = await Promise.all([
      this.TheoDoiMuonSach.countDocuments(),
      this.TheoDoiMuonSach.countDocuments({ trangThai: "dangMuon" }),
      this.TheoDoiMuonSach.countDocuments({ trangThai: "daTra" }),
      this.TheoDoiMuonSach.countDocuments({ trangThai: "matSach" }),
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
      dangMuon,
      daTra,
      matSach,
      quaHan: quaHan[0]?.count || 0,
    };
  }
}

module.exports = BorrowService;
