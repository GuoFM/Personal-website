document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.post-item');

    // 搜索功能
    searchInput.addEventListener('input', filterPosts);

    // 分类过滤
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            filterPosts();
        });
    });

    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        posts.forEach(post => {
            const title = post.querySelector('h3').textContent.toLowerCase();
            const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
            const category = post.dataset.category;

            const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;

            post.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
        });
    }
}); 