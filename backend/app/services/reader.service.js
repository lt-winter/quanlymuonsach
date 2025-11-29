const CodeGenerator = require("@/utils/codeGenerator.util");

class ReaderService {
  constructor(client) {
    this.client = client;
    this.DocGia = client.db().collection("docgia");
    this.codeGenerator = new CodeGenerator(client);
  }

  extractReaderData(payload) {
    const docGia = {
      maDocGia: payload.maDocGia,
      hoLot: payload.hoLot,
      ten: payload.ten,
      ngaySinh: payload.ngaySinh ? new Date(payload.ngaySinh) : undefined,
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
    const code = await this.codeGenerator.generateReaderCode();

    docGia.maDocGia = code;
    docGia.ngayTao = new Date();
    docGia.ngayCapNhat = new Date();

    const result = await this.DocGia.insertOne(docGia);
    return result;
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
    // Thử tìm theo _id trước, nếu không có thì tìm theo maDocGia
    const { ObjectId } = require("mongodb");
    let doc = null;

    // Nếu id là ObjectId hợp lệ, tìm theo _id
    if (ObjectId.isValid(id)) {
      doc = await this.DocGia.findOne({ _id: new ObjectId(id) });
    }
    // Nếu không tìm thấy, thử tìm theo maDocGia
    if (!doc) {
      doc = await this.DocGia.findOne({ maDocGia: id });
    }
    return doc;
  }

  async update(id, payload) {
    // Tìm document trước để lấy _id thực
    const existing = await this.findById(id);
    if (!existing) return null;

    const filter = { _id: existing._id };
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
    // Tìm document trước để lấy _id thực
    const existing = await this.findById(id);
    if (!existing) return null;

    const result = await this.DocGia.findOneAndDelete({ _id: existing._id });
    return result;
  }

  async deleteAll() {
    const result = await this.DocGia.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ReaderService;
