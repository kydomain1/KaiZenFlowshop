// Main JavaScript for KaiZenFlowshop Blog

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
});

// Initialize page based on current page
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        loadHomePage();
    } else if (currentPage === 'article.html') {
        loadArticlePage();
    } else if (currentPage === 'category.html') {
        loadCategoryPage();
    } else if (currentPage === 'search.html') {
        // Search page handles its own initialization
    } else if (currentPage === 'about.html' || currentPage === 'contact.html' || currentPage === 'privacy.html' || currentPage === 'terms.html') {
        // Static pages, no special initialization needed
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && mobileMenuToggle && !navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Load home page content
function loadHomePage() {
    const featuredGrid = document.getElementById('featuredGrid');
    const articlesGrid = document.getElementById('articlesGrid');
    const pagination = document.getElementById('pagination');
    
    if (featuredGrid) {
        displayFeaturedArticles();
    }
    
    if (articlesGrid) {
        displayArticles(1); // Start with page 1
    }
    
    if (pagination) {
        setupPagination();
    }
}

// Display featured articles
function displayFeaturedArticles() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;
    
    const featuredArticles = blogArticles.filter(article => article.featured);
    
    featuredGrid.innerHTML = featuredArticles.map(article => `
        <div class="featured-card fade-in" onclick="navigateToArticle(${article.id})">
            <img src="${article.image}" alt="${article.title}" loading="lazy">
            <div class="featured-card-content">
                <span class="category">${article.categoryName}</span>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="date">${formatDate(article.date)}</div>
            </div>
        </div>
    `).join('');
}

// Display articles with pagination
function displayArticles(page = 1) {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;
    
    const articlesPerPage = 6;
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = blogArticles.slice(startIndex, endIndex);
    
    articlesGrid.innerHTML = articlesToShow.map(article => `
        <div class="article-card fade-in" onclick="navigateToArticle(${article.id})">
            <img src="${article.image}" alt="${article.title}" loading="lazy">
            <div class="article-card-content">
                <span class="category">${article.categoryName}</span>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="date">${formatDate(article.date)}</div>
            </div>
        </div>
    `).join('');
    
    updatePagination(page);
}

// Setup pagination
function setupPagination() {
    const totalPages = Math.ceil(blogArticles.length / 6);
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    updatePagination(1);
}

// Update pagination display
function updatePagination(currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(blogArticles.length / 6);
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">Previous</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<button disabled>...</button>`;
        }
    }
    
    // Next button
    paginationHTML += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">Next</button>`;
    
    pagination.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    displayArticles(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load article detail page
function loadArticlePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    
    if (!articleId) {
        window.location.href = 'index.html';
        return;
    }
    
    const article = blogArticles.find(a => a.id === articleId);
    if (!article) {
        window.location.href = 'index.html';
        return;
    }
    
    displayArticleDetail(article);
}

// Display article detail
function displayArticleDetail(article) {
    document.title = `${article.title} - KaiZenFlowshop`;
    
    const mainContent = document.querySelector('.main-content') || document.querySelector('.article-detail');
    if (!mainContent) return;
    
    let productsHTML = '';
    if (article.products && article.products.length > 0) {
        productsHTML = `
            <div class="product-section">
                <h3>Recommended Products</h3>
                <div class="product-grid">
                    ${article.products.map(product => `
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.name}" loading="lazy">
                            <div class="product-card-content">
                                <h4>${product.name}</h4>
                                <p>${product.description}</p>
                                <div class="price">${product.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    const articleHTML = `
        <article class="article-detail">
            <div class="article-header">
                <span class="category">${article.categoryName}</span>
                <h1>${article.title}</h1>
                <div class="article-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(article.date)}</span>
                    <span><i class="fas fa-folder"></i> ${article.categoryName}</span>
                </div>
            </div>
            <img src="${article.image}" alt="${article.title}" class="article-featured-image" loading="lazy">
            <div class="article-content">
                ${article.content}
                ${productsHTML}
            </div>
        </article>
    `;
    
    if (mainContent.classList.contains('article-detail')) {
        mainContent.innerHTML = articleHTML;
    } else {
        mainContent.innerHTML = `<div class="container">${articleHTML}</div>`;
    }
}

// Load category page
function loadCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    
    if (!category) {
        window.location.href = 'index.html';
        return;
    }
    
    const categoryArticles = blogArticles.filter(article => article.category === category);
    const categoryName = categoryArticles.length > 0 ? categoryArticles[0].categoryName : category;
    
    displayCategoryArticles(categoryArticles, categoryName);
}

// Display category articles
function displayCategoryArticles(articles, categoryName) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    document.title = `${categoryName} - KaiZenFlowshop`;
    
    const articlesHTML = articles.map(article => `
        <div class="article-card fade-in" onclick="navigateToArticle(${article.id})">
            <img src="${article.image}" alt="${article.title}" loading="lazy">
            <div class="article-card-content">
                <span class="category">${article.categoryName}</span>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="date">${formatDate(article.date)}</div>
            </div>
        </div>
    `).join('');
    
    mainContent.innerHTML = `
        <div class="container">
            <div class="content-wrapper">
                <div class="articles-section">
                    <h2 class="section-title">${categoryName}</h2>
                    ${articles.length > 0 ? `
                        <div class="articles-grid">
                            ${articlesHTML}
                        </div>
                    ` : `
                        <p style="text-align: center; padding: 40px; color: var(--text-light);">
                            No articles found in this category.
                        </p>
                    `}
                </div>
            </div>
        </div>
    `;
}

// Navigate to article
function navigateToArticle(articleId) {
    window.location.href = `article.html?id=${articleId}`;
}

// Perform search - redirects to search page
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        // If empty, just go to search page
        window.location.href = `search.html`;
        return;
    }
    
    // Redirect to search page with query parameter
    window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
}

// Display search results (kept for backward compatibility, but now redirects to search page)
function displaySearchResults(results, searchTerm) {
    // This function is now deprecated - redirect to search page instead
    performSearch();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.article-card, .featured-card, .product-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

