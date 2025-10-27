const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// GET: دریافت تگ‌های پرکاربرد
router.get('/popular', async (req, res) => {
    try {
        const popularTags = await Post.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, tag: '$_id' } }
        ]);
        res.json(popularTags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;