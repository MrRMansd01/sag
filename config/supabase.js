const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// دریافت URL و کلیدها از متغیرهای محیطی
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || (!serviceRoleKey && !supabaseAnonKey)) {
    console.error('❌ خطا: SUPABASE_URL و یکی از کلیدهای SUPABASE_SERVICE_ROLE_KEY یا SUPABASE_ANON_KEY باید تنظیم شوند');
    process.exit(1);
}

// ترجیح استفاده از Service Role در محیط سرور
const activeKey = serviceRoleKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, activeKey);

module.exports = supabase;

