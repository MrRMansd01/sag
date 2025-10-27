const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const path = require('path');

// تنظیمات Multer برای ذخیره فایل‌ها
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, 'postImage-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET: دریافت تمام مقالات
router.get('/', async (req, res) => {
    try {
        const query = {};
        // اگر در درخواست، آی‌دی دسته‌بندی وجود داشت، به کوئری اضافه کن
        if (req.query.category) {
            query.category = req.query.category;
        }
        const posts = await Post.find(query).sort({ createdAt: -1 }).populate('category');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: دریافت یک مقاله خاص با ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('category');
        if (!post) return res.status(404).json({ message: 'مقاله یافت نشد' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: ایجاد مقاله جدید همراه با آپلود تصویر
router.post('/', upload.single('postImage'), async (req, res) => {
    let imageUrl = '';
    if (req.file) {
        imageUrl = '/uploads/' + req.file.filename;
    }

    const post = new Post({
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        author: req.body.author,
        tags: req.body.tags,
        imageUrl: imageUrl,
        category: req.body.category // << اضافه کردن ID دسته‌بندی
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: ویرایش یک مقاله
router.put('/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: حذف یک مقاله
router.delete('/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'مقاله با موفقیت حذف شد' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
