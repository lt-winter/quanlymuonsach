const CodeGenerator = require("@/utils/codeGenerator.util");

class BorrowService {
  constructor(client) {
    this.client = client;
    this.Borrow = client.db().collection("theodoimuonsach");
    this.Sach = client.db().collection("sach");
    this.codeGenerator = new CodeGenerator(client);
  }

  // Hạn trả sách: 14 ngày
  static LOAN_PERIOD_DAYS = 14;

  extractBorrowData(payload) {
    const borrow = {
      maDocGia: payload.maDocGia,
      maSach: payload.maSach,
      maNhanVien: payload.maNhanVien,
      ngayMuon: payload.ngayMuon ? new Date(payload.ngayMuon) : undefined,
      ngayTraDuKien: payload.ngayTraDuKien,
      ngayTraThucTe: payload.ngayTraThucTe,
    };
    return borrow;
  }

  // Lấy tất cả bản ghi mượn
  async findAll() {
    const cursor = await this.Borrow.find();
    return await cursor.toArray();
  }

  // User đăng ký mượn sách (chờ duyệt)
  async borrow(maDocGia, maSach, ngayMuon) {
    // Kiểm tra số lượng sách còn lại
    const book = await this.Sach.findOne({ maSach: maSach });
    if (!book) {
      throw new Error("Sách không tồn tại");
    }
    if (book.soQuyen <= 0) {
      throw new Error("Sách đã hết, không thể mượn");
    }

    // Sinh mã mượn sách tự động (MS00001, MS00002, ...) - _id để MongoDB tự sinh ObjectId
    const maMuon = await this.codeGenerator.generateBorrowCode();

    const data = {
      maMuon,
      maDocGia,
      maSach,
      ngayMuon: new Date(ngayMuon),
      ngayTra: null,
      trangThai: "choDuyet", // Trạng thái chờ admin duyệt
      tienPhat: 0,
      tienBoiThuong: 0,
      nguoiDuyet: null, // Sẽ được cập nhật khi admin duyệt
      ngayTao: new Date(),
      ngayCapNhat: new Date(),
    };

    await this.Borrow.insertOne(data);
    
    // Không trừ số lượng sách ở đây, chỉ trừ khi admin duyệt

    return data;
  }

  // Trả sách
  async returnBook(borrowId, ngayTra) {
    return await this.Borrow.findOneAndUpdate(
      { _id: borrowId },
      { $set: { ngayTra: new Date(ngayTra), ngayCapNhat: new Date() } },
      { returnDocument: "after" },
    );
  }

  // Tìm các bản ghi mượn theo độc giả (dùng ObjectId)
  async findByReader(readerId) {
    const pipeline = [
      { $match: { maDocGia: readerId } },
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
    return await this.Borrow.aggregate(pipeline).toArray();
  }

  // Tìm các bản ghi mượn theo mã độc giả (dùng cho user đăng nhập)
  async findByReaderWithMaDocGia(maDocGia) {
    const pipeline = [
      { $match: { maDocGia: maDocGia } },
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
          ngayTraDuKien: {
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
    return await this.Borrow.aggregate(pipeline).toArray();
  }

  // Tìm các bản ghi mượn theo sách
  async findByBook(maSach) {
    return this.Borrow.find({ maSach: maSach }).toArray();
  }

  // Tìm các bản ghi chưa trả
  async findUnreturned() {
    return this.Borrow.find({ ngayTra: null }).toArray();
  }

  // Tìm các bản ghi quá hạn
  async findOverdue(today) {
    return this.Borrow.find({
      ngayTra: null,
      ngayMuon: { $lt: today },
    }).toArray();
  }

  // Báo mất sách (user)
  async reportLost(maMuon, maDocGia) {
    // Kiểm tra phiếu mượn có thuộc về user này không
    const borrow = await this.Borrow.findOne({ maMuon, maDocGia });
    if (!borrow) {
      throw new Error("Không tìm thấy phiếu mượn");
    }
    
    if (borrow.trangThai === "daTraSach") {
      throw new Error("Sách đã được trả, không thể báo mất");
    }
    
    if (borrow.trangThai === "matSach") {
      throw new Error("Sách đã được báo mất trước đó");
    }

    // Cập nhật trạng thái thành "matSach"
    return await this.Borrow.findOneAndUpdate(
      { maMuon, maDocGia },
      { 
        $set: { 
          trangThai: "matSach",
          ngayCapNhat: new Date()
        } 
      },
      { returnDocument: "after" }
    );
  }
}

module.exports = BorrowService;
