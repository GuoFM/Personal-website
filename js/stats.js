document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面路径
    const pagePath = window.location.pathname;
    
    // 从 localStorage 获取访问计数
    let pageStats = JSON.parse(localStorage.getItem('pageStats')) || {};
    
    // 初始化或增加计数
    if (!pageStats[pagePath]) {
        pageStats[pagePath] = {
            visits: 0,
            lastVisit: new Date().toISOString()
        };
    }
    pageStats[pagePath].visits += 1;
    pageStats[pagePath].lastVisit = new Date().toISOString();
    
    // 保存回 localStorage
    localStorage.setItem('pageStats', JSON.stringify(pageStats));
    
    // 更新显示
    const visitCount = document.getElementById('visit-count');
    if (visitCount) {
        visitCount.textContent = pageStats[pagePath].visits;
    }
}); 