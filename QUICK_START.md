# راهنمای سریع راه‌اندازی

## 🚀 شروع سریع (3 مرحله)

### 1️⃣ ایجاد فایل .env

فایل `.env` را در ریشه پروژه ایجاد کنید:

```bash
cat > .env << 'EOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
PORT=3000
EOF
```

⚠️ **مهم:** مقادیر `SUPABASE_URL` و `SUPABASE_ANON_KEY` را از Supabase Dashboard کپی کنید.

### 2️⃣ اجرای SQL Schema

1. به [Supabase Dashboard](https://app.supabase.com) بروید
2. پروژه خود را باز کنید
3. به بخش **SQL Editor** بروید
4. محتوای فایل `supabase-schema.sql` را کپی کنید
5. در SQL Editor قرار داده و **Run** کنید

### 3️⃣ اجرای پروژه

```bash
npm start
```

✅ سرور در `http://localhost:3000` اجرا می‌شود!

---

## 📋 تغییرات نسبت به قبل

### آنچه تغییر کرد:
- ✅ MongoDB → Supabase (PostgreSQL)
- ✅ Mongoose → @supabase/supabase-js
- ✅ تمام routes به‌روزرسانی شدند
- ✅ API endpoints بدون تغییر (سازگاری کامل)

### آنچه تغییر نکرد:
- ✅ تمام URL ها
- ✅ همه API endpoints
- ✅ تمام frontend JavaScript ها
- ✅ ساختار فایل‌ها

---

## 🔧 عیب‌یابی

### خطا: "متغیرهای Supabase تنظیم نشده‌اند"
```bash
# چک کنید فایل .env وجود دارد
ls -la .env

# اگر وجود ندارد، طبق مرحله 1 آن را ایجاد کنید
```

### خطا: "relation does not exist"
```bash
# فایل schema را در SQL Editor اجرا کنید
# از Supabase Dashboard > SQL Editor
# محتوای supabase-schema.sql را اجرا کنید
```

### خطا: "permission denied for table"
```bash
# در Supabase Dashboard بروید به:
# Settings > Database > Policies
# مطمئن شوید که policies فعال هستند
```

---

## 📁 فایل‌های کلیدی

- `config/supabase.js` - تنظیمات Supabase
- `routes/posts.js` - API مقالات
- `routes/categories.js` - API دسته‌بندی‌ها
- `routes/tags.js` - API تگ‌ها
- `supabase-schema.sql` - ساختار جداول
- `SUPABASE_SETUP.md` - راهنمای کامل

---

## 💡 نکته‌ها

1. **اول اجرای SQL**: قبل از اجرای `npm start`، حتماً فایل SQL را اجرا کنید
2. **محیط امنیتی**: در production، policies را محدود کنید
3. **ذخیره‌سازی**: تصاویر فعلاً در `public/uploads/` ذخیره می‌شوند
4. **Node Version**: Supabase نیاز به Node 20+ دارد (نیازی به نگرانی نیست)

---

## 📚 مستندات بیشتر

- **راهنمای کامل**: `SUPABASE_SETUP.md`
- **تاریخچه تغییرات**: `CHANGELOG.md`
- **مستندات اصلی**: `README.md`

---

**خوبی مبارک! 🎉**

الان پروژه شما با Supabase کار می‌کند!

