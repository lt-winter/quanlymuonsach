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
      <Field name="donGia" v-slot="{ field }">
        <input
          type="text"
          class="form-control"
          :name="field.name"
          :value="formattedDonGia"
          @input="onDonGiaInput($event.target.value, field)"
          @blur="field.onBlur"
          :ref="field.ref"
        />
      </Field>
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
    <div class="form-group position-relative" ref="publisherDropdown">
      <label for="maNXB">Nhà xuất bản</label>

      <Field name="maNXB" v-slot="{ field }">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm nhà xuất bản..."
          :value="publisherSearch"
          @focus="showDropdown = true"
          @click.stop="showDropdown = true"
          @input="
            (e) => {
              publisherSearch = e.target.value;
              showDropdown = true;
            }
          "
        />

        <div
          v-if="showDropdown"
          class="list-group position-absolute w-100 mt-1 shadow-sm"
          style="max-height: 200px; overflow-y: auto; z-index: 10"
        >
          <button
            v-for="pub in filteredPublishers"
            :key="pub._id"
            class="list-group-item list-group-item-action"
            :class="{ active: pub._id === bookLocal.maNXB }"
            @click="
              () => {
                bookLocal.maNXB = pub._id;
                field.onChange(pub._id);
                publisherSearch = pub.tenNXB;
                showDropdown = false;
              }
            "
          >
            {{ pub.tenNXB }}
          </button>

          <div
            v-if="filteredPublishers.length === 0"
            class="list-group-item disabled"
          >
            Không tìm thấy nhà xuất bản
          </div>
        </div>
      </Field>

      <ErrorMessage name="maNXB" class="error-feedback" />
    </div>

    <div class="form-group position-relative" ref="authorDropdown">
      <label for="tacGia">Tác giả</label>
      <Field name="tacGia" v-slot="{ field }">
        <input
          type="text"
          class="form-control"
          v-model="bookLocal.tacGia"
          @input="(e) => { field.onChange(e); onAuthorInput(); }"
          @focus="showAuthorDropdown = true"
          @keydown.arrow-down.prevent="navigateAuthorSuggestions(1)"
          @keydown.arrow-up.prevent="navigateAuthorSuggestions(-1)"
          @keydown.enter.prevent="selectFirstAuthorSuggestion(field)"
          placeholder="Nhập tên tác giả..."
        />
      </Field>
      
      <!-- Author Suggestions Dropdown -->
      <div
        v-if="showAuthorDropdown && filteredAuthorSuggestions.length > 0"
        class="list-group position-absolute w-100 mt-1 shadow-sm genre-dropdown"
      >
        <button
          v-for="(author, index) in filteredAuthorSuggestions"
          :key="author"
          type="button"
          class="list-group-item list-group-item-action"
          :class="{ active: index === selectedAuthorIndex }"
          @mousedown.prevent="selectAuthor(author)"
        >
          <i class="fas fa-user-edit"></i> {{ author }}
        </button>
      </div>
      
      <ErrorMessage name="tacGia" class="error-feedback" />
    </div>

    <!-- Thể loại -->
    <div class="form-group position-relative" ref="genreDropdown">
      <label for="theLoai"
        >Thể loại <span class="text-muted">(có thể bỏ trống)</span></label
      >
      <div class="tags-input-wrapper">
        <div class="tags-container">
          <span
            v-for="(tag, index) in bookLocal.theLoai"
            :key="index"
            class="tag"
          >
            {{ tag }}
            <i class="fas fa-times" @click="removeTag(index)"></i>
          </span>
          <input
            type="text"
            class="tag-input"
            placeholder="Nhập thể loại và nhấn Enter..."
            v-model="newTag"
            @input="onGenreInput"
            @focus="showGenreDropdown = true"
            @keydown.enter.prevent="selectFirstSuggestion"
            @keydown.tab.prevent="selectFirstSuggestion"
            @keydown.arrow-down.prevent="navigateSuggestions(1)"
            @keydown.arrow-up.prevent="navigateSuggestions(-1)"
          />
        </div>
      </div>
      
      <!-- Genre Suggestions Dropdown -->
      <div
        v-if="showGenreDropdown && filteredGenreSuggestions.length > 0"
        class="list-group position-absolute w-100 mt-1 shadow-sm genre-dropdown"
      >
        <button
          v-for="(genre, index) in filteredGenreSuggestions"
          :key="genre"
          type="button"
          class="list-group-item list-group-item-action"
          :class="{ active: index === selectedSuggestionIndex }"
          @mousedown.prevent="selectGenre(genre)"
        >
          <i class="fas fa-tag"></i> {{ genre }}
        </button>
      </div>
      
      <small class="form-text text-muted">
        Chọn từ gợi ý hoặc nhập mới. Ví dụ: Văn học, Khoa học, Trinh thám...
      </small>
    </div>

    <!-- Mô tả -->
    <div class="form-group">
      <label for="moTa">Mô tả</label>
      <Field
        name="moTa"
        as="textarea"
        class="form-control"
        rows="4"
        placeholder="Nhập mô tả sách..."
        v-model="bookLocal.moTa"
      />
      <ErrorMessage name="moTa" class="error-feedback" />
    </div>

    <!-- Ảnh sách -->
    <div class="form-group">
      <label for="anhSach">URL Ảnh sách</label>
      <Field
        name="anhSach"
        type="url"
        class="form-control"
        placeholder="https://example.com/image.jpg"
        v-model="bookLocal.anhSach"
      />
      <ErrorMessage name="anhSach" class="error-feedback" />

      <!-- Preview ảnh -->
      <div class="image-preview mt-2">
        <img
          v-if="bookLocal.anhSach && isValidImageUrl"
          :src="bookLocal.anhSach"
          alt="Preview ảnh sách"
          @error="handleImageError"
        />
        <div v-else class="image-placeholder">
          <i class="fas fa-image"></i>
          <span>Chưa có ảnh</span>
        </div>
      </div>
      <div
        v-if="bookLocal.anhSach && !isValidImageUrl"
        class="image-error mt-2"
      >
        <i class="fas fa-exclamation-triangle"></i> URL ảnh không hợp lệ
      </div>
    </div>

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
import BookService from "@/services/book.service";

export default {
  components: { Form, Field, ErrorMessage },

  emits: ["submit:book", "delete:book"],

  props: {
    book: { type: Object, required: true },
  },

  data() {
    const bookFormSchema = yup.object().shape({
      tenSach: yup.string().required("Tên sách là bắt buộc.").min(2).max(100),
      donGia: yup
        .number()
        .typeError("Đơn giá phải là số.")
        .required("Đơn giá là bắt buộc."),
      soQuyen: yup.number().typeError("Số quyển phải là số.").min(0).required(),
      namXuatBan: yup
        .number()
        .typeError("Năm xuất bản không hợp lệ.")
        .min(1900)
        .max(new Date().getFullYear()),
      maNXB: yup.string().required("Phải chọn nhà xuất bản."),
      moTa: yup
        .string()
        .nullable()
        .notRequired()
        .max(2000, "Mô tả tối đa 2000 ký tự."),
      anhSach: yup
        .string()
        .nullable()
        .notRequired()
        .test(
          "is-valid-image-url",
          "URL phải là đường dẫn đến file ảnh (jpg, png, gif, webp, svg)",
          (value) => {
            if (!value || value === "") return true;
            const urlPattern =
              /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
            return urlPattern.test(value);
          }
        ),
    });

    return {
      bookLocal: { ...this.book, theLoai: this.book.theLoai || [] },
      bookFormSchema,
      showDropdown: false,
      publishers: [],
      publisherSearch: "",
      imageLoadError: false,
      newTag: "",
      showGenreDropdown: false,
      availableGenres: [],
      selectedSuggestionIndex: -1,
      showAuthorDropdown: false,
      availableAuthors: [],
      selectedAuthorIndex: -1,
    };
  },

  watch: {
    book: {
      handler(newBook) {
        this.bookLocal = { ...newBook, theLoai: newBook.theLoai || [] };
        if (this.bookLocal.donGia) {
          this.bookLocal.donGia = String(this.bookLocal.donGia);
        }
        if (this.$refs.form?.setFieldValue) {
          const val = this.bookLocal.donGia
            ? Number(String(this.bookLocal.donGia).replace(/\./g, ""))
            : undefined;
          if (val !== undefined && !Number.isNaN(val)) {
            this.$refs.form.setFieldValue("donGia", val);
          }
        }
        this.syncPublisherSearch();
      },
      deep: true,
      immediate: true,
    },

    publishers() {
      this.syncPublisherSearch();
    },

    "bookLocal.anhSach"() {
      this.imageLoadError = false;
    },
  },

  computed: {
    filteredPublishers() {
      if (!this.publisherSearch) return this.publishers;
      return this.publishers.filter((p) =>
        p.tenNXB.toLowerCase().includes(this.publisherSearch.toLowerCase())
      );
    },
    filteredGenreSuggestions() {
      if (!this.newTag.trim()) return this.availableGenres;
      const search = this.newTag.trim().toLowerCase();
      return this.availableGenres
        .filter(
          (genre) =>
            genre.toLowerCase().includes(search) &&
            !this.bookLocal.theLoai.includes(genre)
        )
        .slice(0, 5);
    },
    filteredAuthorSuggestions() {
      if (!this.bookLocal.tacGia || !this.bookLocal.tacGia.trim()) {
        return this.availableAuthors.slice(0, 5);
      }
      const search = this.bookLocal.tacGia.trim().toLowerCase();
      return this.availableAuthors
        .filter((author) => author.toLowerCase().includes(search))
        .slice(0, 5);
    },
    isValidImageUrl() {
      if (!this.bookLocal.anhSach) return false;
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
      return urlPattern.test(this.bookLocal.anhSach) && !this.imageLoadError;
    },
    formattedDonGia() {
      if (!this.bookLocal.donGia) return "";
      return this.bookLocal.donGia
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },

  methods: {
    onDonGiaInput(value, field) {
      const raw = value.replace(/\./g, "");
      const num = raw ? Number(raw) : "";

      this.bookLocal.donGia = num;
      if (field && typeof field.onChange === "function") {
        field.onChange(num);
      }
    },
    async fetchPublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    syncPublisherSearch() {
      if (!this.bookLocal?.maNXB) return;
      if (!this.publishers.length) return;

      const pub = this.publishers.find((p) => p._id === this.bookLocal.maNXB);
      if (!pub) return;

      this.publisherSearch = pub.tenNXB;

      if (this.$refs.form?.setFieldValue) {
        this.$refs.form.setFieldValue("maNXB", pub._id);
      }
    },

    submitBook() {
      this.$emit("submit:book", this.bookLocal);
    },

    deleteBook() {
      this.$emit("delete:book", this.bookLocal._id);
    },

    handleClickOutside(event) {
      const publisherDropdown = this.$refs.publisherDropdown;
      if (publisherDropdown && !publisherDropdown.contains(event.target)) {
        this.showDropdown = false;
      }
      
      const genreDropdown = this.$refs.genreDropdown;
      if (genreDropdown && !genreDropdown.contains(event.target)) {
        this.showGenreDropdown = false;
        this.selectedSuggestionIndex = -1;
      }
      
      const authorDropdown = this.$refs.authorDropdown;
      if (authorDropdown && !authorDropdown.contains(event.target)) {
        this.showAuthorDropdown = false;
        this.selectedAuthorIndex = -1;
      }
    },

    handleImageError() {
      this.imageLoadError = true;
    },

    async fetchAvailableGenres() {
      try {
        const books = await BookService.getAll();
        const genresSet = new Set();
        books.forEach((book) => {
          if (book.theLoai && Array.isArray(book.theLoai)) {
            book.theLoai.forEach((genre) => genresSet.add(genre));
          }
        });
        this.availableGenres = Array.from(genresSet).sort();
      } catch (error) {
        console.log(error);
      }
    },

    async fetchAvailableAuthors() {
      try {
        const books = await BookService.getAll();
        const authorsSet = new Set();
        books.forEach((book) => {
          if (book.tacGia && book.tacGia.trim()) {
            authorsSet.add(book.tacGia.trim());
          }
        });
        this.availableAuthors = Array.from(authorsSet).sort();
      } catch (error) {
        console.log(error);
      }
    },

    onGenreInput() {
      this.showGenreDropdown = true;
      this.selectedSuggestionIndex = -1;
    },

    selectGenre(genre) {
      if (!this.bookLocal.theLoai.includes(genre)) {
        this.bookLocal.theLoai = [...this.bookLocal.theLoai, genre];
      }
      this.newTag = "";
      this.showGenreDropdown = false;
      this.selectedSuggestionIndex = -1;
    },

    selectFirstSuggestion() {
      if (this.filteredGenreSuggestions.length > 0 && this.selectedSuggestionIndex >= 0) {
        this.selectGenre(this.filteredGenreSuggestions[this.selectedSuggestionIndex]);
      } else {
        this.addTag();
      }
    },

    navigateSuggestions(direction) {
      const maxIndex = this.filteredGenreSuggestions.length - 1;
      if (maxIndex < 0) return;
      
      this.selectedSuggestionIndex += direction;
      if (this.selectedSuggestionIndex > maxIndex) {
        this.selectedSuggestionIndex = 0;
      } else if (this.selectedSuggestionIndex < 0) {
        this.selectedSuggestionIndex = maxIndex;
      }
    },

    addTag() {
      const tag = this.newTag.trim();
      if (tag && !this.bookLocal.theLoai.includes(tag)) {
        this.bookLocal.theLoai = [...this.bookLocal.theLoai, tag];
        this.newTag = "";
        this.showGenreDropdown = false;
        this.selectedSuggestionIndex = -1;
      }
    },

    removeTag(index) {
      this.bookLocal.theLoai.splice(index, 1);
    },

    handleGenreClickOutside(event) {
      const dropdown = this.$refs.genreDropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.showGenreDropdown = false;
        this.selectedSuggestionIndex = -1;
      }
    },

    onAuthorInput() {
      this.showAuthorDropdown = true;
      this.selectedAuthorIndex = -1;
    },

    selectAuthor(author) {
      this.bookLocal.tacGia = author;
      if (this.$refs.form?.setFieldValue) {
        this.$refs.form.setFieldValue('tacGia', author);
      }
      this.showAuthorDropdown = false;
      this.selectedAuthorIndex = -1;
    },

    selectFirstAuthorSuggestion(field) {
      if (this.filteredAuthorSuggestions.length > 0 && this.selectedAuthorIndex >= 0) {
        this.selectAuthor(this.filteredAuthorSuggestions[this.selectedAuthorIndex]);
      } else {
        this.showAuthorDropdown = false;
      }
    },

    navigateAuthorSuggestions(direction) {
      const maxIndex = this.filteredAuthorSuggestions.length - 1;
      if (maxIndex < 0) return;
      
      this.selectedAuthorIndex += direction;
      if (this.selectedAuthorIndex > maxIndex) {
        this.selectedAuthorIndex = 0;
      } else if (this.selectedAuthorIndex < 0) {
        this.selectedAuthorIndex = maxIndex;
      }
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
    await this.fetchAvailableGenres();
    await this.fetchAvailableAuthors();
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
.page {
  max-width: 576px;
  margin: auto;
}

.tags-input-wrapper {
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 42px;
  background: white;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
  align-items: center;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #007bff;
  color: white;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.tag i {
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.tag i:hover {
  opacity: 1;
}

.tag-input {
  flex: 1;
  min-width: 150px;
  border: none;
  outline: none;
  padding: 4px;
  font-size: 0.875rem;
}

.tag-input::placeholder {
  color: #999;
}

.genre-dropdown {
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  background: white;
}

.genre-dropdown .list-group-item {
  cursor: pointer;
  padding: 10px 15px;
  transition: all 0.2s;
}

.genre-dropdown .list-group-item i {
  color: #6c757d;
  margin-right: 8px;
}

.genre-dropdown .list-group-item:hover {
  background-color: #f8f9fa;
}

.genre-dropdown .list-group-item.active {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.genre-dropdown .list-group-item.active i {
  color: white;
}

.image-preview {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  background: #f8fafc;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  object-fit: contain;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  color: #94a3b8;
  gap: 8px;
}

.image-placeholder i {
  font-size: 2.5rem;
}

.image-placeholder span {
  font-size: 0.875rem;
}

.image-error {
  color: #dc3545;
  font-size: 0.875rem;
  padding: 8px;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 4px;
}
</style>
