const mongoose = require("mongoose");

const messMenuSchema = new mongoose.Schema({
    day_of_week: {
        type: String,
        required: true,
        enum: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
    },
    meal_type: {
        type: String,
        required: true,
        enum: ["breakfast", "lunch", "snacks", "dinner"]
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

messMenuSchema.index({ day_of_week: 1, meal_type: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("MessMenu", messMenuSchema);
