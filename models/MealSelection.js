const mongoose = require("mongoose");

const mealSelectionSchema = new mongoose.Schema({
    student_id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    },
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
    dish_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MessMenu",
        required: true
    }
}, {
    timestamps: true
});

mealSelectionSchema.index({ student_id: 1, day_of_week: 1, meal_type: 1, dish_id: 1 }, { unique: true });
mealSelectionSchema.index({ day_of_week: 1, meal_type: 1, dish_id: 1 });

module.exports = mongoose.model("MealSelection", mealSelectionSchema);