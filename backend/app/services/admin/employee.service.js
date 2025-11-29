const bcrypt = require("bcryptjs");
const CodeGenerator = require("@/utils/codeGenerator.util");

class EmployeeService {
  constructor(client) {
    this.client = client;
    this.Employee = client.db().collection("nhanvien");
    this.codeGenerator = new CodeGenerator(client);
  }

  extractEmployeeData(payload) {
    const data = {
      hoTenNv: payload.hoTenNv,
      chucVu: payload.chucVu,
      diaChi: payload.diaChi,
      soDienThoai: payload.soDienThoai,
      tenNguoiDung: payload.tenNguoiDung,
      matKhau: payload.matKhau,
      vaiTro: payload.vaiTro,
    };
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    return data;
  }

  async create(payload) {
    const data = this.extractEmployeeData(payload);
    data.matKhau = await bcrypt.hash(payload.matKhau, 10);
    
    // Sinh mã nhân viên tự động (NV00001, NV00002, ...) - _id để MongoDB tự sinh ObjectId
    data.maNhanVien = await this.codeGenerator.generateEmployeeCode();
    data.ngayTao = new Date();
    data.ngayCapNhat = new Date();

    const result = await this.Employee.insertOne(data);

    return data;
  }

  async find(filter = {}) {
    const cursor = await this.Employee.find({
      ...filter,
      vaiTro: "admin",
    });
    return cursor.toArray();
  }

  async findById(id) {
    // Thử tìm theo _id trước, nếu không có thì tìm theo maNhanVien
    const { ObjectId } = require("mongodb");
    let doc = null;
    
    // Nếu id là ObjectId hợp lệ, tìm theo _id
    if (ObjectId.isValid(id)) {
      doc = await this.Employee.findOne({ _id: new ObjectId(id) });
    }
    // Nếu không tìm thấy, thử tìm theo maNhanVien
    if (!doc) {
      doc = await this.Employee.findOne({ maNhanVien: id });
    }
    return doc;
  }

  async update(id, payload) {
    // Tìm document trước để lấy _id thực
    const existing = await this.findById(id);
    if (!existing) return null;
    
    const filter = { _id: existing._id };
    const update = this.extractEmployeeData(payload);

    update.ngayCapNhat = new Date();

    const result = await this.Employee.findOneAndUpdate(
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
    
    return await this.Employee.findOneAndDelete({ _id: existing._id });
  }

  // Đăng nhập
  async login(username, password) {
    const user = await this.Employee.findOne({
      tenNguoiDung: username,
    });

    if (!user) return null;

    const hash = user.matKhau;
    if (!hash) return null;

    const match = await bcrypt.compare(password, hash);
    if (!match) return null;

    return user;
  }
}

module.exports = EmployeeService;
