const API_URL_POSTS = '/api/posts';
const API_URL_CATEGORIES = '/api/categories';

document.addEventListener('DOMContentLoaded', () => {
    fetchAndPopulateNavCategories();

    const path = window.location.pathname;
    if (path.includes('articals.html') || path.endsWith('/blog') || path.endsWith('/blog/')) {
        initArticlesArchivePage();
    } else if (path.includes('artical_page.html')) {
        initSingleArticlePage();
    }
});

async function fetchAndPopulateNavCategories() {
    const dropdown = document.getElementById('nav-categories-dropdown');
    if (!dropdown) return;
    try {
        const response = await fetch(API_URL_CATEGORIES);
        const categories = await response.json();
        dropdown.innerHTML = '';
        categories.forEach(cat => {
            const link = document.createElement('a');
            link.className = 'dropdown-item';
            link.href = `/blog/articals.html?category=${cat._id}`;
            link.textContent = cat.name;
            dropdown.appendChild(link);
        });
    } catch (error) { console.error('Error loading nav categories:', error); }
}

function initHomePage() {
    fetchAndPopulateSlider();
    fetchAndDisplayLatestArticles(3, 'latest-posts-grid');
}

function initArticlesArchivePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    fetchAndDisplayLatestArticles(null, 'articles-archive-grid', categoryId);
    fetchAndDisplaySidebarCategories();
}

function initSingleArticlePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    if (articleId) {
        fetchAndDisplaySingleArticle(articleId);
    }
    fetchAndDisplaySidebarPosts();
    fetchAndDisplaySidebarCategories();
}

async function fetchAndPopulateSlider() {
    const sliderWrapper = document.getElementById('slider-wrapper');
    if (!sliderWrapper) return;
    try {
        const response = await fetch(API_URL_POSTS);
        const articles = await response.json();
        sliderWrapper.innerHTML = '';
        articles.slice(0, 5).forEach(article => {
            const slide = document.createElement('div');
            slide.className = 'article-slide';
            slide.innerHTML = `<a href="/blog/artical_page.html?id=${article._id}"><img src="${article.imageUrl || 'https://placehold.co/900x400'}" alt="${article.title}"><div class="article-slide-caption"><h3>${article.title}</h3></div></a>`;
            sliderWrapper.appendChild(slide);
        });
        initSliderLogic();
    } catch (error) { console.error('Error populating slider:', error); }
}

function initSliderLogic() {
    const sliderWrapper = document.getElementById('slider-wrapper');
    const slides = sliderWrapper.querySelectorAll('.article-slide');
    if (slides.length === 0) return;
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        else if (index >= totalSlides) index = 0;
        sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
    }
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    }
    function stopAutoPlay() { clearInterval(autoPlayInterval); }
    prevBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(currentIndex - 1); startAutoPlay(); });
    nextBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(currentIndex + 1); startAutoPlay(); });
    startAutoPlay();
}

async function fetchAndDisplayLatestArticles(limit, containerId, categoryId = null) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    let url = API_URL_POSTS;
    if (categoryId) url += `?category=${categoryId}`;
    try {
        const response = await fetch(url);
        let articles = await response.json();
        if (limit) articles = articles.slice(0, limit);
        grid.innerHTML = '';
        articles.forEach(article => {
            const categoryHtml = article.category ? `<span class="card-category">${article.category.name}</span>` : '';
            const articleCard = `<article class="article-card"><div class="card-image"><a href="/blog/artical_page.html?id=${article._id}"><img src="${article.imageUrl || 'https://placehold.co/600x400'}" alt="${article.title}"></a></div><div class="card-content">${categoryHtml}<h3 class="card-title"><a href="/blog/artical_page.html?id=${article._id}">${article.title}</a></h3><p class="card-excerpt">${article.excerpt}</p><a href="/blog/artical_page.html?id=${article._id}" class="card-link">ادامه مطلب &larr;</a></div></article>`;
            grid.insertAdjacentHTML('beforeend', articleCard);
        });
    } catch (error) { console.error('Error loading articles:', error); }
}

async function fetchAndDisplaySingleArticle(articleId) {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;
    try {
        const response = await fetch(`${API_URL_POSTS}/${articleId}`);
        const article = await response.json();
        if (!article) { articleContent.innerHTML = '<h1>مقاله یافت نشد</h1>'; return; }
        document.title = `${article.title} - دکتر سعادت اله روحانی`;
        let metaText = `نوشته شده در تاریخ ${new Date(article.createdAt).toLocaleDateString('fa-IR')} توسط ${article.author}`;
        if (article.category && article.category.name) metaText += ` | دسته‌بندی: <a href="/blog/articals.html?category=${article.category._id}">${article.category.name}</a>`;
        const tagsHtml = article.tags.map(tag => `<span class="tag-item">${tag}</span>`).join('');
        articleContent.innerHTML = `<header class="article-header"><img src="${article.imageUrl || 'https://placehold.co/900x450'}" alt="${article.title}" class="featured-image"><h1>${article.title}</h1><div class="article-meta">${metaText}</div><div class="article-tags">${tagsHtml}</div></header><div class="article-body">${article.content}</div>`;
    } catch (error) { console.error('Error loading article:', error); }
}

async function fetchAndDisplaySidebarPosts() {
    const sidebarList = document.getElementById('sidebar-latest-posts');
    if (!sidebarList) return;
    try {
        const response = await fetch(API_URL_POSTS);
        const articles = await response.json();
        sidebarList.innerHTML = '';
        articles.slice(0, 5).forEach(article => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="/blog/artical_page.html?id=${article._id}">${article.title}</a>`;
            sidebarList.appendChild(listItem);
        });
    } catch (error) { console.error('Error loading sidebar posts:', error); }
}

async function fetchAndDisplaySidebarCategories() {
    const categoriesList = document.getElementById('sidebar-categories-list');
    if (!categoriesList) return;
    try {
        const response = await fetch(API_URL_CATEGORIES);
        const categories = await response.json();
        categoriesList.innerHTML = `<li><a href="/blog/articals.html">همه مقالات</a></li>`;
        categories.forEach(cat => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="/blog/articals.html?category=${cat._id}">${cat.name}</a>`;
            categoriesList.appendChild(listItem);
        });
    } catch (error) { console.error('Error loading sidebar categories:', error); }
}