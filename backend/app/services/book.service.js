class BookService {
  constructor(client) {
    this.Sach = client.db().collection("sach");
    this.NhaXuatBan = client.db().collection("nhaxuatban");
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
    
    // Populate publisher data nếu có maNXB (có thể là ObjectId hoặc string)
    if (doc && doc.maNXB) {
      let publisher = null;
      
      // Nếu maNXB là ObjectId hợp lệ, tìm theo _id
      if (ObjectId.isValid(doc.maNXB)) {
        publisher = await this.NhaXuatBan.findOne({ _id: new ObjectId(doc.maNXB) });
      }
      // Nếu không tìm thấy, thử tìm theo maNXB string
      if (!publisher) {
        publisher = await this.NhaXuatBan.findOne({ maNXB: doc.maNXB });
      }
      
      if (publisher) {
        doc.publisher = publisher;
      }
    }
    
    return doc;
  }
}

module.exports = BookService;
