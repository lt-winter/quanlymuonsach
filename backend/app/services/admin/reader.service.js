const { ObjectId } = require("mongodb");

class ReaderService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
  }

  extractReaderData(payload) {
    const docGia = {
      hoLot: payload.hoLot,
      ten: payload.ten,
      ngaySinh: new Date(payload.ngaySinh),
      phai: payload.phai,
      diaChi: payload.diaChi,
      dienThoai: payload.dienThoai,
    };
    Object.keys(docGia).forEach(
      (key) => docGia[key] === undefined && delete docGia[key],
    );
    return docGia;
  }

  async create(payload) {
    const docGia = this.extractReaderData(payload);
    const result = await this.DocGia.findOneAndUpdate(
      docGia,
      { $set: { ...docGia, ngayTao: new Date(), ngayCapNhat: new Date() } },
      { returnDocument: "after", upsert: true },
    );
    return { _id: result.insertedId, ...docGia };
  }

  async find(filter, sort = {}) {
    const cursor = await this.DocGia.find(filter).sort(sort);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      ten: {
        $regex: new RegExp(new RegExp(name)),
        $options: "i",
      },
    });
  }

  async findById(id) {
    return await this.DocGia.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractReaderData(payload);
    update.ngayCapNhat = new Date();
    const result = await this.DocGia.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" },
    );
    return result;
  }

  async delete(id) {
    const result = await this.DocGia.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.DocGia.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ReaderService;
