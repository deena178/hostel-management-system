const mongoose = require("mongoose");

const hostelRecordSchema = new mongoose.Schema({
    module: {
        type: String,
        required: true,
        index: true
    },
    recordId: {
        type: Number,
        required: true
    },
    record: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    minimize: false
});

hostelRecordSchema.index({ module: 1, recordId: 1 }, { unique: true });

module.exports = mongoose.model("HostelRecord", hostelRecordSchema);