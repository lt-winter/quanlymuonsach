<template>
  <Form ref="form" @submit="submitBook" :validation-schema="bookFormSchema">
    <!-- Tên sách -->
    <div class="form-group">
      <label for="tenSach">Tên Sách</label>
      <Field
        name="tenSach"
        type="text"
        class="form-control"
        v-model="bookLocal.tenSach"
      />
      <ErrorMessage name="tenSach" class="error-feedback" />
    </div>

    <!-- Đơn giá -->
    <div class="form-group">
      <label for="donGia">Đơn giá</label>
      <Field
        name="donGia"
        type="number"
        class="form-control"
        v-model="bookLocal.donGia"
      />
      <ErrorMessage name="donGia" class="error-feedback" />
    </div>

    <!-- Số quyển -->
    <div class="form-group">
      <label for="soQuyen">Số quyển</label>
      <Field
        name="soQuyen"
        type="number"
        min="1"
        class="form-control"
        v-model="bookLocal.soQuyen"
      />
      <ErrorMessage name="soQuyen" class="error-feedback" />
    </div>

    <!-- Năm xuất bản -->
    <div class="form-group">
      <label for="namXuatBan">Năm xuất bản</label>
      <Field
        name="namXuatBan"
        type="number"
        class="form-control"
        v-model="bookLocal.namXuatBan"
      />
      <ErrorMessage name="namXuatBan" class="error-feedback" />
    </div>

    <!-- Nhà xuất bản -->
    <div class="form-group position-relative">
      <label for="nhaXuatBan">Nhà xuất bản</label>

      <!-- Input gõ tìm -->
      <Field name="nhaXuatBan" v-slot="{ field }">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm nhà xuất bản..."
          :value="publisherSearch"
          @focus="showDropdown = true"
          @input="
            (e) => {
              publisherSearch = e.target.value;
              showDropdown = true;
            }
          "
        />

        <!-- Dropdown results -->
        <div
          v-if="showDropdown"
          class="list-group position-absolute w-100 mt-1 shadow-sm"
          style="max-height: 200px; overflow-y: auto; z-index: 10"
        >
          <button
            v-for="pub in filteredPublishers"
            :key="pub._id"
            class="list-group-item list-group-item-action"
            :class="{ active: pub._id === bookLocal.nhaXuatBan }"
            @click="
              () => {
                bookLocal.nhaXuatBan = pub._id;
                field.onChange(pub._id); // cập nhật VeeValidate
                publisherSearch = pub.tenNXB; // hiển thị tên NXB đã chọn
                showDropdown = false; // đóng dropdown
              }
            "
          >
            {{ pub.tenNXB }}
          </button>

          <!-- Trường hợp rỗng -->
          <div
            v-if="filteredPublishers.length === 0"
            class="list-group-item disabled"
          >
            Không tìm thấy nhà xuất bản
          </div>
        </div>
      </Field>

      <ErrorMessage name="nhaXuatBan" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="tacGia">Tác giả</label>
      <Field
        name="tacGia"
        type="text"
        class="form-control"
        v-model="bookLocal.tacGia"
      />
      <ErrorMessage name="tacGia" class="error-feedback" />
    </div>

    <!-- Nút submit và delete -->
    <div class="form-group d-flex mt-3">
      <button class="btn btn-primary">
        <i class="fa-solid fa-floppy-disk"></i> Lưu
      </button>

      <button
        v-if="bookLocal._id"
        type="button"
        class="btn btn-danger ml-2"
        @click="deleteBook"
      >
        <i class="fa-solid fa-trash"></i> Xoá
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import PublisherService from "@/services/publisher.service";

export default {
  components: { Form, Field, ErrorMessage },

  emits: ["submit:book", "delete:book"],

  props: {
    book: { type: Object, required: true },
  },

  data() {
    const bookFormSchema = yup.object().shape({
      tenSach: yup.string().required().min(2).max(100),
      donGia: yup
        .number()
        .typeError("Đơn giá phải là số.")
        .positive()
        .required(),
      soQuyen: yup.number().typeError("Số quyển phải là số.").min(1).required(),
      namXuatBan: yup
        .number()
        .typeError("Năm xuất bản không hợp lệ.")
        .min(1900)
        .max(new Date().getFullYear()),
      nhaXuatBan: yup.string().required("Phải chọn nhà xuất bản."),
    });

    return {
      bookLocal: { ...this.book },
      bookFormSchema,
      showDropdown: false,
      publishers: [],
      publisherSearch: "",
    };
  },

  watch: {
    // Khi props book thay đổi (khi trang Edit fetch xong)
    book: {
      handler(newBook) {
        this.bookLocal = { ...newBook };
        this.syncPublisherSearch();
      },
      deep: true,
      immediate: true,
    },

    // Khi danh sách nhà xuất bản load xong
    publishers() {
      this.syncPublisherSearch();
    },
  },

  computed: {
    filteredPublishers() {
      if (!this.publisherSearch) return this.publishers;
      return this.publishers.filter((p) =>
        p.tenNXB.toLowerCase().includes(this.publisherSearch.toLowerCase())
      );
    },
  },

  methods: {
    async fetchPublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    // Đồng bộ hiển thị name NXB khi edit sách
    syncPublisherSearch() {
      if (!this.bookLocal?.nhaXuatBan) return;
      if (!this.publishers.length) return;

      const pub = this.publishers.find(
        (p) => p._id === this.bookLocal.nhaXuatBan
      );
      if (!pub) return;

      // Hiển thị tên NXB vào input
      this.publisherSearch = pub.tenNXB;

      // Set vào vee-validate (nếu cần)
      if (this.$refs.form?.setFieldValue) {
        this.$refs.form.setFieldValue("nhaXuatBan", pub._id);
      }
    },

    submitBook() {
      this.$emit("submit:book", this.bookLocal);
    },

    deleteBook() {
      this.$emit("delete:book", this.bookLocal._id);
    },
    Cancel() {
      const reply = window.confirm(
        "Bạn có chắc muốn hủy không? Mọi thay đổi sẽ không được lưu."
      );
      if (!reply) {
        return false;
      } else this.$router.push({ name: "books" });
    },
  },

  async mounted() {
    await this.fetchPublishers();
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
.page {
  max-width: 576px;
  margin: auto;
}
</style>
