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

  async create(payload) {
    const sach = this.extractBookData(payload);
    const result = await this.Sach.findOneAndUpdate(
      sach,
      { $set: { ...sach, ngayTao: new Date(), ngayCapNhat: new Date() } },
      { returnDocument: "after", upsert: true },
    );
    return { _id: result.insertedId, ...sach };
  }

  async find(filter) {
    const cursor = await this.Sach.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Sach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBookData(payload);
    update.ngayCapNhat = new Date();
    const result = await this.Sach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" },
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Sach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Sach.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BookService;
