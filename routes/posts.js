const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// تنظیمات Multer برای ذخیره فایل‌ها
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
        try {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
        } catch (e) {
            return cb(e);
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb){
        cb(null, 'postImage-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) return cb(new Error('فرمت تصویر مجاز نیست'));
        cb(null, true);
    }
});

// GET: دریافت تمام مقالات
router.get('/', async (req, res) => {
    try {
        let query = supabase
            .from('posts')
            .select(`
                *,
                category:categories (
                    id,
                    name
                )
            `)
            .order('created_at', { ascending: false });
        
        // فیلتر بر اساس دسته‌بندی
        if (req.query.category) {
            query = query.eq('category', req.query.category);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // تبدیل داده‌ها برای سازگاری با فرمت قبلی
        const formattedData = data.map(post => ({
            ...post,
            _id: post.id,
            imageUrl: post.image_url,
            category: post.category || null,
            createdAt: post.created_at,
            updatedAt: post.updated_at
        }));
        
        res.json(formattedData);
    } catch (err) {
        console.error('خطا در دریافت مقالات:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET: دریافت یک مقاله خاص با ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                category:categories (
                    id,
                    name
                )
            `)
            .eq('id', req.params.id)
            .single();
        
        if (error) throw error;
        if (!data) return res.status(404).json({ message: 'مقاله یافت نشد' });
        
        // تبدیل داده‌ها برای سازگاری با فرمت قبلی
        const formattedData = {
            ...data,
            _id: data.id,
            imageUrl: data.image_url,
            category: data.category || null,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
        
        res.json(formattedData);
    } catch (err) {
        console.error('خطا در دریافت مقاله:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST: ایجاد مقاله جدید همراه با آپلود تصویر
router.post('/', (req, res) => {
    upload.single('postImage')(req, res, async (err) => {
        if (err) {
            console.error('خطا در آپلود تصویر:', err);
            return res.status(400).json({ message: err.message || 'خطا در آپلود تصویر' });
        }

        let imageUrl = '';
        if (req.file) {
            imageUrl = '/uploads/' + req.file.filename;
        }

        // تبدیل تگ‌ها به آرایه
        let tagsArray = [];
        if (req.body.tags) {
            if (typeof req.body.tags === 'string') {
                tagsArray = [req.body.tags];
            } else if (Array.isArray(req.body.tags)) {
                tagsArray = req.body.tags;
            }
        }
        tagsArray = tagsArray.map(t => (t || '').trim()).filter(Boolean);

        // مدیریت category - اگر خالی یا undefined است، null کن
        let categoryValue = null;
        if (req.body.category && req.body.category.trim() !== '' && req.body.category !== 'undefined') {
            categoryValue = req.body.category;
        }

        const required = ['title','excerpt','content','author'];
        for (const f of required) {
            if (!req.body[f] || !req.body[f].trim()) {
                return res.status(400).json({ message: `فیلد ${f} الزامی است` });
            }
        }

        const postData = {
            title: req.body.title,
            excerpt: req.body.excerpt,
            content: req.body.content,
            author: req.body.author,
            tags: tagsArray,
            image_url: imageUrl || null,
            category: categoryValue
        };

        try {
            const { data, error } = await supabase
                .from('posts')
                .insert([postData])
                .select()
                .single();
            
            if (error) throw error;
            
            const formattedData = {
                ...data,
                _id: data.id,
                imageUrl: data.image_url,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };
            
            res.status(201).json(formattedData);
        } catch (err) {
            console.error('خطا در ایجاد مقاله:', err);
            res.status(400).json({ message: err.message });
        }
    });
});

// PUT: ویرایش یک مقاله
router.put('/:id', async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updated_at: new Date().toISOString()
        };
        
        // اگر imageUrl ارسال شده، آن را به image_url تبدیل کن
        if (updateData.imageUrl) {
            updateData.image_url = updateData.imageUrl;
            delete updateData.imageUrl;
        }
        
        const { data, error } = await supabase
            .from('posts')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error) throw error;
        
        // فرمت کردن پاسخ
        const formattedData = {
            ...data,
            _id: data.id,
            imageUrl: data.image_url,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
        
        res.json(formattedData);
    } catch (err) {
        console.error('خطا در ویرایش مقاله:', err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE: حذف یک مقاله
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.json({ message: 'مقاله با موفقیت حذف شد' });
    } catch (err) {
        console.error('خطا در حذف مقاله:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
