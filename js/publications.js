class PublicationManager {
    constructor() {
        this.publications = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        try {
            // 显示加载状态
            this.showLoading();

            // 加载数据
            const response = await fetch('/data/publications.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.publications = data.publications;
            
            // 初始化显示
            this.displayPublications();
            
            // 设置过滤器事件监听
            this.setupFilterListeners();
        } catch (error) {
            console.error('Error loading publications:', error);
            this.showError(error.message);
        }
    }

    showLoading() {
        const publicationList = document.getElementById('publication-list');
        if (publicationList) {
            publicationList.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i> Loading publications...
                </div>
            `;
        }
    }

    showError(message) {
        const publicationList = document.getElementById('publication-list');
        if (publicationList) {
            publicationList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Failed to load publications. Please try again later.
                    <br>
                    <small>Error: ${message}</small>
                </div>
            `;
        }
    }

    setupFilterListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentFilter = button.dataset.filter;
                this.displayPublications();
            });
        });
    }

    displayPublications() {
        const publicationList = document.getElementById('publication-list');
        if (!publicationList) return;

        const filteredPublications = this.publications.filter(pub => 
            this.currentFilter === 'all' || pub.type === this.currentFilter
        );

        if (filteredPublications.length === 0) {
            publicationList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-info-circle"></i>
                    No publications found for the selected filter.
                </div>
            `;
            return;
        }

        publicationList.innerHTML = filteredPublications.map((pub, index) => `
            <div class="publication-item card animate-in" 
                 data-type="${pub.type}" 
                 style="animation-delay: ${index * 0.1}s">
                <div class="publication-content">
                    <h3>${pub.title}</h3>
                    <p class="authors">${pub.authors.join(', ')}</p>
                    <p class="venue">
                        <strong>${pub.venue}</strong>, 
                        ${new Date(pub.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                        })}
                    </p>
                    <div class="publication-tags">
                        ${pub.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    <div class="publication-links">
                        ${pub.links.paper ? `
                            <a href="${pub.links.paper}" class="btn paper-link" target="_blank">
                                <i class="fas fa-file-pdf"></i> Paper
                            </a>
                        ` : ''}
                        ${pub.links.code ? `
                            <a href="${pub.links.code}" class="btn code-link" target="_blank">
                                <i class="fab fa-github"></i> Code
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new PublicationManager();
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