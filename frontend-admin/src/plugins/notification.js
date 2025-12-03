// Simple notification plugin
export default {
  install(app) {
    app.config.globalProperties.$notify = {
      success: (message) => {
        alert(`✓ ${message}`);
      },
      error: (message) => {
        alert(`✗ ${message}`);
      },
      info: (message) => {
        alert(`ℹ ${message}`);
      },
    };
  },
};
