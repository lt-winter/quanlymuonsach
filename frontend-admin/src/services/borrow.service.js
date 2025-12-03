import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/admin/borrows") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async returnBook(id, ngayTra) {
    return (await this.api.post(`/${id}/return`, { ngayTra })).data;
  }

  async reportLost(id) {
    return (await this.api.post(`/${id}/lost`)).data;
  }

  async getStats() {
    return (await this.api.get("/stats")).data;
  }

  async approve(id, data = {}) {
    return (await this.api.post(`/${id}/approve`, data)).data;
  }

  async reject(id, data = {}) {
    return (await this.api.post(`/${id}/reject`, data)).data;
  }
}

export default new BorrowService();
