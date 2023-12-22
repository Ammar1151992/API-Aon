const express = require("express");
const app = express()
const products = require("./routes/product")
const orders = require("./routes/order");
const admins = require("./routes/admin");
const user = require("./routes/user")
const checkAuth = require("./moddleware");
const fileUpload = require("express-fileupload");

const port = 3000;
app.use(express.json())

app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 124}
}))

app.use("/products", checkAuth, products);
app.use("/orders", orders);
app.use("/admin", admins);
app.use("/user", user)




app.listen(port, () => {
    console.log("Localhost 3000 ...");
})