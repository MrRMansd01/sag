const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// دریافت URL و Key از متغیرهای محیطی
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ خطا: متغیرهای SUPABASE_URL و SUPABASE_ANON_KEY باید در فایل .env تنظیم شوند');
    process.exit(1);
}

// ایجاد کلاینت Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;

