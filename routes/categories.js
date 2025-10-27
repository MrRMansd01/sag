// routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// GET: دریافت تمام دسته‌بندی‌ها
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: ایجاد یک دسته‌بندی جدید
router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name
    });
    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
