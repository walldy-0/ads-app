const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, minlength: 4, maxlength: 16 },
  password: { type: String, required: true },
  avatar: { type: String },
  phone: { type: String, required: true , minlength: 9, maxlength: 16 }
});

module.exports = mongoose.model('User', userSchema);
