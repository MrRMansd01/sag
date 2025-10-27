const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET: دریافت تگ‌های پرکاربرد
router.get('/popular', async (req, res) => {
    try {
        // دریافت تمام پست‌ها با تگ‌ها
        const { data, error } = await supabase
            .from('posts')
            .select('tags');
        
        if (error) throw error;
        
        // شمارش تگ‌ها
        const tagCount = {};
        data.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => {
                    if (tag) {
                        tagCount[tag] = (tagCount[tag] || 0) + 1;
                    }
                });
            }
        });
        
        // تبدیل به آرایه و مرتب‌سازی
        const popularTags = Object.entries(tagCount)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map(item => ({ tag: item.tag }));
        
        res.json(popularTags);
    } catch (err) {
        console.error('خطا در دریافت تگ‌های پرکاربرد:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;