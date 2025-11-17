const express = require("express");
const router = express.Router();
const employee = require("../controllers/employee.controller");

const auth = require("../middlewares/auth");
const superadmin = require("../middlewares/superadmin");

// LOGIN – không cần auth
router.post("/login", employee.login);

// Tất cả route phía dưới cần đăng nhập
router.use(auth);

// SUPERADMIN
router.get("/", employee.findAll);
router.get("/", superadmin, employee.findAll);
router.post("/", employee.create);
router.delete("/:id", superadmin, employee.delete);

// ADMIN + SUPERADMIN
router.get("/:id", employee.findOne);
router.put("/:id", superadmin, employee.update);

module.exports = router;
