const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generalSchema = new Schema({
    content: { type: String },
    user: { type: String },
    
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', generalSchema);
module.exports = Message;