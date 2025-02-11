class ConferenceDisplay {
    constructor() {
        this.conferences = [];
        this.filteredConferences = [];
        this.currentRank = 'all';
        this.selectedCategories = new Set(['AI', 'NW', 'SC', 'SE', 'DB', 'CT', 'CG', 'HI', 'MX']);
        this.init();
    }

    async init() {
        const listElement = document.getElementById('conference-list');
        try {
            listElement.innerHTML = '<p class="loading">Loading conference deadlines...</p>';
            await this.loadConferences();
            this.setupEventListeners();
            this.filterAndDisplayConferences();
        } catch (error) {
            console.error('Failed to initialize conference display:', error);
            listElement.innerHTML = '<p class="error">Failed to load conference data. Please try again later.</p>';
        }
    }

    async loadConferences() {
        try {
            const response = await fetch('/data/conferences.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.conferences = data.conferences || [];
            
            // 更新最后更新时间
            const lastUpdateElem = document.getElementById('last-update');
            if (lastUpdateElem) {
                const date = new Date(data.last_updated);
                lastUpdateElem.textContent = date.toLocaleDateString();
            }
        } catch (error) {
            throw new Error('Failed to fetch conference data: ' + error.message);
        }
    }

    setupEventListeners() {
        // Rank filters
        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-button').forEach(btn => 
                    btn.classList.remove('active'));
                button.classList.add('active');
                this.currentRank = button.dataset.rank;
                this.filterAndDisplayConferences();
            });
        });

        // Category filters
        document.querySelectorAll('.category-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const category = checkbox.dataset.category;
                if (checkbox.checked) {
                    this.selectedCategories.add(category);
                } else {
                    this.selectedCategories.delete(category);
                }
                this.filterAndDisplayConferences();
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
            container.innerHTML = '<p>No conferences found matching the current filter.</p>';
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
                            (${this.getTimeUntil(conf.submission_deadline)})
                            ${conf.comment ? `- ${conf.comment}` : ''}
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