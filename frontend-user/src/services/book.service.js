import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }
  async getNewestBooks(params = {}) {
    return (await this.api.get("/newest", { params })).data;
  }
  async getRandomBooks(params = {}) {
    return (await this.api.get("/random", { params })).data;
  }
  async getGenres() {
    return (await this.api.get("/genres")).data;
  }
  async getAuthors() {
    return (await this.api.get("/authors")).data;
  }
  async getPublishers() {
    return (await this.api.get("/publishers")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
}

export default new BookService();
