<template>
  <div class="profile-page">
    <h2 class="page-title mb-4">
      <i class="fas fa-user"></i> Thông tin cá nhân
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else class="row">
      <div class="col-md-8 mx-auto">
        <!-- Thông tin hiển thị -->
        <div v-if="!editingProfile && !changingPassword" class="card">
          <div class="card-body">
            <div class="text-center mb-4">
              <div class="profile-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <h4 class="mt-3">{{ profile.hoLot }} {{ profile.ten }}</h4>
              <p class="text-muted">
                <i class="fas fa-id-card"></i> Mã độc giả: {{ profile.maDocGia }}
              </p>
            </div>

            <table class="table table-borderless profile-table">
              <tr>
                <th><i class="fas fa-user"></i> Họ và tên lót:</th>
                <td>{{ profile.hoLot }}</td>
              </tr>
              <tr>
                <th><i class="fas fa-signature"></i> Tên:</th>
                <td>{{ profile.ten }}</td>
              </tr>
              <tr>
                <th><i class="fas fa-birthday-cake"></i> Ngày sinh:</th>
                <td>{{ formatDate(profile.ngaySinh) }}</td>
              </tr>
              <tr>
                <th><i class="fas fa-venus-mars"></i> Phái:</th>
                <td>{{ profile.phai }}</td>
              </tr>
              <tr>
                <th><i class="fas fa-map-marker-alt"></i> Địa chỉ:</th>
                <td>{{ profile.diaChi }}</td>
              </tr>
              <tr>
                <th><i class="fas fa-phone"></i> Số điện thoại:</th>
                <td>{{ profile.dienThoai }}</td>
              </tr>
            </table>

            <div class="text-center mt-4">
              <button @click="startEditProfile" class="btn btn-primary mr-2">
                <i class="fas fa-edit"></i> Chỉnh sửa thông tin
              </button>
              <button @click="startChangePassword" class="btn btn-info">
                <i class="fas fa-key"></i> Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <!-- Form chỉnh sửa thông tin -->
        <div v-if="editingProfile" class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">
              <i class="fas fa-edit"></i> Chỉnh sửa thông tin cá nhân
            </h5>

            <Form :validation-schema="profileSchema" @submit="handleUpdateProfile" class="form-grid">
              <div class="form-group">
                <label>Họ và tên lót</label>
                <Field name="hoLot" v-model="profileForm.hoLot" class="form-control" />
                <ErrorMessage name="hoLot" class="error-feedback" />
              </div>

              <div class="form-group">
                <label>Tên</label>
                <Field name="ten" v-model="profileForm.ten" class="form-control" />
                <ErrorMessage name="ten" class="error-feedback" />
              </div>

              <div class="form-group">
                <label>Ngày sinh</label>
                <Field name="ngaySinh" v-model="profileForm.ngaySinh" type="date" class="form-control" />
                <ErrorMessage name="ngaySinh" class="error-feedback" />
              </div>

              <div class="form-group">
                <label>Phái</label>
                <CustomSelect
                  v-model="profileForm.phai"
                  :options="phaiOptions"
                  placeholder="Chọn phái"
                />
              </div>

              <div class="form-group form-group-full">
                <label>Địa chỉ</label>
                <Field name="diaChi" v-model="profileForm.diaChi" class="form-control" />
                <ErrorMessage name="diaChi" class="error-feedback" />
              </div>

              <div class="form-group form-group-full">
                <label>Số điện thoại</label>
                <Field name="dienThoai" v-model="profileForm.dienThoai" class="form-control" />
                <ErrorMessage name="dienThoai" class="error-feedback" />
              </div>

              <p v-if="profileError" class="error-feedback text-center">{{ profileError }}</p>
              <p v-if="profileSuccess" class="text-success text-center">{{ profileSuccess }}</p>

              <div class="form-actions">
                <button type="submit" class="btn btn-success mr-2" :disabled="updatingProfile">
                  <span v-if="updatingProfile" class="spinner-border spinner-border-sm mr-1"></span>
                  <i v-else class="fas fa-save"></i>
                  Lưu thay đổi
                </button>
                <button type="button" @click="cancelEditProfile" class="btn btn-secondary">
                  <i class="fas fa-times"></i> Hủy
                </button>
              </div>
            </Form>
          </div>
        </div>

        <!-- Form đổi mật khẩu -->
        <div v-if="changingPassword" class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">
              <i class="fas fa-key"></i> Đổi mật khẩu
            </h5>

            <Form :validation-schema="passwordSchema" @submit="handleChangePassword">
              <div class="form-group">
                <label>Mật khẩu hiện tại</label>
                <Field name="currentPassword" type="password" class="form-control" />
                <ErrorMessage name="currentPassword" class="error-feedback" />
              </div>

              <div class="form-group">
                <label>Mật khẩu mới</label>
                <Field name="newPassword" type="password" class="form-control" />
                <ErrorMessage name="newPassword" class="error-feedback" />
              </div>

              <div class="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <Field name="confirmPassword" type="password" class="form-control" />
                <ErrorMessage name="confirmPassword" class="error-feedback" />
              </div>

              <p v-if="passwordError" class="error-feedback text-center">{{ passwordError }}</p>
              <p v-if="passwordSuccess" class="text-success text-center">{{ passwordSuccess }}</p>

              <div class="text-center mt-4">
                <button type="submit" class="btn btn-success mr-2" :disabled="updatingPassword">
                  <span v-if="updatingPassword" class="spinner-border spinner-border-sm mr-1"></span>
                  <i v-else class="fas fa-check"></i>
                  Đổi mật khẩu
                </button>
                <button type="button" @click="cancelChangePassword" class="btn btn-secondary">
                  <i class="fas fa-times"></i> Hủy
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import ReaderService from "@/services/reader.service";
import CustomSelect from "@/components/CustomSelect.vue";

export default {
  components: { Form, Field, ErrorMessage, CustomSelect },
  data() {
    return {
      profile: {},
      loading: false,
      editingProfile: false,
      changingPassword: false,
      updatingProfile: false,
      updatingPassword: false,
      profileError: "",
      profileSuccess: "",
      passwordError: "",
      passwordSuccess: "",
      phaiOptions: [
        { value: "Nam", label: "Nam" },
        { value: "Nữ", label: "Nữ" },
      ],
      profileForm: {
        hoLot: "",
        ten: "",
        ngaySinh: "",
        phai: "",
        diaChi: "",
        dienThoai: "",
      },
      profileSchema: Yup.object({
        hoLot: Yup.string().required("Vui lòng nhập họ và tên lót"),
        ten: Yup.string().required("Vui lòng nhập tên"),
        ngaySinh: Yup.date().required("Vui lòng chọn ngày sinh"),
        diaChi: Yup.string().required("Vui lòng nhập địa chỉ"),
        dienThoai: Yup.string().required("Vui lòng nhập số điện thoại"),
      }),
      passwordSchema: Yup.object({
        currentPassword: Yup.string()
          .required("Vui lòng nhập mật khẩu hiện tại")
          .min(6, "Mật khẩu ít nhất 6 ký tự"),
        newPassword: Yup.string()
          .required("Vui lòng nhập mật khẩu mới")
          .min(6, "Mật khẩu ít nhất 6 ký tự"),
        confirmPassword: Yup.string()
          .required("Vui lòng xác nhận mật khẩu")
          .oneOf([Yup.ref("newPassword")], "Mật khẩu không khớp"),
      }),
    };
  },
  methods: {
    async fetchProfile() {
      this.loading = true;
      try {
        this.profile = await ReaderService.getProfile();
      } catch (error) {
        console.error("Error fetching profile:", error);
        this.profileError = "Không thể tải thông tin profile";
      } finally {
        this.loading = false;
      }
    },
    startEditProfile() {
      this.editingProfile = true;
      this.changingPassword = false;
      this.profileForm = {
        hoLot: this.profile.hoLot,
        ten: this.profile.ten,
        ngaySinh: this.profile.ngaySinh ? new Date(this.profile.ngaySinh).toISOString().split('T')[0] : "",
        phai: this.profile.phai || "",
        diaChi: this.profile.diaChi,
        dienThoai: this.profile.dienThoai,
      };
      this.profileError = "";
      this.profileSuccess = "";
    },
    cancelEditProfile() {
      this.editingProfile = false;
      this.profileError = "";
      this.profileSuccess = "";
    },
    async handleUpdateProfile(values) {
      this.updatingProfile = true;
      this.profileError = "";
      this.profileSuccess = "";

      try {
        const data = {
          hoLot: values.hoLot,
          ten: values.ten,
          ngaySinh: values.ngaySinh,
          phai: this.profileForm.phai,
          diaChi: values.diaChi,
          dienThoai: values.dienThoai,
        };
        await ReaderService.updateProfile(data);
        this.profileSuccess = "Cập nhật thông tin thành công!";
        setTimeout(() => {
          this.editingProfile = false;
          this.fetchProfile();
        }, 1500);
      } catch (error) {
        console.error("Error updating profile:", error);
        this.profileError = error?.response?.data?.message || "Có lỗi xảy ra";
      } finally {
        this.updatingProfile = false;
      }
    },
    startChangePassword() {
      this.changingPassword = true;
      this.editingProfile = false;
      this.passwordError = "";
      this.passwordSuccess = "";
    },
    cancelChangePassword() {
      this.changingPassword = false;
      this.passwordError = "";
      this.passwordSuccess = "";
    },
    async handleChangePassword(values) {
      this.updatingPassword = true;
      this.passwordError = "";
      this.passwordSuccess = "";

      try {
        await ReaderService.updateProfile({
          currentPassword: values.currentPassword,
          matKhau: values.newPassword,
        });
        this.passwordSuccess = "Đổi mật khẩu thành công!";
        setTimeout(() => {
          this.changingPassword = false;
        }, 1500);
      } catch (error) {
        console.error("Error changing password:", error);
        this.passwordError = error?.response?.data?.message || "Có lỗi xảy ra";
      } finally {
        this.updatingPassword = false;
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

<style scoped>
.profile-page {
  padding: 24px 0;
}

.page-title {
  font-size: 28px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title i {
  color: #4361ee;
}

.card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-bottom: 20px;
}

.card-body {
  padding: 30px;
}

.card-title {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.card-title i {
  color: #4361ee;
}

.profile-avatar {
  font-size: 80px;
  color: #4361ee;
}

.profile-avatar i {
  opacity: 0.8;
}

.profile-table {
  margin-top: 20px;
  margin-bottom: 0;
}

.profile-table th {
  width: 30%;
  color: #666;
  font-weight: 600;
  border: none;
  padding: 12px 0;
}

.profile-table td {
  border: none;
  padding: 12px 0;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-control {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}

.form-control:focus {
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  outline: none;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.form-grid .form-group-full {
  grid-column: 1 / -1;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .form-grid {
    gap: 12px;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-control {
    padding: 8px 10px;
    font-size: 13px;
  }
}

.error-feedback {
  color: #dc3545;
  font-size: 13px;
  margin-top: 4px;
}

.text-center {
  text-align: center;
}

.text-success {
  color: #28a745;
}

.text-muted {
  color: #6b7280;
}

.btn {
  padding: 10px 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.btn-primary {
  background: #4361ee;
  color: white;
}

.btn-primary:hover {
  background: #3650d4;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mr-2 {
  margin-right: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 24px;
}

.mb-4 {
  margin-bottom: 24px;
}

.row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.row.col-md-8 {
  display: block;
}

.row > .col-md-6 {
  flex: 1;
  min-width: 0;
}

.row > .col-md-8 {
  width: 100%;
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }

  .row > .col-md-6,
  .row > .col-md-8 {
    width: 100%;
  }
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
</style>
