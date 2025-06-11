// 全局变量
let articles = [];
let currentView = 'home';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
});

// 显示首页
function showHome() {
    currentView = 'home';
    document.getElementById('home-content').classList.remove('hidden');
    document.getElementById('articles-content').classList.add('hidden');
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.nav-btn').classList.add('active');
}

// 显示文章列表
function showArticles() {
    currentView = 'articles';
    document.getElementById('home-content').classList.add('hidden');
    document.getElementById('articles-content').classList.remove('hidden');
    document.querySelector('.articles-list').classList.remove('hidden');
    document.getElementById('article-view').classList.add('hidden');
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.nav-btn')[1].classList.add('active');
}

// 显示文章列表（从文章详情返回）
function showArticlesList() {
    document.querySelector('.articles-list').classList.remove('hidden');
    document.getElementById('article-view').classList.add('hidden');
}

// 加载文章列表
async function loadArticles() {
    try {
        // 这里我们手动定义文章列表，您可以根据需要添加更多文章
        articles = [
            {
                filename: 'welcome.md',
                title: '欢迎来到我的博客',
                date: '2024-01-15',
                excerpt: '这是我的第一篇文章，介绍了这个网站的创建初衷和使用方法。'
            },
            {
                filename: 'markdown-guide.md',
                title: 'Markdown 写作指南',
                date: '2024-01-10',
                excerpt: '详细介绍如何使用 Markdown 语法来编写优美的文章。'
            }
        ];
        
        renderArticlesList();
    } catch (error) {
        console.error('加载文章列表失败:', error);
        document.getElementById('article-list').innerHTML = '<div class="error">加载文章列表失败，请检查网络连接。</div>';
    }
}

// 渲染文章列表
function renderArticlesList() {
    const articleList = document.getElementById('article-list');
    
    if (articles.length === 0) {
        articleList.innerHTML = '<div class="loading">暂无文章，请在 articles 文件夹中添加 Markdown 文件。</div>';
        return;
    }
    
    const articlesHTML = articles.map(article => `
        <div class="article-item" onclick="loadArticle('${article.filename}')">
            <h3 class="article-title">${article.title}</h3>
            <div class="article-date">${formatDate(article.date)}</div>
            <p class="article-excerpt">${article.excerpt}</p>
        </div>
    `).join('');
    
    articleList.innerHTML = articlesHTML;
}

// 加载并显示文章内容
async function loadArticle(filename) {
    try {
        document.querySelector('.articles-list').classList.add('hidden');
        document.getElementById('article-view').classList.remove('hidden');
        document.getElementById('article-content').innerHTML = '<div class="loading">正在加载文章...</div>';
        
        const response = await fetch(`articles/${filename}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        document.getElementById('article-content').innerHTML = html;
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('加载文章失败:', error);
        document.getElementById('article-content').innerHTML = `
            <div class="error">
                <h3>文章加载失败</h3>
                <p>无法加载文章 "${filename}"，请确保文件存在于 articles 文件夹中。</p>
            </div>
        `;
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 搜索功能（可选扩展）
function searchArticles(query) {
    if (!query.trim()) {
        renderArticlesList();
        return;
    }
    
    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase())
    );
    
    const articleList = document.getElementById('article-list');
    
    if (filteredArticles.length === 0) {
        articleList.innerHTML = '<div class="loading">没有找到匹配的文章。</div>';
        return;
    }
    
    const articlesHTML = filteredArticles.map(article => `
        <div class="article-item" onclick="loadArticle('${article.filename}')">
            <h3 class="article-title">${article.title}</h3>
            <div class="article-date">${formatDate(article.date)}</div>
            <p class="article-excerpt">${article.excerpt}</p>
        </div>
    `).join('');
    
    articleList.innerHTML = articlesHTML;
}