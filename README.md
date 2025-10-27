# پروژه وبلاگ/CMS - کلینیک زیبایی

این یک پروژه وبلاگ یا سیستم مدیریت محتوا (CMS) برای کلینیک زیبایی است که با استفاده از Node.js، Express و Supabase توسعه یافته است.

## توضیحات پروژه

این پروژه یک پلتفرم برای انتشار و مدیریت محتوای وبلاگ کلینیک زیبایی است. کاربران می‌توانند مقالات را مشاهده کنند و مدیران می‌توانند مقالات، دسته‌بندی‌ها و تگ‌ها را از طریق پنل مدیریت اضافه، ویرایش و حذف کنند.

## ویژگی‌ها

*   **مدیریت مقالات:** ایجاد، ویرایش و حذف مقالات با آپلود تصویر
*   **مدیریت دسته‌بندی‌ها:** سازماندهی مقالات در دسته‌بندی‌های مختلف
*   **مدیریت تگ‌ها:** افزودن تگ‌ها به مقالات برای بهبود قابلیت جستجو
*   **صفحات عمومی:** نمایش لیست مقالات و صفحات جزئیات مقاله
*   **پنل مدیریت:** رابط کاربری برای مدیریت محتوا
*   **فیچر اسلایدر:** نمایش مقالات مهم در اسلایدر صفحه اصلی

## تکنولوژی‌های استفاده شده

*   **Backend:** Node.js, Express.js
*   **Frontend:** HTML, CSS, JavaScript
*   **Database:** PostgreSQL (Supabase)
*   **File Upload:** Multer

## راه‌اندازی و نصب

### پیش‌نیازها

- Node.js (نسخه 14 یا بالاتر)
- حساب کاربری در [Supabase](https://supabase.com)

### مراحل نصب

1. **کلون کردن پروژه:**
```bash
git clone [لینک مخزن شما]
cd sag
```

2. **نصب وابستگی‌ها:**
```bash
npm install
```

3. **راه‌اندازی Supabase:**

   - یک پروژه جدید در [Supabase Dashboard](https://app.supabase.com) ایجاد کنید
   - به بخش SQL Editor بروید
   - فایل `supabase-schema.sql` را کپی کرده و در SQL Editor اجرا کنید
   - از بخش Settings > API، URL و anon key را کپی کنید

4. **ایجاد فایل .env:**
   
   یک فایل با نام `.env` در ریشه پروژه ایجاد کنید:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
PORT=3000
```

5. **اجرای سرور:**
```bash
npm start
```

پروژه در `http://localhost:3000` قابل دسترسی است.

📖 **راهنمای کامل:** برای جزئیات بیشتر به فایل `SUPABASE_SETUP.md` مراجعه کنید.

## ساختار پروژه

```
sag/
├── config/
│   └── supabase.js          # تنظیمات Supabase client
├── public/
│   ├── css/
│   │   └── style.css        # استایل‌های اصلی
│   ├── js/
│   │   ├── main.js          # JavaScript سمت کلاینت
│   │   └── admin.js         # JavaScript پنل مدیریت
│   └── uploads/             # تصاویر آپلود شده
├── routes/
│   ├── posts.js             # API routes برای مقالات
│   ├── categories.js        # API routes برای دسته‌بندی‌ها
│   └── tags.js              # API routes برای تگ‌ها
├── views/                   # فایل‌های HTML
├── server.js                # نقطه ورود اصلی
├── package.json             # وابستگی‌های پروژه
├── supabase-schema.sql      # ساختار جداول Supabase
└── SUPABASE_SETUP.md        # راهنمای راه‌اندازی Supabase
```

## API Endpoints

### مقالات (Posts)
- `GET /api/posts` - دریافت تمام مقالات
- `GET /api/posts/:id` - دریافت یک مقاله
- `POST /api/posts` - ایجاد مقاله جدید
- `PUT /api/posts/:id` - ویرایش مقاله
- `DELETE /api/posts/:id` - حذف مقاله

### دسته‌بندی‌ها (Categories)
- `GET /api/categories` - دریافت تمام دسته‌بندی‌ها
- `POST /api/categories` - ایجاد دسته‌بندی جدید

### تگ‌ها (Tags)
- `GET /api/tags/popular` - دریافت تگ‌های پرکاربرد

## صفحات وب‌سایت

- `/` - صفحه اصلی (کلینیک)
- `/blog` - صفحه وبلاگ
- `/blog/articals.html` - آرشیو مقالات
- `/blog/artical_page.html?id=XXX` - صفحه مقاله
- `/admin` - پنل مدیریت
- `/admin/dashboard` - داشبورد مدیریت

## لایسنس

MIT License
