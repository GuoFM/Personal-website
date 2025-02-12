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
            // 使用基于域名的绝对路径
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/data/publications.json`);
            console.log('Fetching from:', `${baseUrl}/data/publications.json`);

            if (!response.ok) {
                throw new Error(`Failed to load publications (${response.status})`);
            }

            const data = await response.json();
            console.log('Loaded data:', data);

            if (!data || !data.publications) {
                throw new Error('Invalid data format');
            }

            this.publications = data.publications;
            console.log('Publications loaded:', this.publications);
            this.displayPublications();
            this.setupFilters();
        } catch (error) {
            console.error('Error loading publications:', error);
            publicationList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Failed to load publications. Please try again later.
                    <br>
                    <small>Error: ${error.message}</small>
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

// 初始化代码
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing with base URL:', window.location.origin);
    const display = new PublicationDisplay();
    display.init();
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