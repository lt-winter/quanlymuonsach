const CodeGenerator = require("@/utils/codeGenerator.util");

class BookService {
  constructor(client) {
    this.client = client;
    this.Sach = client.db().collection("sach");
    this.codeGenerator = new CodeGenerator(client);
  }
  extractBookData(payload) {
    const sach = {
      tenSach: payload.tenSach,
      donGia: payload.donGia,
      soQuyen: payload.soQuyen,
      namXuatBan: payload.namXuatBan,
      maNXB: payload.maNXB, // Giờ là string (XB00001)
      tacGia: payload.tacGia,
      anhSach: payload.anhSach,
      moTa: payload.moTa,
    };
    Object.keys(sach).forEach(
      (key) => sach[key] === undefined && delete sach[key],
    );
    return sach;
  }

  async create(payload) {
    const sach = this.extractBookData(payload);
    // Sinh mã sách tự động (SA00001, SA00002, ...) - _id để MongoDB tự sinh ObjectId
    sach.maSach = await this.codeGenerator.generateBookCode();
    sach.ngayTao = new Date();
    sach.ngayCapNhat = new Date();

    const result = await this.Sach.insertOne(sach);
    return sach;
  }

  async find(filter, sort = {}) {
    const cursor = await this.Sach.find(filter).sort(sort);
    return await cursor.toArray();
  }

  async findById(id) {
    // Thử tìm theo _id trước, nếu không có thì tìm theo maSach
    const { ObjectId } = require("mongodb");
    let doc = null;
    
    // Nếu id là ObjectId hợp lệ, tìm theo _id
    if (ObjectId.isValid(id)) {
      doc = await this.Sach.findOne({ _id: new ObjectId(id) });
    }
    // Nếu không tìm thấy, thử tìm theo maSach
    if (!doc) {
      doc = await this.Sach.findOne({ maSach: id });
    }
    return doc;
  }

  async update(id, payload) {
    // Tìm document trước để lấy _id thực
    const existing = await this.findById(id);
    if (!existing) return null;
    
    const filter = { _id: existing._id };
    const update = this.extractBookData(payload);
    update.ngayCapNhat = new Date();
    const result = await this.Sach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" },
    );
    return result;
  }

  async delete(id) {
    // Tìm document trước để lấy _id thực
    const existing = await this.findById(id);
    if (!existing) return null;
    
    const result = await this.Sach.findOneAndDelete({ _id: existing._id });
    return result;
  }

  async deleteAll() {
    const result = await this.Sach.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BookService;
