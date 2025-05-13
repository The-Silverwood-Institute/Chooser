const mealsUrl = 'https://api.reciba.se/meals/'
const tagsSearchEl = document.getElementById('tags-search');
const sortBoxEl = document.getElementById('sort-box');
const sortNameEl = document.getElementById('sort-name');
const defaultSearchQuery = tagsSearchEl.value;
const defaultDate = new Date(0);
const defaultSortingMethodIndex = 0;
const hashStringRegex = /^(\d+)\-(.+)$/;
const monthFilterRegex = /^([\<\>])([0-9]+)\m$/;
var inactivityTimer;
var currentSortingMethodIndex = defaultSortingMethodIndex;

fetch(mealsUrl)
  .then(resp => resp.json())
  .then(rawMeals => {
    const meals = rawMeals.map(meal => {
      meal.last_eaten = meal.last_eaten !== null ? new Date(meal.last_eaten) : null;
      return meal;
    });
    const tags = new Set(meals.flatMap(meal => meal.tags));
    const normalisedTags = new Map([...tags].map(tag => [tag.toLowerCase(), tag]))

    document.getElementById('tags-list').textContent = Array.from(tags).join(', ');

    tagsSearchEl.addEventListener('input', ev => {
      const searchQuery = ev.target.value;
      const searchTerms = searchQuery.toLowerCase().split(',').map(t => t.trim()).filter(t => t);
      const includeTags = searchTerms.map(term => normalisedTags.get(term)).filter(res => res != undefined);
      const excludeTags = searchTerms
        .filter(term => term.startsWith('-') || term.startsWith('!'))
        .map(term => term.slice(1))
        .map(term => normalisedTags.get(term))
        .filter(res => res != undefined);
      const includeTagsWithInherited = searchTerms
        .filter(term => term.startsWith('<') && !term.startsWith('<!'))
        .map(term => term.slice(1))
        .map(term => normalisedTags.get(term))
        .filter(res => res != undefined);
      const monthFilters = searchTerms
        .map(term => monthFilterRegex.exec(term))
        .filter(m => m)
        .map(match => {
        const d = new Date();
        d.setMonth(d.getMonth() - match[2]);
        return [match[1], d];
      });
      const beforeDates = monthFilters.filter(match => match[0] === '<').map(m => m[1]);
      const afterDates = monthFilters.filter(match => match[0] === '>').map(m => m[1]);
      const excludeTagsWithInherited = searchTerms
        .filter(term => term.startsWith('<!'))
        .map(term => term.slice(2))
        .map(term => {
          return normalisedTags.get(term);
        })
        .filter(res => res != undefined);

      renderFilteredMeals(includeTags, includeTagsWithInherited, excludeTags, excludeTagsWithInherited, beforeDates, afterDates);
      delayedSaveSearchQueryToHash(searchQuery);
    });

    const tagsMatchQuery = (tags, inheritedTags, includeTags, includeTagsWithInherited, excludeTags, excludeTagsWithInherited) =>
      includeTags.every(tag => tags.includes(tag))
      && !tags.some(tag => excludeTags.includes(tag))
      && includeTagsWithInherited.every(tag => tags.includes(tag) || inheritedTags.includes(tag))
      && !(tags.some(tag => excludeTagsWithInherited.includes(tag)) || inheritedTags.some(tag => excludeTagsWithInherited.includes(tag)));

    const lastEatenMatchesQuery = (lastEaten, beforeDates, afterDates) =>
      lastEaten === null || (beforeDates.every(date => lastEaten < date) && afterDates.every(date => lastEaten > date));

    const renderFilteredMeals = (includeTags, includeTagsWithInherited, excludeTags, excludeTagsWithInherited, beforeDates, afterDates) => {
      const listEl = document.createElement('ul');
      listEl.id = 'meal-list';
      listEl.classList.add('mdc-list', 'mdc-list--two-line');

      const filterMeals = includeTags.length > 0 || excludeTags.length > 0;
      document.getElementById('requires-box').hidden = includeTags.length == 0 && includeTagsWithInherited.length == 0;
      document.getElementById('requires').textContent = includeTags.concat(includeTagsWithInherited.map(tag => `<${tag}`));
      document.getElementById('excludes-box').hidden = excludeTags.length == 0 && excludeTagsWithInherited.length == 0;
      document.getElementById('excludes').textContent = excludeTags.concat(excludeTagsWithInherited.map(tag => `<!${tag}`));

      const visibleMeals = !filterMeals ? meals : meals.filter(meal =>
        tagsMatchQuery(meal.tags, meal.inherited_tags, includeTags, includeTagsWithInherited, excludeTags, excludeTagsWithInherited) && lastEatenMatchesQuery(meal.last_eaten, beforeDates, afterDates)
      );

      document.getElementById('count').textContent = visibleMeals.length;

      visibleMeals.sort(sortingMethods[currentSortingMethodIndex].sortFunction).forEach(meal => {
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

          if (meal.source.type == 'online') {
            linkEl.rel = 'nofollow';
          }

          linkEl.appendChild(titleEl);
          wrapperEl.appendChild(linkEl);
        } else {
          wrapperEl.appendChild(titleEl);
        }

        wrapperEl.appendChild(tagsEl);

        if (meal.last_eaten !== null) {
          const lastEatenEl = document.createElement('span');
          lastEatenEl.classList.add('mdc-list-item__secondary-text', 'last-eaten');
          lastEatenEl.textContent = `Last eaten: ${meal.last_eaten.toLocaleDateString()}`

          wrapperEl.appendChild(lastEatenEl);
        }

        const listItemEl = document.createElement('li');
        listItemEl.classList.add('mdc-list-item');
        listEl.appendChild(wrapperEl);
      });

      document.getElementById('meal-list').replaceWith(listEl);
    };

    if (location.hash.length > 0) {
      loadSearchQueryFromHash();
    }

    reloadPage();
  });

const getMealUrl = (source) => {
  if (source.type == 'recibase') {
    return `https://reciba.se/${source.permalink}`;
  } else if (source.type == 'google_drive') {
    return `https://drive.google.com/file/d/${source.id}/view`;
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

const delayedSaveSearchQueryToHash = (searchQuery) => {
  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => saveSearchQueryToHash(searchQuery), 500);
};

const saveSearchQueryToHash = (searchQuery) => {
  if (searchQuery != defaultSearchQuery || currentSortingMethodIndex != defaultSortingMethodIndex) {
    const hashString = `${currentSortingMethodIndex}-${searchQuery}`;
    location.hash = encodeURIComponent(hashString);
  }
};

const loadSearchQueryFromHash = () => {
  const hashString = decodeURIComponent(location.hash.slice(1));
  const match = hashString.match(hashStringRegex);

  if (match !== null) {
    currentSortingMethodIndex = parseInt(match[1], 10);
    tagsSearchEl.value = match[2];
  } else {
    tagsSearchEl.value = hashString;
  }
};

const reloadPage = () => {
  tagsSearchEl.dispatchEvent(new Event('input', {
    bubbles: true,
    cancelable: true,
  }));
  sortNameEl.textContent = sortingMethods[currentSortingMethodIndex].name;
};

const sortByLastEaten = (isAscending) => (left, right) => {
  const leftDate = left.last_eaten !== null ? left.last_eaten : defaultDate;
  const rightDate = right.last_eaten !== null ? right.last_eaten : defaultDate;

  if (isAscending) {
    return leftDate - rightDate;
  } else {
    return rightDate - leftDate;
  }
};

const sortingMethods = [
  {
    name: "Last Eaten ▲",
    sortFunction: sortByLastEaten(true)
  },
  {
    name: "Last Eaten ▼",
    sortFunction: sortByLastEaten(false)
  },
  {
    name: "Times Eaten ▲",
    sortFunction: (left, right) => left.times_eaten - right.times_eaten
  },
  {
    name: "Times Eaten ▼",
    sortFunction: (left, right) => right.times_eaten - left.times_eaten
  },
  {
    name: "Name ▼",
    sortFunction: (left, right) => left.name.localeCompare(right.name)
  },
  {
    name: "Name ▲",
    sortFunction: (left, right) => right.name.localeCompare(left.name)
  }
];

const changeSortingMethod = () => {
  currentSortingMethodIndex = (currentSortingMethodIndex + 1) % sortingMethods.length;
  reloadPage();
  delayedSaveSearchQueryToHash(tagsSearchEl.value);
};

sortBoxEl.addEventListener('click', changeSortingMethod);

setTimeout(displayNoticeIfStillLoading, 2000);

// Initialises Material Design Components
// See: https://github.com/material-components/material-components-web#javascript
Array.from(document.getElementsByClassName('mdc-text-field')).forEach(mdc.textField.MDCTextField.attachTo);
Array.from(document.getElementsByTagName('button')).forEach(mdc.iconButton.MDCIconButtonToggle.attachTo);
