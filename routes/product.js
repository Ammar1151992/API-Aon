const express = require("express")
const router = express.Router();
const {productVeiw,
       addProduct,
       editProduct,
       deletProduct} = require("../module/product")

router.get("/veiw", productVeiw)
router.post("/add", addProduct)
router.put("/update/:id", editProduct)
router.delete("/delete/:id", deletProduct)


module.exports = router;