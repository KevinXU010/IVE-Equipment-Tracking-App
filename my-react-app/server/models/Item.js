const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  borrowed: Boolean,
  statement: String,
  description: String,
  img: String,
  qr: String
});

module.exports = mongoose.model('Item', itemSchema);
