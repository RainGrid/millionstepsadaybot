const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DailyRecord Schema
const DailyRecordSchema = Schema({
    stepsCount: Number,
    kilometers: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const DailyRecord = mongoose.model('DailyRecord', DailyRecordSchema);
module.exports = DailyRecord;