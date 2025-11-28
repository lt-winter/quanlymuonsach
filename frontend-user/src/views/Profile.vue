<template>
  <div class="profile-page">
    <h2 class="mb-4">
      <i class="fas fa-user"></i> Thông tin cá nhân
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else class="row">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="text-center mb-4">
              <i class="fas fa-user-circle fa-5x text-primary"></i>
              <h4 class="mt-3">{{ profile.hoLot }} {{ profile.ten }}</h4>
            </div>

            <table class="table table-borderless">
              <tr>
                <th>Họ và tên lót:</th>
                <td>{{ profile.hoLot }}</td>
              </tr>
              <tr>
                <th>Tên:</th>
                <td>{{ profile.ten }}</td>
              </tr>
              <tr>
                <th>Ngày sinh:</th>
                <td>{{ formatDate(profile.ngaySinh) }}</td>
              </tr>
              <tr>
                <th>Phái:</th>
                <td>{{ profile.phai }}</td>
              </tr>
              <tr>
                <th>Địa chỉ:</th>
                <td>{{ profile.diaChi }}</td>
              </tr>
              <tr>
                <th>Số điện thoại:</th>
                <td>{{ profile.dienThoai }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReaderService from "@/services/reader.service";

export default {
  data() {
    return {
      profile: {},
      loading: false,
    };
  },
  methods: {
    async fetchProfile() {
      this.loading = true;
      try {
        this.profile = await ReaderService.getProfile();
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },
  },
  mounted() {
    this.fetchProfile();
  },
};
</script>
