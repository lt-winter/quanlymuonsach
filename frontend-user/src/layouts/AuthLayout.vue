<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="auth-card shadow p-4 bg-white rounded" style="min-width: 380px">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.auth-card {
  border-radius: 12px;
}
</style>
