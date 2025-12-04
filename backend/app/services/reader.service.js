const CodeGenerator = require("@/utils/codeGenerator.util");
const bcrypt = require("bcryptjs");

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
      matKhau: payload.matKhau,
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

    // Hash mật khẩu nếu có
    if (payload.matKhau) {
      docGia.matKhau = await bcrypt.hash(payload.matKhau, 10);
    }

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

  async login(maDocGia, matKhau) {
    const reader = await this.DocGia.findOne({ maDocGia });
    if (!reader) return null;

    // Kiểm tra xem reader có mật khẩu không
    if (!reader.matKhau) {
      return null; // Tài khoản chưa có mật khẩu
    }

    const isMatch = await bcrypt.compare(matKhau, reader.matKhau);
    if (!isMatch) return null;

    // Không trả về mật khẩu
    const { matKhau: _, ...readerWithoutPassword } = reader;
    return readerWithoutPassword;
  }

  async register(payload) {
    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const existing = await this.DocGia.findOne({ dienThoai: payload.dienThoai });
    if (existing) {
      throw new Error("Số điện thoại đã được đăng ký");
    }

    return await this.create(payload);
  }

  async getProfile(userId) {
    const { ObjectId } = require("mongodb");
    const reader = await this.DocGia.findOne({ _id: new ObjectId(userId) });
    if (!reader) return null;

    // Không trả về mật khẩu
    const { matKhau: _, ...readerWithoutPassword } = reader;
    return readerWithoutPassword;
  }

  async updateProfile(userId, payload) {
    const { ObjectId } = require("mongodb");
    const filter = { _id: new ObjectId(userId) };
    
    // Chỉ cho phép cập nhật một số trường nhất định
    const allowedFields = ['hoLot', 'ten', 'ngaySinh', 'phai', 'diaChi', 'dienThoai'];
    const update = {};
    
    allowedFields.forEach(field => {
      if (payload[field] !== undefined) {
        update[field] = field === 'ngaySinh' ? new Date(payload[field]) : payload[field];
      }
    });

    // Nếu có mật khẩu mới, hash nó
    if (payload.matKhau) {
      update.matKhau = await bcrypt.hash(payload.matKhau, 10);
    }

    update.ngayCapNhat = new Date();

    const result = await this.DocGia.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result) return null;

    // Không trả về mật khẩu
    const { matKhau: _, ...readerWithoutPassword } = result;
    return readerWithoutPassword;
  }
}

module.exports = ReaderService;
