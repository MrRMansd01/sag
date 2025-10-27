# تاریخچه تغییرات

## نسخه 2.1.0 - تبدیل به Supabase

### تغییرات عمده

#### پایگاه داده
- **از MongoDB به Supabase (PostgreSQL) مهاجرت شد**
- حذف Mongoose از پروژه
- اضافه کردن Supabase Client

#### Schema (Database)
- جدول `categories` با فیلدهای:
  - `id` (UUID, Primary Key)
  - `name` (TEXT, NOT NULL, UNIQUE)
  - `created_at` (TIMESTAMP)
  
- جدول `posts` با فیلدهای:
  - `id` (UUID, Primary Key)
  - `title`, `author`, `excerpt`, `content`
  - `image_url`
  - `tags` (TEXT[], آرایه تگ‌ها)
  - `category` (UUID, Foreign Key به categories)
  - `created_at`, `updated_at`
  
- ایندکس‌ها:
  - `idx_categories_name` روی categories.name
  - `idx_posts_category` روی posts.category
  - `idx_posts_created_at` روی posts.created_at
  - `idx_posts_tags` (GIN index) روی posts.tags

#### امنیت
- Row Level Security (RLS) فعال شد
- Policies برای دسترسی کامل (در محیط production باید تغییر کند)
- Storage Bucket برای تصاویر با سیاست‌های عمومی

#### فایل‌های جدید
- `config/supabase.js`: تنظیمات Supabase client
- `supabase-schema.sql`: ساختار جداول و policies
- `SUPABASE_SETUP.md`: راهنمای کامل راه‌اندازی
- `CHANGELOG.md`: این فایل

#### به‌روزرسانی Routes
- تمام routes به Supabase تبدیل شدند
- سازگاری با فرمت قبلی حفظ شد (`_id`, `imageUrl`)
- پشتیبانی کامل از فیلتر بر اساس category
- پشتیبانی از Populate برای جدول categories

#### Documentation
- README.md به‌روزرسانی شد
- توضیحات کامل در SUPABASE_SETUP.md
- افزودن اطلاعات API endpoints

### وابستگی‌ها
- **حذف شده:** mongoose
- **افزوده شده:** @supabase/supabase-js

### نکته‌های مهم
⚠️ برای اجرای پروژه نیاز به:
1. یک پروژه Supabase
2. اجرای فایل `supabase-schema.sql` در SQL Editor
3. فایل `.env` با اطلاعات Supabase

### Breaking Changes
- نیازی به MongoDB وجود ندارد
- فایل‌های `models/` دیگر استفاده نمی‌شوند (می‌توانند حذف شوند)
- متغیر محیطی `MONGODB_URI` دیگر استفاده نمی‌شود

### بهبودهای آینده
- [ ] آپلود تصاویر به Supabase Storage
- [ ] استفاده از Supabase Auth برای احراز هویت
- [ ] Real-time updates
- [ ] محیط Test و Production جداگانه

