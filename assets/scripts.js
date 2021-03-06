const mealsUrl = 'https://api.reciba.se/meals/'

fetch(mealsUrl)
  .then(resp => resp.json())
  .then(meals => {
    const tagsSearchEl = document.getElementById('tags-search');
    const tags = new Set(meals.flatMap(meal => meal.tags));
    const normalisedTags = new Map([...tags].map(tag => [tag.toLowerCase(), tag]))

    document.getElementById('tags-list').textContent = Array.from(tags).join(', ');

    tagsSearchEl.addEventListener('input', ev => {
      const searchQuery = ev.target.value;
      const searchTerms = searchQuery.toLowerCase().split(', ').filter(t => t);
      const includeTags = searchTerms.map(term => normalisedTags.get(term)).filter(res => res != undefined);
      const excludeTags = searchTerms
        .filter(term => term.startsWith('-') || term.startsWith('!'))
        .map(term => term.slice(1))
        .map(term => normalisedTags.get(term))
        .filter(res => res != undefined)
        .concat(["Not a Meal", "Pudding", "Lunch"]);

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

      const visibleMeals = !filterMeals ? meals : meals.filter(meal =>
        tagsMatchQuery(meal.tags, includeTags, excludeTags)
      );

      document.getElementById('count').textContent = visibleMeals.length;

      visibleMeals.forEach(meal => {
        const titleEl = document.createElement('span');
        titleEl.classList.add('mdc-list-item__primary-text');
        titleEl.textContent = meal.name;

        const tagsEl = document.createElement('span');
        tagsEl.classList.add('mdc-list-item__secondary-text');
        tagsEl.textContent = meal.tags.join(', ');

        const wrapperEl = document.createElement('span');
        wrapperEl.classList.add('mdc-list-item__text');

        const mealSourceUrl = meal.source ? getMealUrl(meal.source) : null;

        if (mealSourceUrl) {
          titleEl.textContent += ` [${meal.source.type[0].toUpperCase()}]`
          const linkEl = document.createElement('a');
          linkEl.href = mealSourceUrl;

          if (meal.source.type = 'online') {
            linkEl.rel = 'nofollow';
          }

          linkEl.appendChild(titleEl);
          wrapperEl.appendChild(linkEl);
        } else {
          wrapperEl.appendChild(titleEl);
        }

        wrapperEl.appendChild(tagsEl);

        const listItemEl = document.createElement('li');
        listItemEl.classList.add('mdc-list-item');
        listEl.appendChild(wrapperEl);
      });

      document.getElementById('meal-list').replaceWith(listEl);
    };

    tagsSearchEl.dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true,
    }));
});

const getMealUrl = (source) => {
  if (source.type == 'recibase') {
    return `https://reciba.se/${source.permalink}`;
  } else if (source.type == 'google_drive') {
    return `https://docs.google.com/document/d/${source.id}/`;
  } else if (source.type == 'online') {
    return source.url;
  } else {
    console.warn(`Unknown meal source type "${source.type}"`);
    return null;
  }
}

const displayNoticeIfStillLoading = () => {
  const stillLoadingIndicatorEl = document.getElementById('still-loading');

  if (stillLoadingIndicatorEl) {
    stillLoadingIndicatorEl.hidden = false;
  }
}

setTimeout(displayNoticeIfStillLoading, 2000);

// Initialises Material Design Components
// See: https://github.com/material-components/material-components-web#javascript
Array.from(document.getElementsByClassName('mdc-text-field')).forEach(mdc.textField.MDCTextField.attachTo);
Array.from(document.getElementsByTagName('button')).forEach(mdc.iconButton.MDCIconButtonToggle.attachTo);
