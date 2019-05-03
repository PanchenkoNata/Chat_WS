const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generalSchema = new Schema({
    name: { type: String },
    users: [ {type: String }, ],
})
