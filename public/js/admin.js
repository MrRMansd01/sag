document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    console.log('Current path:', path);
    if (path.includes('login.html') || path === '/admin' || path === '/admin/login') {
        initLoginPage();
    } else if (path.includes('admin.html')) {
        initAdminDashboard();
    }
});

function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (result.success) {
                window.location.href = '/admin.html';
            } else {
                errorMessage.textContent = result.message || 'خطایی رخ داد.';
            }
        } catch (err) {
            errorMessage.textContent = 'خطا در ارتباط با سرور.';
        }
    });
}

function initAdminDashboard() {
    const createForm = document.getElementById('create-post-form');
    const postsListContainer = document.getElementById('posts-list');
    const tagsInput = document.getElementById('tags');
    const suggestionsBox = document.getElementById('tag-suggestions');
    let popularTags = [];
    const categoryForm = document.getElementById('category-form');
    const categoryList = document.getElementById('category-list');
    const categorySelect = document.getElementById('category-select');

    async function fetchAndDisplayPosts() {
        try {
            const response = await fetch('/api/posts');
            const posts = await response.json();
            postsListContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-item';
                postElement.innerHTML = `
                    <span>${post.title}</span>
                    <div class="post-item-actions">
                        <button class="btn-edit" data-id="${post._id}">ویرایش</button>
                        <button class="btn-delete" data-id="${post._id}">حذف</button>
                    </div>
                `;
                postsListContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error("خطا در بارگذاری پست‌ها:", error);
        }
    }

    // --- بخش مدیریت دسته‌بندی‌ها ---
    async function loadCategories() {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        categoryList.innerHTML = '';
        categorySelect.innerHTML = '<option value="">یک دسته‌بندی انتخاب کنید...</option>';

        categories.forEach(cat => {
            // اضافه کردن به لیست نمایش
            const li = document.createElement('li');
            li.textContent = cat.name;
            categoryList.appendChild(li);

            // اضافه کردن به منوی کشویی فرم
            const option = document.createElement('option');
            option.value = cat._id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    }

    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('category-name');
        const name = nameInput.value;
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (response.ok) {
            nameInput.value = '';
            loadCategories(); // بارگذاری مجدد لیست
        } else {
            alert('خطا در ایجاد دسته‌بندی (شاید تکراری باشد)');
        }
    });

    // --- آپدیت فرم ایجاد پست ---
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('title', document.getElementById('title').value);
            formData.append('excerpt', document.getElementById('excerpt').value);
            formData.append('content', document.getElementById('content').value);
            formData.append('author', document.getElementById('author').value);
            const tagsInputVal = document.getElementById('tags').value;
            const tagsArray = tagsInputVal.split(',').map(tag => tag.trim()).filter(tag => tag);
            tagsArray.forEach(tag => formData.append('tags', tag));
            const imageInput = document.getElementById('postImage');
            if (imageInput.files[0]) {
                formData.append('postImage', imageInput.files[0]);
            }
            // اضافه کردن ID دسته‌بندی انتخاب شده
            const categoryValue = document.getElementById('category-select').value;
            if (categoryValue && categoryValue.trim() !== '') {
                formData.append('category', categoryValue);
            }
            // اگر category خالی است، ارسال نکن (null درنظر گرفته می‌شود)

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            console.log('Response:', result);
            
            if (response.ok) {
                alert('مقاله با موفقیت ایجاد شد!');
                createForm.reset();
                fetchAndDisplayPosts();
            } else {
                alert('خطا در ایجاد مقاله: ' + (result.message || 'خطای نامشخص'));
            }
        });
    }
    
    if (postsListContainer) {
        postsListContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const postId = e.target.dataset.id;
                if (confirm('آیا از حذف این مقاله مطمئن هستید؟')) {
                    const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
                    if (response.ok) fetchAndDisplayPosts(); else alert('خطا در حذف مقاله');
                }
            }
            if (e.target.classList.contains('btn-edit')) {
                alert('قابلیت ویرایش هنوز پیاده‌سازی نشده است.');
            }
        });
    }

    async function fetchPopularTags() {
        try {
            const response = await fetch('/api/tags/popular');
            const tagsData = await response.json();
            popularTags = tagsData.map(item => item.tag);
        } catch (err) {
            console.error('خطا در دریافت تگ‌ها:', err);
        }
    }

    function showSuggestions() {
        if (!tagsInput) return;
        const value = tagsInput.value;
        const currentTags = value.split(',').map(t => t.trim());
        const lastTag = currentTags[currentTags.length - 1].toLowerCase();
        suggestionsBox.innerHTML = '';
        if (lastTag === '') return;
        const filteredTags = popularTags.filter(pTag => pTag.toLowerCase().startsWith(lastTag) && !currentTags.includes(pTag));
        filteredTags.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = suggestion;
            div.addEventListener('click', () => {
                currentTags[currentTags.length - 1] = suggestion;
                tagsInput.value = currentTags.join(', ') + ', ';
                suggestionsBox.innerHTML = '';
                tagsInput.focus();
            });
            suggestionsBox.appendChild(div);
        });
    }

    if (tagsInput) {
        tagsInput.addEventListener('input', showSuggestions);
        tagsInput.addEventListener('focus', showSuggestions);
        document.addEventListener('click', (e) => {
            if (e.target.id !== 'tags') suggestionsBox.innerHTML = '';
        });
    }
    
    // --- اجرای توابع اولیه ---
    loadCategories();
    fetchPopularTags();
    fetchAndDisplayPosts();
}
