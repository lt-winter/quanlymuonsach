const express = require("express");
const readers = require("@/controllers/reader.controller");
const auth = require("@/middlewares/auth");

const router = express.Router();

// Public routes
router.post("/login", readers.login);
router.post("/register", readers.register);

// Protected routes
router.get("/profile", auth, readers.getProfile);
router.put("/profile", auth, readers.updateProfile);

// Notification routes (protected)
router.get("/notifications", auth, readers.getNotifications);
router.put("/notifications/read-all", auth, readers.markAllNotificationsAsRead);
router.put("/notifications/:id/read", auth, readers.markNotificationAsRead);
router.delete("/notifications/:id", auth, readers.deleteNotification);
router.delete("/notifications", auth, readers.deleteAllNotifications);

router
  .route("/")
  .get(readers.findAll)
  .post(readers.create)
  .delete(readers.deleteAll);

router
  .route("/:id")
  .get(readers.findOne)
  .put(readers.update)
  .patch(readers.delete);

module.exports = router;
