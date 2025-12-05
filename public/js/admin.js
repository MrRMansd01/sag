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
            option.value = cat.id;
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

            // تشخیص ایجاد یا ویرایش
            const isEditing = currentEditingId !== null;
            const url = isEditing ? `/api/posts/${currentEditingId}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData
            });
            
            const result = await response.json();
            console.log('Response:', result);
            
            if (response.ok) {
                if (isEditing) {
                    alert('مقاله با موفقیت ویرایش شد!');
                } else {
                    alert('مقاله با موفقیت ایجاد شد!');
                }
                
                // بازنشانی فرم و دکمه‌ها
                createForm.reset();
                cancelEdit();
                
                fetchAndDisplayPosts();
            } else {
                const action = isEditing ? 'ویرایش' : 'ایجاد';
                alert('خطا در ' + action + ' مقاله: ' + (result.message || 'خطای نامشخص'));
            }
        });
    }
    
    let currentEditingId = null;

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
                const postId = e.target.dataset.id;
                await loadPostForEdit(postId);
            }
        });
    }

    async function loadPostForEdit(postId) {
        try {
            const response = await fetch(`/api/posts/${postId}`);
            const post = await response.json();
            
            // پر کردن فرم با اطلاعات مقاله
            document.getElementById('title').value = post.title;
            document.getElementById('excerpt').value = post.excerpt;
            document.getElementById('content').value = post.content;
            document.getElementById('author').value = post.author;
            document.getElementById('tags').value = post.tags ? post.tags.join(', ') : '';
            
            // اگر category داریم، آن را انتخاب کنیم
            if (post.category && post.category.id) {
                document.getElementById('category-select').value = post.category.id;
            } else {
                document.getElementById('category-select').value = '';
            }
            
            currentEditingId = post._id;
            
            // تغییر دکمه و نمایش دکمه انصراف
            const submitBtn = document.getElementById('submit-btn');
            const cancelBtn = document.getElementById('cancel-edit-btn');
            const formTitle = document.getElementById('form-title');
            
            submitBtn.textContent = 'ویرایش مقاله';
            cancelBtn.style.display = 'block';
            formTitle.textContent = 'ویرایش مقاله';
            
            // اسکرول به فرم
            createForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        } catch (err) {
            console.error('خطا در بارگذاری مقاله:', err);
            alert('خطا در بارگذاری مقاله برای ویرایش');
        }
    }

    function cancelEdit() {
        currentEditingId = null;
        createForm.reset();
        const submitBtn = document.getElementById('submit-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        const formTitle = document.getElementById('form-title');
        
        submitBtn.textContent = 'ایجاد مقاله';
        cancelBtn.style.display = 'none';
        formTitle.textContent = 'ایجاد مقاله جدید';
    }

    // اضافه کردن event listener برای دکمه انصراف
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', cancelEdit);
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
