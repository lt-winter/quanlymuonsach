import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
}

export default new BookService();
