class ConferenceSync {
    constructor() {
        this.API_URL = 'https://ccfddl.github.io/data/conference-data.json';
        this.conferences = [];
    }

    async fetchConferences() {
        try {
            const response = await fetch(this.API_URL);
            const data = await response.json();
            this.conferences = data;
            return data;
        } catch (error) {
            console.error('Error fetching conference data:', error);
            return [];
        }
    }

    createConferenceElement(conference) {
        return `
            <div class="deadline-item" data-type="${conference.rank.toLowerCase()}">
                <div class="deadline-header">
                    <h3>${conference.title}</h3>
                    <div class="deadline-badges">
                        <span class="badge ccf-${conference.rank.toLowerCase()}">${conference.rank}</span>
                        <span class="badge type">${conference.category}</span>
                    </div>
                </div>
                <div class="deadline-content">
                    <p class="deadline-date">
                        <i class="fas fa-clock"></i> Abstract: ${this.formatDate(conference.abstract_deadline)}
                    </p>
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
            day: 'numeric'
        });
    }

    async updateDeadlines() {
        const conferences = await this.fetchConferences();
        const container = document.querySelector('.deadline-grid');
        if (!container) return;

        // 按截稿日期排序
        conferences.sort((a, b) => new Date(a.submission_deadline) - new Date(b.submission_deadline));

        container.innerHTML = conferences
            .map(conf => this.createConferenceElement(conf))
            .join('');
    }

    async getCachedData() {
        const cached = localStorage.getItem('conference-data');
        const cacheTime = localStorage.getItem('conference-cache-time');
        
        if (cached && cacheTime) {
            const now = new Date().getTime();
            // 缓存时间小于1小时则使用缓存
            if (now - parseInt(cacheTime) < 3600000) {
                return JSON.parse(cached);
            }
        }
        
        const data = await this.fetchConferences();
        localStorage.setItem('conference-data', JSON.stringify(data));
        localStorage.setItem('conference-cache-time', new Date().getTime().toString());
        return data;
    }
}

// 初始化并运行
document.addEventListener('DOMContentLoaded', () => {
    const sync = new ConferenceSync();
    sync.updateDeadlines();
}); 