document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面路径
    const pagePath = window.location.pathname;
    
    // 处理根路径
    const normalizedPath = pagePath === '/' ? '/index.html' : pagePath;
    
    // 从 localStorage 获取访问计数
    let pageStats = JSON.parse(localStorage.getItem('pageStats')) || {};
    
    // 初始化当前页面的统计信息
    if (!pageStats[normalizedPath]) {
        pageStats[normalizedPath] = {
            visits: 1,  // 初始化为1而不是0
            lastVisit: new Date().toISOString()
        };
        localStorage.setItem('pageStats', JSON.stringify(pageStats));
    } else {
        // 检查是否是新的访问（与上次访问间隔超过30分钟）
        const now = new Date();
        const lastVisit = new Date(pageStats[normalizedPath].lastVisit);
        const timeDiff = now - lastVisit;
        const minsDiff = Math.floor(timeDiff / 1000 / 60);
        
        if (minsDiff > 30) {
            // 增加访问计数
            pageStats[normalizedPath].visits += 1;
            // 更新最后访问时间
            pageStats[normalizedPath].lastVisit = now.toISOString();
            // 保存回 localStorage
            localStorage.setItem('pageStats', JSON.stringify(pageStats));
        }
    }
    
    // 更新显示
    const visitCount = document.getElementById('visit-count');
    if (visitCount) {
        visitCount.textContent = pageStats[normalizedPath].visits;
    }
    
    // 添加调试信息（可选）
    console.log('Current page:', normalizedPath);
    console.log('Page stats:', pageStats[normalizedPath]);
});

// 添加清除统计的辅助函数（仅用于测试）
function clearStats() {
    localStorage.removeItem('pageStats');
    location.reload();
} 