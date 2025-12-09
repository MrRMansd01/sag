const express = require('express');
const path = require('path');
const postRoutes = require('./routes/posts');
const tagRoutes = require('./routes/tags');
const categoryRoutes = require('./routes/categories');

const app = express();

// استفاده از متغیرهای محیطی (اگر فایل .env وجود داشته باشد)
try {
    require('dotenv').config();
} catch (err) {
    console.log('⚠️  فایل .env یافت نشد، از مقادیر پیش‌فرض استفاده می‌شود');
}

const port = process.env.PORT || 3000;

// اطلاعات ورود ادمین - از متغیرهای محیطی یا مقادیر پیش‌فرض
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

// بررسی متغیرهای Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceRoleKey)) {
    console.error('\n❌ خطا: متغیرهای محیطی Supabase تنظیم نشده‌اند!');
    console.log('\n💡 راهنما:');
    console.log('   لطفاً فایل .env را ایجاد کرده و متغیرهای زیر را تنظیم کنید:');
    console.log('   SUPABASE_URL=https://your-project.supabase.co');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (ترجیحاً در سرور)');
    console.log('   یا SUPABASE_ANON_KEY=your-anon-key');
    console.log('   همچنین مطمئن شوید که فایل supabase-schema.sql را در Supabase اجرا کرده‌اید.\n');
    process.exit(1);
}

console.log('✅ اتصال به Supabase موفقیت‌آمیز');
console.log(supabaseServiceRoleKey ? '🔐 استفاده از Service Role Key' : '👤 استفاده از Anon Key');
console.log(`📊 پروژه: ${supabaseUrl}`);
console.log('\n🚀 سرور با موفقیت راه‌اندازی شد!');
console.log('═══════════════════════════════════════');
console.log(`📍 آدرس سرور: http://localhost:${port}`);
console.log(`🏠 صفحه اصلی (کلینیک): http://localhost:${port}/`);
console.log(`📝 وبلاگ: http://localhost:${port}/blog`);
console.log(`🔐 پنل مدیریت: http://localhost:${port}/admin`);
console.log('═══════════════════════════════════════\n');

if (ADMIN_USERNAME === 'admin' && ADMIN_PASSWORD === 'password123') {
    console.log('⚠️  هشدار: از رمز عبور پیش‌فرض استفاده می‌کنید!');
    console.log('   لطفاً قبل از استقرار در محیط واقعی، رمز عبور را تغییر دهید.\n');
}

app.listen(port);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// لاگ درخواست‌ها در محیط توسعه
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/assets/doctor-avatar.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'photo_5872972249906744101_x 1.svg'));
});

app.get('/assets/logo-icon.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'Untitled_design__1_-removebg-preview 1.svg'));
});

app.get('/assets/instagram.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'instagram-icon-svgrepo-com.svg'));
});

app.get('/assets/telegram.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'telegram-svgrepo-com.svg'));
});

app.get('/assets/call.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'call-svgrepo-com.svg'));
});

app.get('/assets/message.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'message-square-svgrepo-com.svg'));
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'نام کاربری یا رمز عبور اشتباه است' 
        });
    }
});

// ═══════════════════════════════════════
// صفحات اصلی
// ═══════════════════════════════════════

// صفحه اصلی - کلینیک زیبایی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'clinic.html'));
});

// ═══════════════════════════════════════
// مسیرهای وبلاگ
// ═══════════════════════════════════════

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'articals.html'));
});

app.get('/blog/index.html', (req, res) => {
    res.redirect('/blog/articals.html');
});

app.get('/blog/articals.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'articals.html'));
});

app.get('/blog/artical_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'artical_page.html'));
});

// ═══════════════════════════════════════
// مسیرهای پنل مدیریت
// ═══════════════════════════════════════

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/admin/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// ═══════════════════════════════════════
// مسیرهای قدیمی (Redirects)
// ═══════════════════════════════════════

app.get('/index.html', (req, res) => {
    res.redirect('/blog/articals.html');
});

app.get('/articals.html', (req, res) => {
    res.redirect('/blog/articals.html');
});

app.get('/artical_page.html', (req, res) => {
    res.redirect('/blog/artical_page.html');
});

app.get('/login.html', (req, res) => {
    res.redirect('/admin');
});

// ═══════════════════════════════════════
// Health Check
// ═══════════════════════════════════════

app.get('/health', async (req, res) => {
    try {
        // تست اتصال به Supabase
        const supabase = require('./config/supabase');
        const { error } = await supabase.from('posts').select('id').limit(1);
        
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: error ? 'error' : 'connected'
        });
    } catch (err) {
        res.json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'disconnected'
        });
    }
});

// ═══════════════════════════════════════
// 404 Handler
// ═══════════════════════════════════════

app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - صفحه یافت نشد</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                h1 {
                    font-size: 6rem;
                    margin: 0;
                    opacity: 0.8;
                }
                h2 {
                    font-size: 2rem;
                    margin: 1rem 0;
                }
                p {
                    font-size: 1.2rem;
                    margin: 2rem 0;
                    opacity: 0.9;
                }
                a {
                    display: inline-block;
                    padding: 1rem 2rem;
                    background: white;
                    color: #667eea;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: bold;
                    transition: transform 0.3s;
                }
                a:hover {
                    transform: translateY(-3px);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404</h1>
                <h2>صفحه یافت نشد</h2>
                <p>متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد.</p>
                <a href="/">🏠 بازگشت به صفحه اصلی</a>
            </div>
        </body>
        </html>
    `);
});

// ═══════════════════════════════════════
// Error Handler
// ═══════════════════════════════════════

app.use((err, req, res, next) => {
    console.error('❌ خطای سرور:', err);
    res.status(500).json({
        error: 'خطای داخلی سرور',
        message: process.env.NODE_ENV === 'development' ? err.message : 'مشکلی پیش آمده است'
    });
});

// ═══════════════════════════════════════
// Graceful Shutdown
// ═══════════════════════════════════════

process.on('SIGINT', async () => {
    console.log('\n\n🛑 در حال خاموش کردن سرور...');
    try {
        console.log('✅ سرور با موفقیت خاموش شد');
        process.exit(0);
    } catch (err) {
        console.error('❌ خطا در خاموش کردن سرور:', err);
        process.exit(1);
    }
});

module.exports = app;
