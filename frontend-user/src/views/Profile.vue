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
        <div class="card">
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

            <div v-if="!editing">
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
                <button @click="startEdit" class="btn btn-primary">
                  <i class="fas fa-edit"></i> Chỉnh sửa thông tin
                </button>
              </div>
            </div>

            <div v-else>
              <Form :validation-schema="schema" @submit="handleUpdate">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Họ và tên lót</label>
                      <Field name="hoLot" v-model="formData.hoLot" class="form-control" />
                      <ErrorMessage name="hoLot" class="error-feedback" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Tên</label>
                      <Field name="ten" v-model="formData.ten" class="form-control" />
                      <ErrorMessage name="ten" class="error-feedback" />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Ngày sinh</label>
                      <Field name="ngaySinh" v-model="formData.ngaySinh" type="date" class="form-control" />
                      <ErrorMessage name="ngaySinh" class="error-feedback" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Phái</label>
                      <Field name="phai" v-model="formData.phai" as="select" class="form-control">
                        <option value="">Chọn</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </Field>
                      <ErrorMessage name="phai" class="error-feedback" />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>Địa chỉ</label>
                  <Field name="diaChi" v-model="formData.diaChi" class="form-control" />
                  <ErrorMessage name="diaChi" class="error-feedback" />
                </div>

                <div class="form-group">
                  <label>Số điện thoại</label>
                  <Field name="dienThoai" v-model="formData.dienThoai" class="form-control" />
                  <ErrorMessage name="dienThoai" class="error-feedback" />
                </div>

                <div class="form-group">
                  <label>Mật khẩu mới (để trống nếu không đổi)</label>
                  <Field name="matKhau" v-model="formData.matKhau" type="password" class="form-control" />
                  <ErrorMessage name="matKhau" class="error-feedback" />
                </div>

                <p v-if="error" class="error-feedback text-center">{{ error }}</p>
                <p v-if="success" class="text-success text-center">{{ success }}</p>

                <div class="text-center mt-4">
                  <button type="submit" class="btn btn-success mr-2" :disabled="updating">
                    <span v-if="updating" class="spinner-border spinner-border-sm mr-1"></span>
                    <i v-else class="fas fa-save"></i>
                    Lưu thay đổi
                  </button>
                  <button type="button" @click="cancelEdit" class="btn btn-secondary">
                    <i class="fas fa-times"></i> Hủy
                  </button>
                </div>
              </Form>
            </div>
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

export default {
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      profile: {},
      loading: false,
      editing: false,
      updating: false,
      error: "",
      success: "",
      formData: {
        hoLot: "",
        ten: "",
        ngaySinh: "",
        phai: "",
        diaChi: "",
        dienThoai: "",
        matKhau: "",
      },
      schema: Yup.object({
        hoLot: Yup.string().required("Vui lòng nhập họ và tên lót"),
        ten: Yup.string().required("Vui lòng nhập tên"),
        ngaySinh: Yup.date().required("Vui lòng chọn ngày sinh"),
        phai: Yup.string().required("Vui lòng chọn phái"),
        diaChi: Yup.string().required("Vui lòng nhập địa chỉ"),
        dienThoai: Yup.string().required("Vui lòng nhập số điện thoại"),
        matKhau: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
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
        this.error = "Không thể tải thông tin profile";
      } finally {
        this.loading = false;
      }
    },
    startEdit() {
      this.editing = true;
      this.formData = {
        hoLot: this.profile.hoLot,
        ten: this.profile.ten,
        ngaySinh: this.profile.ngaySinh ? new Date(this.profile.ngaySinh).toISOString().split('T')[0] : "",
        phai: this.profile.phai,
        diaChi: this.profile.diaChi,
        dienThoai: this.profile.dienThoai,
        matKhau: "",
      };
    },
    cancelEdit() {
      this.editing = false;
      this.error = "";
      this.success = "";
    },
    async handleUpdate(values) {
      this.updating = true;
      this.error = "";
      this.success = "";

      try {
        // Không gửi mật khẩu nếu để trống
        const updateData = { ...values };
        if (!updateData.matKhau) {
          delete updateData.matKhau;
        }

        const result = await ReaderService.updateProfile(updateData);
        this.success = "Cập nhật thông tin thành công!";
        
        // Cập nhật profile hiển thị
        await this.fetchProfile();
        
        // Cập nhật localStorage nếu cần
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.hoLot = result.data.hoLot;
          user.ten = result.data.ten;
          user.dienThoai = result.data.dienThoai;
          user.diaChi = result.data.diaChi;
          user.phai = result.data.phai;
          user.ngaySinh = result.data.ngaySinh;
          localStorage.setItem("user", JSON.stringify(user));
        }

        setTimeout(() => {
          this.editing = false;
          this.success = "";
        }, 2000);
      } catch (err) {
        console.error("Update error:", err);
        this.error = err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin";
      } finally {
        this.updating = false;
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
.profile-avatar {
  font-size: 5rem;
  color: var(--primary-color);
}

.profile-table th {
  width: 40%;
  color: #6b7280;
  font-weight: 600;
  padding: 12px 8px;
}

.profile-table td {
  color: #1f2937;
  padding: 12px 8px;
}

.profile-table tr {
  border-bottom: 1px solid #e5e7eb;
}

.profile-table tr:last-child {
  border-bottom: none;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>
