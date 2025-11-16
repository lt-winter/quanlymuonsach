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
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
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
            style="height: 150px; object-fit: cover"
          />

          <div class="card-body">
            <h5 class="card-title">{{ book.tenSach }}</h5>
            <p><b>Tác giả:</b> {{ book.tacGia }}</p>
           </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.5em * 3);
  line-height: 1.5rem;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-body > *:last-child {
  margin-top: auto;
}
</style>
