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
            // 添加更多调试信息
            console.log('Starting to fetch publications...');
            
            // 尝试不同的路径
            const paths = [
                '/data/publications.json',
                '../data/publications.json',
                './data/publications.json',
                'data/publications.json'
            ];

            let response = null;
            let error = null;

            for (const path of paths) {
                try {
                    console.log(`Trying to fetch from: ${path}`);
                    response = await fetch(path);
                    if (response.ok) {
                        console.log(`Successfully fetched from: ${path}`);
                        break;
                    }
                } catch (e) {
                    error = e;
                    console.log(`Failed to fetch from ${path}:`, e.message);
                }
            }

            if (!response || !response.ok) {
                throw new Error(`Failed to load publications. ${error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('Loaded data:', data);

            // 使用硬编码的数据作为后备
            this.publications = data.publications || [
                {
                    "title": "Event-driven Tactile Sensing With Dense Spiking Graph Neural Networks",
                    "authors": "F Guo, F Yu, M Li, et al.",
                    "venue": "IEEE Transactions on Instrumentation and Measurement",
                    "date": "Jan 2025",
                    "type": "journal",
                    "links": {
                        "paper": "https://www.researchgate.net/publication/387190722_Event-driven_Tactile_Sensing_With_Dense_Spiking_Graph_Neural_Networks",
                        "code": "https://github.com/cqu-uisc/deepTactile"
                    }
                },
                // ... 其他论文数据 ...
            ];

            console.log('Publications loaded:', this.publications);
            this.displayPublications();
            this.setupFilters();
        } catch (error) {
            console.error('Error loading publications:', error);
            publicationList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    ${error.message}
                    <br>
                    <small>Path: ${window.location.pathname}</small>
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
    console.log('DOM Content Loaded, pathname:', window.location.pathname);
    const display = new PublicationDisplay();
    
    // 确保元素都加载完成
    if (document.readyState === 'complete') {
        console.log('Document already complete, initializing...');
        display.init();
    } else {
        console.log('Waiting for document to complete...');
        window.addEventListener('load', () => {
            console.log('Window loaded, initializing...');
            display.init();
        });
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