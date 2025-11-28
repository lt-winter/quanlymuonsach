<template>
  <div class="auth-layout">
    <div class="auth-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <i class="fas fa-book-reader"></i>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4361ee, #7209b7);
  top: -100px;
  right: -100px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #06d6a0, #118ab2);
  bottom: -50px;
  left: -50px;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #ffd166, #ef476f);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.auth-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #4361ee, #7209b7);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(67, 97, 238, 0.4);
}
</style>
