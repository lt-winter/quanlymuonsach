const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

class EmployeeService {
  constructor(client) {
    this.Employee = client.db().collection("nhanvien");
  }

  extractEmployeeData(payload) {
    const data = {
      hoTenNv: payload.hoTenNv,
      chucVu: payload.chucVu,
      diaChi: payload.diaChi,
      soDienThoai: payload.soDienThoai,
    };
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    return data;
  }

  async create(payload) {
    const data = this.extract(payload);
    data.password = await bcrypt.hash(payload.password, 10);

    const result = await this.Employee.findOneAndUpdate(
      data,
      { $set: { ...data, ngayTao: new Date(), ngayCapNhat: new Date() } },
      { returnDocument: "after", upsert: true },
    );
    return { _id: result.insertedId, ...data };
  }

  async find(filter) {
    const cursor = await this.Employee.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Employee.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractEmployeeData(payload);
    update.ngayCapNhat = new Date();
    const result = await this.Employee.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" },
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Employee.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async login(username, password) {
    const user = await this.Employee.findOne({ hoTenNv: username });
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }
}

module.exports = EmployeeService;
