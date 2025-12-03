import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/style.css";
import "./assets/form.css";

import router from "./router";
import NotificationPlugin from "./plugins/notification";

const app = createApp(App);
app.use(router);
app.use(NotificationPlugin);
app.mount("#app");
