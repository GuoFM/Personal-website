class ConferenceSync {
    constructor() {
        // ccfddl.com 的数据 API
        this.API_URL = 'https://ccfddl.github.io/data/ccf-deadlines.json';
        this.conferences = [];
        this.lastFetchTime = null;
        this.CACHE_DURATION = 60 * 60 * 1000; // 1小时的毫秒数
    }

    async fetchConferences() {
        try {
            // 检查是否需要重新获取数据
            const now = new Date().getTime();
            if (this.lastFetchTime && (now - this.lastFetchTime < this.CACHE_DURATION)) {
                return this.conferences; // 使用缓存的数据
            }

            const response = await fetch(this.API_URL);
            const data = await response.json();
            
            // 更新缓存时间
            this.lastFetchTime = now;
            
            // 转换数据格式并过滤已过期会议
            this.conferences = data
                .map(conf => ({
                    title: conf.name,
                    rank: conf.ccf_level || 'N/A',
                    category: conf.categories?.[0] || 'Computer Science',
                    abstract_deadline: conf.abstract_deadline,
                    submission_deadline: conf.deadline,
                    conference_date: conf.date || 'TBA',
                    location: conf.place || 'TBA',
                    website: conf.website || '#',
                    link: conf.link || '#'
                }))
                .filter(conf => {
                    const deadline = new Date(conf.submission_deadline);
                    return deadline > new Date();
                })
                .sort((a, b) => new Date(a.submission_deadline) - new Date(b.submission_deadline));

            return this.conferences;
        } catch (error) {
            console.error('Error fetching conference data:', error);
            return [];
        }
    }

    createConferenceElement(conference) {
        const deadlineDate = new Date(conference.submission_deadline);
        const now = new Date();
        const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="deadline-item" data-type="ccf-${conference.rank.toLowerCase()}">
                <div class="deadline-header">
                    <h3>${conference.title}</h3>
                    <div class="deadline-badges">
                        <span class="badge ccf-${conference.rank.toLowerCase()}">${conference.rank}</span>
                        <span class="badge type">${conference.category}</span>
                        <span class="deadline-countdown">${daysLeft} days left</span>
                    </div>
                </div>
                <div class="deadline-content">
                    ${conference.abstract_deadline ? `
                        <p class="deadline-date">
                            <i class="fas fa-clock"></i> Abstract: ${this.formatDate(conference.abstract_deadline)}
                        </p>
                    ` : ''}
                    <p class="deadline-date">
                        <i class="fas fa-paper-plane"></i> Full Paper: ${this.formatDate(conference.submission_deadline)}
                    </p>
                    <p class="conference-date">
                        <i class="fas fa-calendar-alt"></i> Conference: ${conference.conference_date}
                    </p>
                    <p class="conference-location">
                        <i class="fas fa-map-marker-alt"></i> Location: ${conference.location}
                    </p>
                    <div class="deadline-links">
                        <a href="${conference.website}" class="website-link" target="_blank">
                            <i class="fas fa-globe"></i> Website
                        </a>
                        <a href="${conference.link}" class="notice-link" target="_blank">
                            <i class="fas fa-bullhorn"></i> CFP
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    }

    async updateDeadlines() {
        const container = document.querySelector('.deadline-grid');
        if (!container) return;

        try {
            const conferences = await this.fetchConferences();
            container.innerHTML = conferences
                .map(conf => this.createConferenceElement(conf))
                .join('');
        } catch (error) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Failed to load conference data. Please try again later.
                </div>
            `;
        }
    }

    startAutoUpdate() {
        // 初始更新
        this.updateDeadlines();

        // 每分钟检查一次是否需要更新
        setInterval(() => {
            const now = new Date().getTime();
            if (!this.lastFetchTime || (now - this.lastFetchTime >= this.CACHE_DURATION)) {
                this.updateDeadlines();
            }
        }, 60000); // 每分钟检查一次
    }
}

// 初始化并运行
document.addEventListener('DOMContentLoaded', () => {
    const sync = new ConferenceSync();
    sync.startAutoUpdate();
}); 