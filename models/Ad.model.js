const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 10, maxlength: 50 },
  text: { type: String, required: true, minlength: 20, maxlength: 1000 },
  publishDate: { type: Date, required: true },
  photo: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  user: { type: String, required: true, ref: 'User' }
});

module.exports = mongoose.model('Ad', adSchema);
