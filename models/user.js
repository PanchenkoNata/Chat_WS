const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generalSchema = new Schema ({
    name: { 
        type: Schema.Types.String,
        required: true,
        minLength: 2,
        maxLength: 20,
        unique: true,
    },
    rooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            index: true,
        },
    ],

}, {
    timestamps: true,
});

const model = mongoose.model('User', generalSchema);
module.exports = model;