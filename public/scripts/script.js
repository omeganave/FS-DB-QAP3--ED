document.addEventListener('DOMContentLoaded', function() {
    const savedSortOption = localStorage.getItem('sortOption');

    const sortDropdown = document.getElementById('sort');
    if (savedSortOption) {
        sortDropdown.value = savedSortOption;
        if (window.location.pathname === '/' && window.location.search !== `?sort=${savedSortOption}`) {
            handleSortChange(savedSortOption);
        }
    }

    sortDropdown.addEventListener('change', function() {
        handleSortChange(this.value);
    })
});
function handleSortChange(value) {
    localStorage.setItem('sortOption', value);
    if (value === '') {
        localStorage.removeItem('sortOption');
    }
    window.location.href = `/?sort=${value}`;
};