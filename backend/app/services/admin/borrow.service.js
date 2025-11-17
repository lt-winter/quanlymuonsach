class BorrowService {
  constructor(client) {
    this.Borrow = client.db().collection("theodoimuonsach");
  }
  extractBorrowData(payload) {
    const borrow = {
      maDocGia: payload.maDocGia,
      maSach: payload.maSach,
      maNhanVien: payload.maNhanVien,
      ngayMuon: payload.ngayMuon,
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

  // Cho độc giả mượn sách
  async borrow(maDocGia, maSach, ngayMuon) {
    const data = {
      maDocGia: new ObjectId(maDocGia),
      maSach: new ObjectId(maSach),
      ngayMuon,
      ngayTra: null,
    };
    const result = await this.Borrow.findOneAndUpdate(
      data,
      { $set: { ...data, ngayTao: new Date(), ngayCapNhat: new Date() } },
      { returnDocument: "after", upsert: true },
    );
    return { _id: result.value._id, ...data };
  }

  // Trả sách
  async returnBook(borrowId, ngayTra) {
    return await this.Borrow.findOneAndUpdate(
      { _id: new ObjectId(borrowId) },
      { $set: { ngayTra } },
      { returnDocument: "after" },
    );
  }

  // Tìm các bản ghi mượn theo độc giả
  async findByReader(readerId) {
    return this.Borrow.find({ maDocGia: new ObjectId(readerId) }).toArray();
  }

  // Tìm các bản ghi mượn theo sách
  async findByBook(bookId) {
    return this.Borrow.find({ maSach: new ObjectId(bookId) }).toArray();
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
}

module.exports = BorrowService;
