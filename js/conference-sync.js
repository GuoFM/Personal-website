class ConferenceSync {
    constructor() {
        // ccfddl.com 的数据 API
        this.API_URL = '/data/conferences.json';
        this.conferences = [];
        this.lastFetchTime = null;
        this.CACHE_DURATION = 60 * 60 * 1000; // 1小时的毫秒数
    }

    async fetchConferences() {
        try {
            // 检查是否需要重新获取数据
            const now = new Date().getTime();
            if (this.lastFetchTime && (now - this.lastFetchTime < this.CACHE_DURATION)) {
                return this.conferences;
            }

            const response = await fetch(this.API_URL);
            const data = await response.json();
            
            // 更新缓存时间
            this.lastFetchTime = now;
            
            // 确保日期格式正确并过滤过期会议
            this.conferences = data.filter(conf => {
                try {
                    const deadline = new Date(conf.submission_deadline);
                    return deadline > new Date();
                } catch (e) {
                    console.error(`Invalid date format for conference: ${conf.title}`);
                    return false;
                }
            }).sort((a, b) => new Date(a.submission_deadline) - new Date(b.submission_deadline));

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
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'TBA';
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
        } catch (e) {
            console.error(`Error formatting date: ${dateString}`);
            return 'TBA';
        }
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

async function loadConferences() {
    try {
        const response = await fetch('/data/conferences.json');
        if (!response.ok) {
            throw new Error('Failed to fetch conference data');
        }
        const conferences = await response.json();
        displayConferences(conferences);
    } catch (error) {
        console.error('Error loading conferences:', error);
        document.getElementById('conference-list').innerHTML = 
            '<p class="error">Failed to load conference data. Please try again later.</p>';
    }
}

function displayConferences(conferences) {
    const container = document.getElementById('conference-list');
    if (!conferences || conferences.length === 0) {
        container.innerHTML = '<p>No upcoming conference deadlines found.</p>';
        return;
    }

    // 按 CCF 等级分组
    const conferencesByRank = {
        'A': conferences.filter(c => c.rank === 'A'),
        'B': conferences.filter(c => c.rank === 'B'),
        'C': conferences.filter(c => c.rank === 'C')
    };

    container.innerHTML = ''; // 清空现有内容

    // 创建会议列表
    Object.entries(conferencesByRank).forEach(([rank, rankConferences]) => {
        if (rankConferences.length > 0) {
            const section = document.createElement('div');
            section.className = `ccf-${rank.toLowerCase()}-conferences`;
            section.style.display = 'none'; // 默认隐藏，由过滤器控制显示

            rankConferences.forEach(conf => {
                const confElement = createConferenceElement(conf);
                section.appendChild(confElement);
            });

            container.appendChild(section);
        }
    });

    // 初始化过滤器
    initializeFilters();
}

function createConferenceElement(conf) {
    const element = document.createElement('div');
    element.className = 'conference-item';
    
    const deadline = new Date(conf.submission_deadline.split(' ')[0]);
    const daysUntil = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    
    element.innerHTML = `
        <div class="conference-header">
            <h3>${conf.title} ${conf.year}</h3>
            <span class="ccf-rank">CCF-${conf.rank}</span>
        </div>
        <div class="conference-info">
            <p class="description">${conf.description}</p>
            <p class="deadline">Submission Deadline: ${conf.submission_deadline}</p>
            ${conf.abstract_deadline ? `<p class="abstract-deadline">Abstract Deadline: ${conf.abstract_deadline}</p>` : ''}
            <p class="countdown">${daysUntil} days until deadline</p>
            <p class="location">${conf.location}</p>
            <a href="${conf.website}" target="_blank" class="conference-link">Conference Website</a>
        </div>
    `;
    
    return element;
}

function initializeFilters() {
    // 获取所有过滤器按钮
    const filterButtons = document.querySelectorAll('.filter-button');
    
    // 为每个按钮添加点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const rank = button.getAttribute('data-rank');
            
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 显示/隐藏相应的会议
            document.querySelectorAll('.ccf-a-conferences, .ccf-b-conferences, .ccf-c-conferences')
                .forEach(section => {
                    section.style.display = 'none';
                });
            
            if (rank === 'all') {
                document.querySelectorAll('.ccf-a-conferences, .ccf-b-conferences, .ccf-c-conferences')
                    .forEach(section => {
                        section.style.display = 'block';
                    });
            } else {
                document.querySelector(`.ccf-${rank}-conferences`).style.display = 'block';
            }
        });
    });
    
    // 默认显示所有会议
    document.querySelector('[data-rank="all"]').click();
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', loadConferences); 