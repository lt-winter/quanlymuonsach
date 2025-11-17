import createApiClient from "./api.service";

class EmployeeService {
  constructor(baseUrl = "/api/employees") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.patch(`/${id}`)).data;
  }
  async login(data) {
    return (await this.api.post("/login", data)).data;
  }
}
export default new EmployeeService();
