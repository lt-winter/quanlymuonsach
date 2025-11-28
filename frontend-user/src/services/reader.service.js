import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl = "/api/readers") {
    this.api = createApiClient(baseUrl);
  }
  async login(data) {
    return (await this.api.post("/login", data)).data;
  }
  async register(data) {
    return (await this.api.post("/register", data)).data;
  }
  async getProfile() {
    return (await this.api.get("/profile")).data;
  }
  async updateProfile(data) {
    return (await this.api.put("/profile", data)).data;
  }
}

export default new ReaderService();
