const express = require("express")
const router = express.Router();
const {orderVeiw,
       editOrder} = require("../module/order")

router.get("/veiw", orderVeiw);
router.put("/changeStatus/:id", editOrder)


module.exports = router;