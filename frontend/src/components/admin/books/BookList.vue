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
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
    <div v-for="book in books" :key="book._id" class="col p-3">
      <router-link
        :to="{ name: 'books.edit', params: { id: book._id } }"
        custom
        v-slot="{ navigate }"
      >
        <div
          class="card h-100 shadow-sm"
          style="cursor: pointer"
          @click="navigate"
        >
          <img
            :src="book.image || '/placeholder-book.svg'"
            class="card-img-top"
            style="height: 200px; object-fit: cover"
          />

          <div class="card-body">
            <h5 class="card-title text-truncate">{{ book.tenSach }}</h5>
            <p><b>Tác giả:</b> {{ book.tacGia }}</p>
            <p>
              <b>Đơn giá:</b>
              {{
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(book.donGia)
              }}
            </p>
            <p><b>Số quyển:</b> {{ book.soQuyen }}</p>
            <p><b>Năm XB:</b> {{ book.namXuatBan }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
