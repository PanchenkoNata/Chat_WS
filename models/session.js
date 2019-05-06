const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generalSchema = new Schema ({
    id: { 
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    // _id: false,
    timestamps: true,
});

const model = mongoose.model('Session', generalSchema);
module.exports = model;
