-- ساختار جداول برای Supabase
-- لطفاً این فایل را در SQL Editor در Supabase Dashboard اجرا کنید

-- جدول دسته‌بندی‌ها
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for service role" ON categories
    FOR ALL USING (true) WITH CHECK (true);

-- ایجاد جدول posts
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    category UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin(tags);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for service role" ON posts
    FOR ALL USING (true) WITH CHECK (true);

-- ایجاد Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- ایجاد Policies برای Storage
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Allow uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Allow deletes" ON storage.objects
    FOR DELETE USING (bucket_id = 'post-images');

