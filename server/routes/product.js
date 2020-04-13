const express = require("express");
const router = express.Router();
const {
    requireSignin,
    isAuth,
    isAdmin
} = require("../controllers/auth")
const {
    userById
} = require("../controllers/user")
const {
    create,
    productById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo
} = require("../controllers/product")

router.get("/product/:productId", read);
router.post("/product/create/:userId", userById, requireSignin, isAuth, isAdmin, create);
router.delete("/product/:productId/:userId", userById, requireSignin, isAuth, isAdmin, remove);
router.put("/product/:productId/:userId", userById, requireSignin, isAuth, isAdmin, update);
router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/products/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;