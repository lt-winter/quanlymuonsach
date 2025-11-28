import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/borrows") {
    this.api = createApiClient(baseUrl);
  }
  async getMyBorrows() {
    return (await this.api.get("/my-borrows")).data;
  }
  async borrow(bookId) {
    return (await this.api.post("/", { bookId })).data;
  }
  async returnBook(borrowId) {
    return (await this.api.put(`/${borrowId}/return`)).data;
  }
}

export default new BorrowService();
