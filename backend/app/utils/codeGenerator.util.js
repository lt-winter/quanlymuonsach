/**
 * Utility class để sinh mã tự động cho các đối tượng
 * - Độc giả: DG00001, DG00002, ...
 * - Sách: SA00001, SA00002, ...
 * - Nhà xuất bản: XB00001, XB00002, ...
 * - Mượn sách: MS00001, MS00002, ...
 *
 * Sử dụng countDocuments() để đếm số record hiện có và +1
 */
class CodeGenerator {
  constructor(client) {
    this.db = client.db();
  }

  /**
   * Lấy số tiếp theo cho một collection bằng cách đếm documents hiện có
   * @param {string} collectionName - Tên collection
   * @returns {Promise<number>} - Số tiếp theo
   */
  async getNextSequence(collectionName) {
    const count = await this.db.collection(collectionName).countDocuments();
    return count + 1;
  }

  /**
   * Sinh mã cho độc giả (DG00001, DG00002, ...)
   * @returns {Promise<string>}
   */
  async generateReaderCode() {
    const seq = await this.getNextSequence("docgia");
    return `DG${seq.toString().padStart(5, "0")}`;
  }

  /**
   * Sinh mã cho sách (SA00001, SA00002, ...)
   * @returns {Promise<string>}
   */
  async generateBookCode() {
    const seq = await this.getNextSequence("sach");
    return `SA${seq.toString().padStart(5, "0")}`;
  }

  /**
   * Sinh mã cho nhà xuất bản (XB00001, XB00002, ...)
   * @returns {Promise<string>}
   */
  async generatePublisherCode() {
    const seq = await this.getNextSequence("nhaxuatban");
    return `XB${seq.toString().padStart(5, "0")}`;
  }

  /**
   * Sinh mã cho phiếu mượn sách (MS00001, MS00002, ...)
   * @returns {Promise<string>}
   */
  async generateBorrowCode() {
    const seq = await this.getNextSequence("theodoimuonsach");
    return `MS${seq.toString().padStart(5, "0")}`;
  }

  /**
   * Sinh mã cho nhân viên (NV00001, NV00002, ...)
   * @returns {Promise<string>}
   */
  async generateEmployeeCode() {
    const seq = await this.getNextSequence("nhanvien");
    return `NV${seq.toString().padStart(5, "0")}`;
  }
}

module.exports = CodeGenerator;
