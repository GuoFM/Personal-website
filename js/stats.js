document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面路径
    const pagePath = window.location.pathname;
    
    // 从 localStorage 获取访问计数
    let pageStats = JSON.parse(localStorage.getItem('pageStats')) || {};
    
    // 初始化当前页面的统计信息
    if (!pageStats[pagePath]) {
        pageStats[pagePath] = {
            visits: 0,
            lastVisit: new Date().toISOString()
        };
    }
    
    // 检查是否是新的访问（与上次访问间隔超过30分钟）
    const now = new Date();
    const lastVisit = new Date(pageStats[pagePath].lastVisit);
    const timeDiff = now - lastVisit;
    const minsDiff = Math.floor(timeDiff / 1000 / 60);
    
    if (minsDiff > 30) {
        // 增加访问计数
        pageStats[pagePath].visits += 1;
        // 更新最后访问时间
        pageStats[pagePath].lastVisit = now.toISOString();
        // 保存回 localStorage
        localStorage.setItem('pageStats', JSON.stringify(pageStats));
    }
    
    // 更新显示
    const visitCount = document.getElementById('visit-count');
    if (visitCount) {
        if (pageStats[pagePath].visits === 0) {
            visitCount.textContent = '1'; // 首次访问
        } else {
            visitCount.textContent = pageStats[pagePath].visits;
        }
    }
}); 