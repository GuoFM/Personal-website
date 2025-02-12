class PublicationDisplay {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // 显示加载状态
            const publicationList = document.getElementById('publication-list');
            publicationList.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i> Loading publications...
                </div>
            `;

            // 加载数据
            const response = await fetch('../data/publications.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 渲染数据
            this.renderPublications(data.publications);
            
            // 设置过滤器事件监听
            this.setupFilterListeners(data.publications);

        } catch (error) {
            console.error('Error loading publications:', error);
            const publicationList = document.getElementById('publication-list');
            publicationList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Failed to load publications. Please try again later.
                    <br>
                    <small>Error: ${error.message}</small>
                </div>
            `;
        }
    }

    renderPublications(publications, filter = 'all') {
        const publicationList = document.getElementById('publication-list');
        const filteredPublications = filter === 'all' 
            ? publications 
            : publications.filter(pub => pub.type === filter);

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

    setupFilterListeners(publications) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 更新按钮状态
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 过滤并重新渲染
                const filterValue = button.dataset.filter;
                this.renderPublications(publications, filterValue);
            });
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new PublicationDisplay();
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