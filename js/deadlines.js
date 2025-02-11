class ConferenceDisplay {
    constructor() {
        this.conferences = [];
        this.filteredConferences = [];
        this.currentRank = 'all';
        this.selectedCategories = new Set(['AI', 'NW', 'SC', 'SE', 'DB', 'CT', 'CG', 'HI', 'MX', 'DS']);
        this.init();
    }

    async init() {
        const listElement = document.getElementById('conference-list');
        try {
            listElement.innerHTML = '<div class="loading-spinner"></div>';
            await this.loadConferences();
            this.setupEventListeners();
            this.filterAndDisplayConferences();
        } catch (error) {
            console.error('Failed to initialize:', error);
            listElement.innerHTML = '<p class="error-message">Failed to load conference data. Please try again later.</p>';
        }
    }

    async loadConferences() {
        try {
            const response = await fetch('/data/conferences.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (!data || !Array.isArray(data.conferences)) {
                throw new Error('Invalid data format');
            }
            
            this.conferences = data.conferences;
            console.log(`Loaded ${this.conferences.length} conferences`);
            
            // 更新最后更新时间
            const lastUpdateElem = document.getElementById('last-update');
            if (lastUpdateElem && data.last_updated) {
                const date = new Date(data.last_updated);
                lastUpdateElem.textContent = date.toLocaleDateString();
            }
        } catch (error) {
            console.error('Failed to fetch conference data:', error);
            const listElement = document.getElementById('conference-list');
            listElement.innerHTML = `
                <div class="error-message">
                    <p>Failed to load conference data. Error: ${error.message}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `;
            throw error;
        }
    }

    setupEventListeners() {
        // Rank filters
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // 防止页面跳转
                document.querySelectorAll('.filter-btn').forEach(btn => 
                    btn.classList.remove('active'));
                button.classList.add('active');
                this.currentRank = button.dataset.rank;
                this.filterAndDisplayConferences();
            });
        });

        // Category filters
        document.querySelectorAll('.checkbox-label input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const category = checkbox.dataset.category;
                if (checkbox.checked) {
                    this.selectedCategories.add(category);
                } else {
                    this.selectedCategories.delete(category);
                }
                this.filterAndDisplayConferences();
                console.log('Selected categories:', this.selectedCategories); // 调试信息
            });
        });
    }

    filterAndDisplayConferences() {
        this.filteredConferences = this.conferences.filter(conf => {
            const rankMatch = this.currentRank === 'all' || conf.rank === this.currentRank;
            const categoryMatch = this.selectedCategories.has(conf.category);
            return rankMatch && categoryMatch;
        });

        this.sortConferences();
        this.displayConferences();
    }

    sortConferences() {
        this.filteredConferences.sort((a, b) => {
            const dateA = new Date(a.submission_deadline.split(' ')[0]);
            const dateB = new Date(b.submission_deadline.split(' ')[0]);
            return dateA - dateB;
        });
    }

    getTimeUntil(deadline) {
        const deadlineDate = new Date(deadline.split(' ')[0]);
        const now = new Date();
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Deadline passed';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `${diffDays} days`;
    }

    displayConferences() {
        const container = document.getElementById('conference-list');
        if (!this.filteredConferences.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No conferences found matching the current filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredConferences.map(conf => `
            <div class="conference-card">
                <div class="conference-header">
                    <h3 class="conference-title">
                        <a href="${conf.website}" target="_blank" rel="noopener">
                            ${conf.title} ${conf.year}
                        </a>
                    </h3>
                    <span class="conference-rank rank-${conf.rank}">CCF-${conf.rank}</span>
                </div>
                <p class="conference-description">${conf.description}</p>
                <div class="conference-info">
                    <div class="info-item">
                        <span class="info-label">Deadline</span>
                        <span class="info-value ${this.getTimeUntil(conf.submission_deadline) === 'Today' ? 'deadline-soon' : ''}">
                            ${conf.submission_deadline}
                            <span class="deadline-countdown">${this.getTimeUntil(conf.submission_deadline)}</span>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Conference Date</span>
                        <span class="info-value">${conf.conference_date}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Location</span>
                        <span class="info-value">${conf.location}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ConferenceDisplay();
}); 