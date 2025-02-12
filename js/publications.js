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
            // 使用硬编码的数据
            this.publications = [
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
                {
                    "title": "Spike-BRGNet: Efficient and Accurate Event-based Semantic Segmentation with Boundary Region-guided Spiking Neural Networks",
                    "authors": "X Long, X Zhu, F Guo, et al.",
                    "venue": "IEEE Transactions on Circuits and Systems for Video Technology",
                    "date": "Nov 2024",
                    "type": "journal",
                    "links": {
                        "paper": "https://ieeexplore.ieee.org/abstract/document/10750266"
                    }
                },
                {
                    "title": "Accurate and Efficient Floor Localization with Scalable Spiking Graph Neural Networks",
                    "authors": "F Gu, F Guo, F Yu, et al.",
                    "venue": "Satellite Navigation",
                    "date": "March 2024",
                    "type": "journal",
                    "links": {
                        "paper": "https://satellite-navigation.springeropen.com/articles/10.1186/s43020-024-00127-8"
                    }
                },
                {
                    "title": "Efficient and Accurate Indoor/Outdoor Detection with Deep Spiking Neural Networks",
                    "authors": "F Guo, X Long, K Liu, et al.",
                    "venue": "IEEE GLOBECOM",
                    "date": "Dec 2023",
                    "type": "conference",
                    "links": {
                        "paper": "https://ieeexplore.ieee.org/abstract/document/10437685"
                    }
                },
                {
                    "title": "Efficient Event-based Semantic Segmentation with Spike-driven Lightweight Transformer-based Networks",
                    "authors": "X Zhu, F Guo, X Long, et al.",
                    "venue": "arXiv",
                    "date": "2025",
                    "type": "preprint",
                    "links": {
                        "paper": "https://arxiv.org/abs/2412.12843"
                    }
                }
            ];

            // 清除加载状态并显示数据
            this.displayPublications();
            this.setupFilters();

            // 添加成功加载的标记
            publicationList.classList.add('loaded');
        } catch (error) {
            console.error('Error displaying publications:', error);
            publicationList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Failed to display publications
                    <br>
                    <small>${error.message}</small>
                </div>`;
        }
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按钮的active类
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // 添加active类到当前按钮
                button.classList.add('active');
                
                this.currentFilter = button.dataset.filter;
                this.displayPublications();
            });
        });
    }

    renderPublicationLinks(links) {
        const linkElements = [];
        
        if (links.paper) {
            linkElements.push(`
                <a href="${links.paper}" class="publication-link" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-file-alt"></i> Paper
                </a>`);
        }
        
        if (links.code) {
            linkElements.push(`
                <a href="${links.code}" class="publication-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i> Code
                </a>`);
        }
        
        return linkElements.join('');
    }

    renderPublication(pub) {
        return `
            <div class="publication-item">
                <div class="publication-content">
                    <div class="publication-header">
                        <h3 class="publication-title">${pub.title}</h3>
                        <span class="publication-type">${pub.type}</span>
                    </div>
                    <div class="publication-meta">
                        <p class="publication-authors">${pub.authors}</p>
                        <p class="publication-venue">${pub.venue}</p>
                        <p class="publication-date">${pub.date}</p>
                    </div>
                    <div class="publication-links">
                        ${this.renderPublicationLinks(pub.links)}
                    </div>
                </div>
            </div>
        `;
    }

    displayPublications() {
        const publicationList = document.querySelector('.publication-list');
        if (!publicationList) {
            console.error('Publication list element not found');
            return;
        }

        // 清除加载状态
        publicationList.innerHTML = '';

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

        const publicationsHTML = filteredPubs
            .map(pub => this.renderPublication(pub))
            .join('');

        publicationList.innerHTML = publicationsHTML;

        // 添加动画效果
        setTimeout(() => {
            document.querySelectorAll('.publication-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100);
            });
        }, 0);
    }
}

// 初始化代码
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing PublicationDisplay');
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