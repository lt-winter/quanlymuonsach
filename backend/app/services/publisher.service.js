const { ObjectId } = require("mongodb");

class PublisherService {
  constructor(client) {
    this.NhaXuatBan = client.db().collection("nhaxuatban");
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
    const result = await this.NhaXuatBan.findOneAndUpdate(
      nhaXuatBan,
      { $set: { ...nhaXuatBan, ngayTao: new Date(), ngayCapNhat: new Date() } },
      { returnDocument: "after", upsert: true },
    );
    return { _id: result.insertedId, ...nhaXuatBan };
  }

  async find(filter) {
    const cursor = await this.NhaXuatBan.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      tenNhaXuatBan: {
        $regex: new RegExp(new RegExp(name)),
        $options: "i",
      },
    });
  }

  async findById(id) {
    return await this.NhaXuatBan.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
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
    const result = await this.NhaXuatBan.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.NhaXuatBan.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = PublisherService;
