const express = require("express");
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth")
const { userById } = require("../controllers/user")
const { create, categoryById, read, update, remove, list } = require("../controllers/category")

router.post("/category/create/:userId", userById, requireSignin, isAuth, isAdmin, create);
router.get("/category/:categoryId/:userId", userById, requireSignin, isAuth, isAdmin, read);
router.put("/category/:categoryId/:userId", userById, requireSignin, isAuth, isAdmin, update);
router.delete("/category/:categoryId/:userId", userById, requireSignin, isAuth, isAdmin, remove);
router.get("/categories", list);

router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;