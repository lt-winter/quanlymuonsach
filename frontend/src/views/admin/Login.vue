<template>
  <div class="login-wrapper">
    <h2>Đăng nhập hệ thống</h2>

    <form @submit.prevent="login">
      <div class="mb-3">
        <label>Tên người dùng</label>
        <input v-model="tenNguoiDung" class="form-control" required />
      </div>

      <div class="mb-3">
        <label>Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          required
        />
      </div>

      <button class="btn btn-primary w-100">Đăng nhập</button>
    </form>

    <p v-if="error" class="text-danger mt-2">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async login() {
      const res = await fetch("/api/nhanvien/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      const data = await res.json();

      if (!data.user) {
        this.error = "Sai tài khoản hoặc mật khẩu";
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      // điều hướng theo role
      if (data.user.vaiTro === "superadmin") {
        this.$router.push("/superadmin/dashboard");
      } else {
        this.$router.push("/admin/dashboard");
      }
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
