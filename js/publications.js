class PublicationDisplay {
    constructor() {
        this.publications = [];
        this.currentFilter = 'all';
    }

    async init() {
        const publicationList = document.querySelector('.publication-list');
        if (!publicationList) {
            console.error('Publication list element not found');
            return;
        }

        try {
            // 直接使用相对路径
            const jsonUrl = '../data/publications.json';
            console.log('Attempting to fetch from:', jsonUrl);
            
            const response = await fetch(jsonUrl);
            console.log('Fetch response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('Warning: Unexpected content type:', contentType);
            }

            const text = await response.text(); // 先获取原始文本
            console.log('Raw response:', text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`JSON parse error: ${e.message}`);
            }

            if (!data || !Array.isArray(data.publications)) {
                throw new Error('Invalid data format: publications array not found');
            }

            this.publications = data.publications;
            console.log('Successfully loaded publications:', this.publications);
            
            // 清除加载状态
            publicationList.innerHTML = '';
            
            this.displayPublications();
            this.setupFilters();
        } catch (error) {
            console.error('Failed to load publications:', {
                error,
                stack: error.stack,
                url: window.location.href
            });
            
            publicationList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Failed to load publications
                    <br>
                    <small>${error.message}</small>
                    <br>
                    <small>Please check the console for more details.</small>
                </div>`;
        }
    }

    setupFilters() {
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // 移除所有按钮的active类
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                // 添加active类到被点击的按钮
                e.target.classList.add('active');
                
                this.currentFilter = e.target.getAttribute('data-filter');
                this.displayPublications();
            });
        });
    }

    renderPublicationLinks(links) {
        let linksHtml = '';
        if (links.paper) {
            linksHtml += `
                <a href="${links.paper}" class="btn paper-link" target="_blank">
                    <i class="fas fa-file-pdf"></i> Paper
                </a>`;
        }
        if (links.code) {
            linksHtml += `
                <a href="${links.code}" class="btn code-link" target="_blank">
                    <i class="fab fa-github"></i> Code
                </a>`;
        }
        return linksHtml;
    }

    renderPublication(pub, index) {
        return `
            <div class="publication-item card animate-in" 
                 data-type="${pub.type}"
                 style="animation-delay: ${index * 0.1}s">
                <div class="publication-content">
                    <h3>${pub.title}</h3>
                    <p class="authors">${pub.authors}</p>
                    <p class="venue"><strong>${pub.venue}</strong>, ${pub.date}</p>
                    <div class="publication-links">
                        ${this.renderPublicationLinks(pub.links)}
                    </div>
                </div>
            </div>
        `;
    }

    displayPublications() {
        const publicationList = document.querySelector('.publication-list');
        if (!publicationList) return;

        const filteredPubs = this.currentFilter === 'all' 
            ? this.publications 
            : this.publications.filter(pub => pub.type === this.currentFilter);

        if (filteredPubs.length === 0) {
            publicationList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-info-circle"></i>
                    No publications found for this category.
                </div>`;
            return;
        }

        publicationList.innerHTML = filteredPubs
            .map((pub, index) => this.renderPublication(pub, index))
            .join('');

        // 触发动画
        setTimeout(() => {
            document.querySelectorAll('.publication-item').forEach(item => {
                item.classList.add('visible');
            });
        }, 100);
    }
}

// 确保 DOM 完全加载后再初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, current URL:', window.location.href);
    console.log('Document readyState:', document.readyState);
    
    const display = new PublicationDisplay();
    
    // 等待所有资源加载完成
    if (document.readyState === 'complete') {
        display.init();
    } else {
        window.addEventListener('load', () => display.init());
    }
});

// 添加引用功能
function showCitation(event, paperId) {
    event.preventDefault();
    const citationBox = document.getElementById(`${paperId}-citation`);
    citationBox.style.display = citationBox.style.display === 'none' ? 'block' : 'none';
}

function copyText(elementId) {
    const element = document.getElementById(elementId);
    const text = element.querySelector('pre').textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = element.querySelector('.copy-btn');
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
}