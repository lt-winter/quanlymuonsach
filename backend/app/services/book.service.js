const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Sach = client.db().collection("sach");
  }
  extractBookData(payload) {
    const sach = {
      tenSach: payload.tenSach,
      donGia: payload.donGia,
      soQuyen: payload.soQuyen,
      namXuatBan: payload.namXuatBan,
      maNXB: new ObjectId(payload.maNXB),
      tacGia: payload.tacGia,
    };
    Object.keys(sach).forEach(
      (key) => sach[key] === undefined && delete sach[key],
    );
    return sach;
  }

  async find(filter, sort = {}) {
    const cursor = await this.Sach.find(filter).sort(sort);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Sach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
}

module.exports = BookService;
