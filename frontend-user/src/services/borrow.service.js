import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/borrows") {
    this.api = createApiClient(baseUrl);
  }
  async getMyBorrows() {
    return (await this.api.get("/")).data;
  }
  async borrow(maSach, maDocGia, ngayMuon) {
    return (await this.api.post("/", { maSach, maDocGia, ngayMuon })).data;
  }
  async reportLost(maMuon) {
    return (await this.api.put(`/${maMuon}/report-lost`)).data;
  }
  async returnBook(borrowId) {
    return (await this.api.put(`/${borrowId}/return`)).data;
  }
}

export default new BorrowService();
