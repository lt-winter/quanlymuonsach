const CodeGenerator = require("@/utils/codeGenerator.util");

class PublisherService {
  constructor(client) {
    this.client = client;
    this.NhaXuatBan = client.db().collection("nhaxuatban");
    this.codeGenerator = new CodeGenerator(client);
  }

  extractPublisherData(payload) {
    const nhaXuatBan = {
      tenNXB: payload.tenNXB,
      diaChi: payload.diaChi,
    };
    Object.keys(nhaXuatBan).forEach(
      (key) => nhaXuatBan[key] === undefined && delete nhaXuatBan[key],
    );
    return nhaXuatBan;
  }

  async create(payload) {
    const nhaXuatBan = this.extractPublisherData(payload);

    nhaXuatBan.maNXB = await this.codeGenerator.generatePublisherCode();
    nhaXuatBan.ngayTao = new Date();
    nhaXuatBan.ngayCapNhat = new Date();

    const result = await this.NhaXuatBan.insertOne(nhaXuatBan);
    return result;
  }

  async find(filter, sort = {}) {
    const cursor = await this.NhaXuatBan.find(filter).sort(sort);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      tenNXB: {
        $regex: new RegExp(new RegExp(name)),
        $options: "i",
      },
    });
  }

  async findById(id) {
    // Thử tìm theo _id trước, nếu không có thì tìm theo maNXB
    const { ObjectId } = require("mongodb");
    let doc = null;

    // Nếu id là ObjectId hợp lệ, tìm theo _id
    if (ObjectId.isValid(id)) {
      doc = await this.NhaXuatBan.findOne({ _id: new ObjectId(id) });
    }
    // Nếu không tìm thấy, thử tìm theo maNXB
    if (!doc) {
      doc = await this.NhaXuatBan.findOne({ maNXB: id });
    }
    return doc;
  }

  async update(id, payload) {
    // Tìm document trước để lấy _id thực
    const existing = await this.findById(id);
    if (!existing) return null;

    const filter = { _id: existing._id };
    const update = this.extractPublisherData(payload);
    update.ngayCapNhat = new Date();
    const result = await this.NhaXuatBan.findOneAndUpdate(
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

    const result = await this.NhaXuatBan.findOneAndDelete({
      _id: existing._id,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.NhaXuatBan.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = PublisherService;
