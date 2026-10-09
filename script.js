// Shared JavaScript. Each feature checks for its page before attaching events.
const searchInput = document.querySelector('#food-search');
const filterButtons = document.querySelectorAll('[data-filter]');
const foodCards = Array.from(document.querySelectorAll('#food-list .food-card'));
const budgetInput = document.querySelector('#max-budget');
const sortInput = document.querySelector('#food-sort');
let selectedCategory = 'all';

function filterFoodSpots() {
  const searchText = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  foodCards.forEach(function (card) {
    const matchesSearch = card.textContent.toLowerCase().includes(searchText);
    const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
    const matchesBudget = budgetInput.value === 'all' || Number(card.dataset.price) <= Number(budgetInput.value);
    card.hidden = !(matchesSearch && matchesCategory && matchesBudget);
    if (!card.hidden) visibleCount++;
  });
  filterButtons.forEach(function (button) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === selectedCategory));
  });
  const sortedCards = foodCards.slice().sort(function (a, b) {
    if (sortInput.value === 'price') return Number(a.dataset.price) - Number(b.dataset.price);
    if (sortInput.value === 'name') return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
    return Number(a.dataset.order) - Number(b.dataset.order);
  });
  sortedCards.forEach(function (card) { document.querySelector('#food-list').appendChild(card); });
  document.querySelector('#result-count').textContent = visibleCount + ' of ' + foodCards.length + ' sample spots shown.';
  document.querySelector('#no-results').hidden = visibleCount !== 0;
}

if (searchInput) {
  const categoryParameter = new URLSearchParams(window.location.search).get('category');
  if (Array.from(filterButtons).some(function (button) { return button.dataset.filter === categoryParameter; })) {
    selectedCategory = categoryParameter;
  }
  searchInput.addEventListener('input', filterFoodSpots);
  budgetInput.addEventListener('change', filterFoodSpots);
  sortInput.addEventListener('change', filterFoodSpots);
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedCategory = button.dataset.filter;
      filterFoodSpots();
    });
  });
  document.querySelector('#reset-filters').addEventListener('click', function () {
    searchInput.value = '';
    budgetInput.value = 'all';
    sortInput.value = 'default';
    selectedCategory = 'all';
    filterFoodSpots();
  });
  filterFoodSpots();
  // Open the listing when arriving from a Home details link.
  const target = foodCards.find(function (card) { return '#' + card.id === window.location.hash; });
  if (target) target.querySelector('details').open = true;
}

// Suggestions remain local; download is an explicit user action.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const downloadButton = document.querySelector('#download-suggestion');
  let suggestion = '';
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const name = document.querySelector('#name').value.trim();
    const message = document.querySelector('#message').value.trim();
    if (!name || message.length < 10) {
      document.querySelector('#form-status').textContent = 'Enter your name and a message with at least 10 non-blank characters.';
      return;
    }
    suggestion = 'CampusBites suggestion\nName: ' + name + '\nEmail: ' + document.querySelector('#email').value.trim() + '\n\n' + message;
    downloadButton.hidden = false;
    document.querySelector('#form-status').textContent = 'Your suggestion is ready to download. It has not been sent.';
  });
  contactForm.addEventListener('input', function () {
    suggestion = '';
    downloadButton.hidden = true;
    document.querySelector('#form-status').textContent = '';
  });
  downloadButton.addEventListener('click', function () {
    if (!suggestion) return;
    const url = URL.createObjectURL(new Blob([suggestion], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campusbites-suggestion.txt';
    link.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });
}

// Personal notes use localStorage only, with a usable fallback if storage is blocked.
const reviewForm = document.querySelector('#review-form');
if (reviewForm) {
  const storageKey = 'campusbites-personal-notes-v1';
  let notes = [];
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) notes = stored.filter(function (note) {
      return note && typeof note.spot === 'string' && typeof note.text === 'string' &&
        Number.isInteger(note.rating) && note.rating >= 1 && note.rating <= 5;
    }).slice(0, 20);
  } catch (error) { /* Start with an empty list if storage is unavailable or invalid. */ }
  const status = document.querySelector('#review-status');
  function renderNotes() {
    const list = document.querySelector('#personal-reviews');
    list.replaceChildren();
    notes.forEach(function (note) {
      const article = document.createElement('article');
      article.className = 'personal-note';
      const heading = document.createElement('h3');
      heading.textContent = note.spot + ' — ' + note.rating + '/5';
      const text = document.createElement('p');
      text.textContent = note.text; // Never interpret user input as HTML.
      article.append(heading, text);
      list.appendChild(article);
    });
    document.querySelector('#clear-reviews').hidden = notes.length === 0;
  }
  reviewForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!reviewForm.reportValidity()) return;
    const text = document.querySelector('#review-text').value.trim();
    if (text.length < 10) { status.textContent = 'Write at least 10 non-blank characters.'; return; }
    notes.unshift({ spot: document.querySelector('#review-spot').value, rating: Number(document.querySelector('#review-rating').value), text: text });
    notes = notes.slice(0, 20);
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
      status.textContent = 'Saved in this browser only. Up to 20 recent notes are kept.';
    } catch (error) { status.textContent = 'Added for this visit only. Browser storage is unavailable.'; }
    reviewForm.reset();
    renderNotes();
  });
  document.querySelector('#clear-reviews').addEventListener('click', function () {
    try { localStorage.removeItem(storageKey); }
    catch (error) { status.textContent = 'Browser storage is unavailable. Visible notes cleared for this visit.'; notes = []; renderNotes(); return; }
    notes = [];
    status.textContent = 'Your personal notes have been cleared.';
    renderNotes();
  });
  renderNotes();
}
