<script>
export default {
  props: {
    books: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
  },
};
</script>

<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
    <div v-for="book in books" :key="book.maSach" class="col">
      <router-link
        :to="{ name: 'books.edit', params: { id: book.maSach } }"
        custom
        v-slot="{ navigate }"
      >
        <div class="book-card" @click="navigate">
          <div class="book-image-wrapper">
            <img
              :src="book.anhSach || '/placeholder-book.svg'"
              class="book-image"
              :alt="book.tenSach"
            />
            <div class="book-overlay">
              <span class="view-btn">
                <i class="fas fa-eye"></i> Xem chi tiết
              </span>
            </div>
          </div>

          <div class="book-info">
            <h5 class="book-title">{{ book.tenSach }}</h5>
            <p class="book-author">
              <i class="fas fa-pen-fancy"></i>
              {{ book.tacGia || "Đang cập nhật" }}
            </p>
            <div class="book-meta">
              <span class="book-price" v-if="book.donGia">
                {{ new Intl.NumberFormat("vi-VN").format(book.donGia) }}đ
              </span>
              <span class="book-quantity" v-if="book.soQuyen">
                <i class="fas fa-layer-group"></i> {{ book.soQuyen }}
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
}

.book-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-image {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(67, 97, 238, 0.9),
    rgba(114, 9, 183, 0.9)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.view-btn {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(4px);
}

.book-info {
  padding: 20px;
}

.book-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
  font-size: 1rem;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 48px;
  line-height: 1.5;
}

.book-author {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.book-author i {
  color: #9ca3af;
  font-size: 0.75rem;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-price {
  font-weight: 700;
  color: #4361ee;
  font-size: 1rem;
}

.book-quantity {
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 20px;
}

.book-quantity i {
  font-size: 0.7rem;
}
</style>
