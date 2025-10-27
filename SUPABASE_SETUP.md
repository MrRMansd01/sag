# راهنمای تبدیل به Supabase

این پروژه از MongoDB به Supabase تبدیل شده است.

## مراحل راه‌اندازی

### 1. ایجاد پروژه Supabase

1. به [Supabase Dashboard](https://app.supabase.com) بروید
2. یک حساب کاربری ایجاد کنید یا وارد شوید
3. روی "New Project" کلیک کنید
4. اطلاعات پروژه را وارد کنید:
   - Name: نام پروژه شما
   - Database Password: یک رمز قوی انتخاب کنید
   - Region: نزدیک‌ترین منطقه را انتخاب کنید

### 2. ایجاد جداول در Supabase

1. در Supabase Dashboard، به بخش "SQL Editor" بروید
2. فایل `supabase-schema.sql` را باز کنید
3. محتوای آن را کپی کرده و در SQL Editor بگذارید
4. روی "Run" کلیک کنید تا جداول ایجاد شوند

### 3. دریافت کلیدهای API

1. در Supabase Dashboard، به بخش "Settings" > "API" بروید
2. دو کلید را کپی کنید:
   - `URL`: پروژه Supabase URL شما
   - `anon` `public`: کلید عمومی (anon key)

### 4. ایجاد فایل .env

یک فایل `.env` در ریشه پروژه ایجاد کنید با محتوای زیر:

```env
# تنظیمات Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# تنظیمات ورود ادمین
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123

# تنظیمات سرور
PORT=3000
```

**⚠️ مهم:** مقادیر `SUPABASE_URL` و `SUPABASE_ANON_KEY` را با اطلاعات پروژه Supabase خود جایگزین کنید.

### 5. نصب وابستگی‌ها

```bash
npm install
```

وابستگی‌های جدید به صورت خودکار نصب شده‌اند.

### 6. اجرای سرور

```bash
npm start
```

## تغییرات اعمال شده

### پایگاه داده
- **قبل:** MongoDB با Mongoose
- **حالا:** PostgreSQL با Supabase

### مدل‌ها
- فایل‌های `models/category.js` و `models/post.js` دیگر استفاده نمی‌شوند (می‌توانید حذف کنید)
- حالا از جداول Supabase استفاده می‌شود

### API Routes
- تمام routes به‌روزرسانی شده‌اند تا از Supabase استفاده کنند
- API endpoints تغییری نکرده‌اند، فقط backend تغییر کرده

### فایل‌های جدید
- `config/supabase.js`: تنظیمات Supabase client
- `supabase-schema.sql`: ساختار جداول برای Supabase
- `SUPABASE_SETUP.md`: این فایل راهنما

## ساختار جداول

### جدول `categories`
- `id`: UUID (کلید اصلی)
- `name`: TEXT (نام دسته‌بندی - یکتا)
- `created_at`: TIMESTAMP

### جدول `posts`
- `id`: UUID (کلید اصلی)
- `title`: TEXT (عنوان مقاله)
- `author`: TEXT (نویسنده)
- `excerpt`: TEXT (خلاصه)
- `content`: TEXT (محتوای مقاله)
- `image_url`: TEXT (آدرس تصویر)
- `tags`: TEXT[] (آرایه تگ‌ها)
- `category_id`: UUID (مرجع به categories)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## مزایای Supabase

1. **PostgreSQL**: یک پایگاه داده قوی و قابل اعتماد
2. **Row Level Security**: امنیت پیش‌فرض برای جدول‌ها
3. **اتصال مستقیم**: بدون نیاز به MongoDB Atlas
4. **آپلود فایل**: می‌توانید آپلود را به Supabase Storage تغییر دهید
5. **Real-time**: امکان اضافه کردن قابلیت real-time در آینده

## مسائل احتمالی

### خطا: "متغیرهای محیطی Supabase تنظیم نشده‌اند"
**راه حل:** فایل `.env` را ایجاد کرده و `SUPABASE_URL` و `SUPABASE_ANON_KEY` را تنظیم کنید.

### خطا: "relation does not exist"
**راه حل:** فایل `supabase-schema.sql` را در SQL Editor اجرا کنید.

### خطا: "permission denied"
**راه حل:** در Supabase Dashboard، به Settings > Database > Policies بروید و مطمئن شوید که policies فعال هستند.

## نکات امنیتی

1. فایل `.env` را هیچ‌وقت به git اضافه نکنید (در `.gitignore` است)
2. کلید `SUPABASE_ANON_KEY` را در کد frontend قرار ندهید
3. برای محیط production، از `service_role` key استفاده نکنید مگر در backend
4. رمز عبور ادمین را قبل از استقرار تغییر دهید

## پیشنهادات برای بهبود

1. **آپلود به Supabase Storage**: آپلود تصاویر را به Supabase Storage تغییر دهید
2. **Authentication**: از Supabase Auth برای ورود واقعی استفاده کنید
3. **Real-time**: با Supabase Realtime، به‌روزرسانی‌های زنده برای مقالات اضافه کنید
4. **Edge Functions**: از Supabase Edge Functions برای عملیات پیچیده استفاده کنید

## پشتیبانی

برای سؤالات بیشتر، به مستندات Supabase مراجعه کنید:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

