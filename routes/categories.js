// routes/categories.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET: دریافت تمام دسته‌بندی‌ها
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST: ایجاد یک دسته‌بندی جدید
router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name: req.body.name }])
            .select()
            .single();
        
        if (error) {
            // بررسی خطای تکراری
            if (error.code === '23505') {
                return res.status(400).json({ message: 'نام دسته‌بندی تکراری است' });
            }
            throw error;
        }
        
        res.status(201).json(data);
    } catch (err) {
        console.error('خطا در ایجاد دسته‌بندی:', err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
