const express = require("express");
const router = express.Router();
const checkAuth = require("../moddleware");

const {productVeiw,
       productVeiwId,
       addOrder,
       register,
       login
    } = require("../module/user")

router.get("/productview", productVeiw)
router.post("/productview/:id", checkAuth, productVeiwId)
router.post("/addOrder",checkAuth, addOrder)
router.post("/register", register)
router.post("/login", login)


module.exports = router;