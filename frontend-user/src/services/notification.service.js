import createApiClient from "./api.service";

class NotificationService {
  constructor(baseUrl = "/api/readers") {
    this.api = createApiClient(baseUrl, true);
  }

  // Lấy danh sách thông báo
  async getAll() {
    return (await this.api.get("/notifications")).data;
  }

  // Đánh dấu đã đọc một thông báo
  async markAsRead(id) {
    return (await this.api.put(`/notifications/${id}/read`)).data;
  }

  // Đánh dấu đã đọc tất cả thông báo
  async markAllAsRead() {
    return (await this.api.put("/notifications/read-all")).data;
  }

  // Xóa một thông báo
  async delete(id) {
    return (await this.api.delete(`/notifications/${id}`)).data;
  }

  // Xóa tất cả thông báo
  async deleteAll() {
    return (await this.api.delete("/notifications")).data;
  }
}

export default new NotificationService();
