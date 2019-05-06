const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generalSchema = new Schema ({
    name: {
        type: Schema.Types.String,
        required: true,
        minLength: 1,
        maxLength: 20,
        unique: true,
    },
    users: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            dateConnected: {
                type: Schema.Types.Date,
                required: true,
            },
            _id: false,
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    }
}, {
    timestamps: true,
});

const model = mongoose.model('Room', generalSchema);
module.exports = model;
