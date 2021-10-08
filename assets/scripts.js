const tagsSearchEl = document.getElementById('tags-search');
const tags = new Set(Object.values(meals).flat());

document.getElementById('tags-list').textContent = Array.from(tags).join(', ');

tagsSearchEl.addEventListener('input', ev => {
  const searchQuery = ev.target.value;
  const searchTerms = searchQuery.toLowerCase().split(' ').filter(t => t);

  const includeTags = searchTerms.filter(term => tags.has(term));
  const excludeTags = searchTerms
    .filter(term => term.startsWith('-') || term.startsWith('!'))
    .map(term => term.slice(1))
    .filter(term => tags.has(term));

  renderFilteredMeals(includeTags, excludeTags);
});

const tagsMatchQuery = (tags, includeTags, excludeTags) =>
  includeTags.every(tag => tags.includes(tag)) && !tags.some(tag => excludeTags.includes(tag));

const renderFilteredMeals = (includeTags, excludeTags) => {
  const listEl = document.createElement('ul');
  listEl.id = 'meal-list';
  listEl.classList.add('mdc-list', 'mdc-list--two-line');

  const filterMeals = includeTags.length > 0 || excludeTags.length > 0;
  document.getElementById('requires-box').hidden = includeTags.length == 0;
  document.getElementById('requires').textContent = includeTags.join(', ');
  document.getElementById('excludes-box').hidden = excludeTags.length == 0;
  document.getElementById('excludes').textContent = excludeTags.join(', ');

  const mealEntries = Object.entries(meals);

  const visibleMeals = !filterMeals ? mealEntries : mealEntries.filter(mealEntry =>
    tagsMatchQuery(mealEntry[1], includeTags, excludeTags)
  );

  document.getElementById('count').textContent = visibleMeals.length;

  for (const [name, tags] of visibleMeals) {
    const titleEl = document.createElement('span');
    titleEl.classList.add('mdc-list-item__primary-text');
    titleEl.textContent = name;

    const tagsEl = document.createElement('span');
    tagsEl.classList.add('mdc-list-item__secondary-text');
    tagsEl.textContent = tags.join(', ');

    const wrapperEl = document.createElement('span');
    wrapperEl.classList.add('mdc-list-item__text');
    wrapperEl.appendChild(titleEl);
    wrapperEl.appendChild(tagsEl);

    const listItemEl = document.createElement('li');
    listItemEl.classList.add('mdc-list-item');
    listEl.appendChild(wrapperEl);
  }

  document.getElementById('meal-list').replaceWith(listEl);
};

tagsSearchEl.dispatchEvent(new Event('input', {
    bubbles: true,
    cancelable: true,
}));

// Initialises Material Design Components
// See: https://github.com/material-components/material-components-web#javascript
Array.from(document.getElementsByClassName('mdc-text-field')).forEach(mdc.textField.MDCTextField.attachTo);
Array.from(document.getElementsByTagName('button')).forEach(mdc.iconButton.MDCIconButtonToggle.attachTo);
