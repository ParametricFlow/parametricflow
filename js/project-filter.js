document.addEventListener('DOMContentLoaded', function () {
    var chips = document.querySelectorAll('.filter-chip');
    var cards = document.querySelectorAll('.project-card');

    if (!chips.length || !cards.length) return;

    chips.forEach(function (chip) {
        chip.setAttribute('role', 'button');
        chip.setAttribute('tabindex', '0');

        function activate() {
            chips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');

            var filter = chip.dataset.filter;

            cards.forEach(function (card) {
                var match = filter === 'todos' || card.dataset.category === filter;
                card.style.display = match ? '' : 'none';
            });
        }

        chip.addEventListener('click', activate);
        chip.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });
});
