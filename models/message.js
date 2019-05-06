const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generalSchema = new Schema({
    content: { 
        type: Schema.Types.String,
        required: true,
        maxLength: 200,
    },
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
        unique: true,
    }
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', generalSchema);
module.exports = Message;