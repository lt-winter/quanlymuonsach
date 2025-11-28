<template>
  <div class="admin-layout">
    <AppHeader />
    <main class="main-content">
      <div class="container py-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  components: {
    AppHeader,
  },
};
</script>

<style>
.admin-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.main-content {
  padding-top: 20px;
  padding-bottom: 40px;
}

.page {
  margin: auto;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
