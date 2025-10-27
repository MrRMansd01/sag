const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  tags: {
    type: [String],
    default: []
  },
  // ▼▼▼ فیلد جدید برای دسته‌بندی ▼▼▼
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category' // این خط مدل Post را به مدل Category متصل می‌کند
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
