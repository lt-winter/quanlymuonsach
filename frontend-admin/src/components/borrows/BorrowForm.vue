<template>
  <Form ref="form" @submit="submitBorrow" :validation-schema="borrowFormSchema">
    <!-- Độc giả -->
    <div class="form-group position-relative" ref="readerDropdown">
      <label for="maDocGia">Độc giả <span class="required">*</span></label>
      <Field name="maDocGia" v-slot="{ field }">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm độc giả..."
          :value="readerSearch"
          @focus="showReaderDropdown = true"
          @click.stop="showReaderDropdown = true"
          @input="
            (e) => {
              readerSearch = e.target.value;
              showReaderDropdown = true;
            }
          "
          :disabled="isEdit"
        />
        <div
          v-if="showReaderDropdown && !isEdit"
          class="list-group position-absolute w-100 mt-1 shadow-sm dropdown-list"
        >
          <button
            v-for="reader in filteredReaders"
            :key="reader.maDocGia"
            type="button"
            class="list-group-item list-group-item-action"
            :class="{ active: reader.maDocGia === borrowLocal.maDocGia }"
            @click="() => selectReader(reader, field)"
          >
            {{ reader.maDocGia }} - {{ reader.hoLot }} {{ reader.ten }}
          </button>
          <div
            v-if="filteredReaders.length === 0"
            class="list-group-item disabled"
          >
            Không tìm thấy độc giả
          </div>
        </div>
      </Field>
      <ErrorMessage name="maDocGia" class="error-feedback" />
    </div>

    <!-- Sách -->
    <div class="form-group position-relative" ref="bookDropdown">
      <label for="maSach">Sách <span class="required">*</span></label>
      <Field name="maSach" v-slot="{ field }">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm sách..."
          :value="bookSearch"
          @focus="showBookDropdown = true"
          @click.stop="showBookDropdown = true"
          @input="
            (e) => {
              bookSearch = e.target.value;
              showBookDropdown = true;
            }
          "
          :disabled="isEdit"
        />
        <div
          v-if="showBookDropdown && !isEdit"
          class="list-group position-absolute w-100 mt-1 shadow-sm dropdown-list"
        >
          <button
            v-for="book in filteredBooks"
            :key="book.maSach"
            type="button"
            class="list-group-item list-group-item-action"
            :class="{ active: book.maSach === borrowLocal.maSach }"
            @click="() => selectBook(book, field)"
          >
            {{ book.tenSach }} - {{ book.tacGia }} 
            <span class="badge badge-info ml-2">Còn {{ book.soQuyen }} quyển</span>
          </button>
          <div
            v-if="filteredBooks.length === 0"
            class="list-group-item disabled"
          >
            Không tìm thấy sách
          </div>
        </div>
      </Field>
      <ErrorMessage name="maSach" class="error-feedback" />
    </div>

    <!-- Ngày mượn -->
    <div class="form-group">
      <label for="ngayMuon">Ngày mượn</label>
      <input
        type="text"
        class="form-control"
        :value="formatDate(borrowLocal.ngayMuon)"
        disabled
      />
    </div>

    <!-- Hạn trả (tính tự động) -->
    <div class="form-group">
      <label>Hạn trả (14 ngày)</label>
      <input
        type="text"
        class="form-control"
        :value="hanTraFormatted"
        disabled
      />
    </div>

    <!-- Thông tin khi đã mượn -->
    <template v-if="isEdit">
      <div class="form-group">
        <label>Trạng thái</label>
        <div class="status-display" :class="statusClass">
          {{ statusText }}
        </div>
      </div>

      <div class="form-group" v-if="borrowLocal.ngayTra">
        <label>Ngày trả thực tế</label>
        <input
          type="text"
          class="form-control"
          :value="formatDate(borrowLocal.ngayTra)"
          disabled
        />
      </div>

      <div class="form-group" v-if="borrowLocal.tienPhat > 0">
        <label>Tiền phạt quá hạn</label>
        <input
          type="text"
          class="form-control text-danger"
          :value="formatCurrency(borrowLocal.tienPhat)"
          disabled
        />
      </div>

      <div class="form-group" v-if="borrowLocal.tienBoiThuong > 0">
        <label>Tiền bồi thường</label>
        <input
          type="text"
          class="form-control text-warning"
          :value="formatCurrency(borrowLocal.tienBoiThuong)"
          disabled
        />
      </div>
    </template>

    <!-- Ghi chú -->
    <div class="form-group">
      <label for="ghiChu">Ghi chú</label>
      <Field
        name="ghiChu"
        as="textarea"
        class="form-control"
        rows="3"
        v-model="borrowLocal.ghiChu"
      />
      <ErrorMessage name="ghiChu" class="error-feedback" />
    </div>

    <div class="form-group form-actions mt-3">
      <button type="submit" class="btn btn-primary" v-if="!isEdit">
        <i class="fa-solid fa-floppy-disk"></i> Lưu
      </button>

      <template v-if="isEdit && borrowLocal.trangThai === 'dangMuon'">
        <button
          type="button"
          class="btn btn-success"
          @click="$emit('return:borrow')"
        >
          <i class="fas fa-undo"></i> Trả sách
        </button>
        <button
          type="button"
          class="btn btn-warning"
          @click="$emit('lost:borrow')"
        >
          <i class="fas fa-times-circle"></i> Báo mất
        </button>
      </template>

      <button
        v-if="isEdit"
        type="button"
        class="btn btn-danger"
        @click="$emit('delete:borrow')"
      >
        <i class="fa-solid fa-trash"></i> Xoá
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import ReaderService from "@/services/reader.service";
import BookService from "@/services/book.service";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:borrow", "delete:borrow", "return:borrow", "lost:borrow"],
  props: {
    borrow: { type: Object, required: true },
  },
  data() {
    const borrowFormSchema = yup.object().shape({
      maDocGia: yup.string().required("Vui lòng chọn độc giả"),
      maSach: yup.string().required("Vui lòng chọn sách"),
      ghiChu: yup.string(),
    });

    return {
      borrowFormSchema,
      borrowLocal: { ...this.borrow },
      readers: [],
      books: [],
      readerSearch: "",
      bookSearch: "",
      showReaderDropdown: false,
      showBookDropdown: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.borrowLocal._id;
    },
    filteredReaders() {
      if (!this.readerSearch) return this.readers;
      const search = this.readerSearch.toLowerCase();
      return this.readers.filter((r) =>
        `${r.hoLot} ${r.ten} ${r.maDocGia}`.toLowerCase().includes(search)
      );
    },
    filteredBooks() {
      // Chỉ hiển thị sách còn số lượng > 0
      let available = this.books.filter((b) => b.soQuyen > 0);
      if (!this.bookSearch) return available;
      const search = this.bookSearch.toLowerCase();
      return available.filter((b) =>
        `${b.tenSach} ${b.tacGia}`.toLowerCase().includes(search)
      );
    },
    hanTraFormatted() {
      if (!this.borrowLocal.ngayMuon) return "—";
      const ngayMuon = new Date(this.borrowLocal.ngayMuon);
      const hanTra = new Date(ngayMuon);
      hanTra.setDate(hanTra.getDate() + 14);
      return hanTra.toLocaleDateString("vi-VN");
    },
    statusClass() {
      if (this.borrowLocal.trangThai === "matSach") return "status-lost";
      if (this.borrowLocal.trangThai === "daTra") return "status-returned";
      if (this.isOverdue) return "status-overdue";
      return "status-borrowing";
    },
    statusText() {
      if (this.borrowLocal.trangThai === "matSach") return "Mất sách";
      if (this.borrowLocal.trangThai === "daTra") return "Đã trả";
      if (this.isOverdue) return "Quá hạn";
      return "Đang mượn";
    },
    isOverdue() {
      if (this.borrowLocal.trangThai !== "dangMuon") return false;
      if (!this.borrowLocal.ngayMuon) return false;
      const ngayMuon = new Date(this.borrowLocal.ngayMuon);
      const hanTra = new Date(ngayMuon);
      hanTra.setDate(hanTra.getDate() + 14);
      return new Date() > hanTra;
    },
  },
  watch: {
    borrow: {
      handler(newVal) {
        this.borrowLocal = { ...newVal };
        this.updateSearchFields();
      },
      deep: true,
    },
  },
  methods: {
    selectReader(reader, field) {
      this.borrowLocal.maDocGia = reader.maDocGia;
      field.onChange(reader.maDocGia);
      this.readerSearch = `${reader.hoLot} ${reader.ten}`;
      this.showReaderDropdown = false;
    },
    selectBook(book, field) {
      this.borrowLocal.maSach = book.maSach;
      field.onChange(book.maSach);
      this.bookSearch = book.tenSach;
      this.showBookDropdown = false;
    },
    submitBorrow() {
      this.$emit("submit:borrow", this.borrowLocal);
    },
    formatDate(date) {
      if (!date) return "—";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    formatCurrency(amount) {
      if (!amount) return "0đ";
      return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    },
    updateSearchFields() {
      if (this.borrowLocal.docGia) {
        this.readerSearch = `${this.borrowLocal.docGia.hoLot || ""} ${
          this.borrowLocal.docGia.ten || ""
        }`.trim();
      }
      if (this.borrowLocal.sach) {
        this.bookSearch = this.borrowLocal.sach.tenSach || "";
      }
      if (this.borrowLocal.ngayMuon) {
        this.borrowLocal.ngayMuon = new Date(this.borrowLocal.ngayMuon)
          .toISOString()
          .split("T")[0];
      }
    },
    handleClickOutside(e) {
      if (
        this.$refs.readerDropdown &&
        !this.$refs.readerDropdown.contains(e.target)
      ) {
        this.showReaderDropdown = false;
      }
      if (
        this.$refs.bookDropdown &&
        !this.$refs.bookDropdown.contains(e.target)
      ) {
        this.showBookDropdown = false;
      }
    },
    async loadData() {
      try {
        [this.readers, this.books] = await Promise.all([
          ReaderService.getAll(),
          BookService.getAll(),
        ]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    },
  },
  async mounted() {
    await this.loadData();
    this.updateSearchFields();
    document.addEventListener("click", this.handleClickOutside);

    // Fix ngày mượn là ngày hiện tại
    if (!this.isEdit) {
      this.borrowLocal.ngayMuon = new Date().toISOString().split("T")[0];
    }
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #dc2626;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4361ee;
}

.form-control:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.dropdown-list {
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  background: white;
  border-radius: 10px;
}

.list-group-item {
  cursor: pointer;
  padding: 12px 16px;
}

.list-group-item.active {
  background-color: #4361ee;
  border-color: #4361ee;
}

.error-feedback {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.status-display {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  text-align: center;
}

.status-borrowing {
  background: #dbeafe;
  color: #1e40af;
}

.status-returned {
  background: #d1fae5;
  color: #065f46;
}

.status-overdue {
  background: #fee2e2;
  color: #991b1b;
}

.status-lost {
  background: #fef3c7;
  color: #92400e;
}

.text-danger {
  color: #dc2626 !important;
  font-weight: 600;
}

.text-warning {
  color: #d97706 !important;
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #4361ee, #3730a3);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #06d6a0, #05b384);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 214, 160, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ef476f, #dc3856);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 71, 111, 0.4);
}
</style>
