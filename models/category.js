// models/category.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true // نام هر دسته‌بندی باید منحصر به فرد باشد
    }
});

module.exports = mongoose.model('Category', categorySchema);
