document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            publications.forEach(pub => {
                if (filter === 'all' || pub.dataset.type === filter) {
                    pub.style.display = 'flex';
                } else {
                    pub.style.display = 'none';
                }
            });
        });
    });
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