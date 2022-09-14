const authRoute = require("../routes/auth");
const cartRoute = require("../routes/cart");
const orderRoute = require("../routes/order");
const paymentRoute = require("../routes/payment");
const productRoute = require("../routes/product");
const userRoute = require("../routes/user");

module.exports = function init(app) {
    app.use("/api/auth", authRoute);

    app.use("/api/users", userRoute);

    app.use("/api/orders", orderRoute);

    app.use("/api/carts", cartRoute);

    app.use("/api/products", productRoute);

    app.use("/api/payments", paymentRoute);

}


