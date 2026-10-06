const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: String,
    food: String
});

module.exports = mongoose.model("Order", orderSchema);