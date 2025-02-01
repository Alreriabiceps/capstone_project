document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu a');
    const sections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = this.getAttribute('data-section');

            sections.forEach(section => {
                if (section.id === sectionId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});
