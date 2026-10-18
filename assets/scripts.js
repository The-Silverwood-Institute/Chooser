const mealsUrl = 'https://api.reciba.se/meals/'
const tagsUrl = 'https://api.reciba.se/tags'
const tagsSearchEl = document.getElementById('tags-search');
const sortBoxEl = document.getElementById('sort-box');
const sortNameEl = document.getElementById('sort-name');
const tagListToggleEl = document.getElementById('tags-list-toggle');
const tagsListWrapperEl = document.getElementById('tags-list-wrapper');
const tagsListIconEl = document.getElementById('tags-list-icon');
const weightsListToggleEl = document.getElementById('weights-list-toggle');
const weightsListWrapperEl = document.getElementById('weights-list-wrapper');
const weightsListIconEl = document.getElementById('weights-list-icon');
const weightsListEl = document.getElementById('weights-list');
const defaultSearchQuery = tagsSearchEl.value;
const defaultDate = new Date(0);
const BEST_SORT_INDEX = 6;
const defaultSortingMethodIndex = BEST_SORT_INDEX;
const MS_PER_MONTH = 30.44 * 24 * 60 * 60 * 1000;
const bestScoreWeightConfig = [
  { key: 'timesEaten', label: 'Times eaten', min: 0, max: 15, default: 5 },
  { key: 'recentPenalty', label: 'Recent penalty', min: 0, max: 20, default: 8 },
  { key: 'featured', label: 'Featured', min: 0, max: 15, default: 6 },
  { key: 'newTag', label: 'New tag', min: 0, max: 10, default: 4 },
  { key: 'neverEaten', label: 'Never tried', min: 0, max: 10, default: 3 },
  { key: 'neverEatenTag', label: 'Never Eaten tag', min: 0, max: 10, default: 3 },
  { key: 'infrequent', label: 'Infrequent tag', min: 0, max: 10, default: 2 },
  { key: 'stale', label: 'Staleness bonus', min: 0, max: 15, default: 4 },
  { key: 'popularRediscovery', label: 'Popular rediscovery', min: 0, max: 10, default: 2 },
];
const bestScoreWeights = Object.fromEntries(
  bestScoreWeightConfig.map(({ key, default: defaultValue }) => [key, defaultValue])
);
const hashStringRegex = /^(\d+)\-(.+)$/;
const monthFilterRegex = /^([\<\>])([0-9]+)\m$/;
var inactivityTimer;
var currentSortingMethodIndex = defaultSortingMethodIndex;
var bestSortReferenceDate = new Date();

const formatCategoryName = (category) => category.charAt(0).toUpperCase() + category.slice(1);

const renderTagList = (tagRecords) => {
  tagsListWrapperEl.replaceChildren();

  const tagsByCategory = new Map();
  tagRecords.forEach(tag => {
    if (!tagsByCategory.has(tag.category)) {
      tagsByCategory.set(tag.category, []);
    }
    tagsByCategory.get(tag.category).push(tag);
  });

  tagsByCategory.forEach((categoryTags, category) => {
    const categoryEl = document.createElement('div');
    categoryEl.classList.add('tag-category');

    const nameEl = document.createElement('p');
    nameEl.classList.add('tag-category-name');
    nameEl.textContent = formatCategoryName(category);

    const listEl = document.createElement('ul');
    categoryTags.forEach(tag => {
      const itemEl = document.createElement('li');
      itemEl.textContent = tag.name;
      if (tag.description) {
        itemEl.title = tag.description;
      }
      listEl.appendChild(itemEl);
    });

    categoryEl.appendChild(nameEl);
    categoryEl.appendChild(listEl);
    tagsListWrapperEl.appendChild(categoryEl);
  });
};

Promise.all([
  fetch(mealsUrl).then(resp => resp.json()),
  fetch(tagsUrl).then(resp => resp.json()),
]).then(([rawMeals, tagsResponse]) => {
    const meals = rawMeals.map(meal => {
      meal.last_eaten = meal.last_eaten !== null ? new Date(meal.last_eaten) : null;
      meal.featured = meal.featured !== null ? new Date(meal.featured) : null;
      return meal;
    });
    const tagRecords = tagsResponse.tags;
    const normalisedTags = new Map(tagRecords.map(tag => [tag.name.toLowerCase(), tag.name]));
    const impliedTagsByName = new Map(tagRecords.map(tag => [tag.name, tag.implied_tags]));

    const impliedTagsFor = (mealTags) => mealTags.flatMap(tag => impliedTagsByName.get(tag) || []);

    renderTagList(tagRecords);

    tagsSearchEl.addEventListener('input', ev => {
      const searchQuery = ev.target.value;
      const searchTerms = searchQuery.toLowerCase().split(',').map(t => t.trim()).filter(t => t);
      const includeTags = searchTerms.map(term => normalisedTags.get(term)).filter(res => res != undefined);
      const excludeTags = searchTerms
        .filter(term => term.startsWith('-') || term.startsWith('!'))
        .map(term => term.slice(1))
        .map(term => normalisedTags.get(term))
        .filter(res => res != undefined);
      const includeImpliedTags = searchTerms
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
      const excludeImpliedTags = searchTerms
        .filter(term => term.startsWith('<!'))
        .map(term => term.slice(2))
        .map(term => {
          return normalisedTags.get(term);
        })
        .filter(res => res != undefined);

      renderFilteredMeals(includeTags, includeImpliedTags, excludeTags, excludeImpliedTags, beforeDates, afterDates);
      delayedSaveSearchQueryToHash(searchQuery);
    });

    const tagsMatchQuery = (tags, impliedTags, includeTags, includeImpliedTags, excludeTags, excludeImpliedTags) =>
      includeTags.every(tag => tags.includes(tag))
      && !tags.some(tag => excludeTags.includes(tag))
      && includeImpliedTags.every(tag => tags.includes(tag) || impliedTags.includes(tag))
      && !(tags.some(tag => excludeImpliedTags.includes(tag)) || impliedTags.some(tag => excludeImpliedTags.includes(tag)));

    const lastEatenMatchesQuery = (lastEaten, beforeDates, afterDates) =>
      lastEaten === null || (beforeDates.every(date => lastEaten < date) && afterDates.every(date => lastEaten > date));

    const renderFilteredMeals = (includeTags, includeImpliedTags, excludeTags, excludeImpliedTags, beforeDates, afterDates) => {
      const listEl = document.createElement('ul');
      listEl.id = 'meal-list';
      listEl.classList.add('mdc-list', 'mdc-list--two-line');

      const filterMeals = includeTags.length > 0 || includeImpliedTags.length > 0 || excludeTags.length > 0 || excludeImpliedTags.length > 0 || beforeDates.length > 0 || afterDates.length > 0;
      document.getElementById('requires-box').hidden = includeTags.length == 0 && includeImpliedTags.length == 0;
      document.getElementById('requires').textContent = includeTags.concat(includeImpliedTags.map(tag => `<${tag}`));
      document.getElementById('excludes-box').hidden = excludeTags.length == 0 && excludeImpliedTags.length == 0;
      document.getElementById('excludes').textContent = excludeTags.concat(excludeImpliedTags.map(tag => `<!${tag}`));

      const visibleMeals = !filterMeals ? meals : meals.filter(meal =>
        tagsMatchQuery(meal.tags, impliedTagsFor(meal.tags), includeTags, includeImpliedTags, excludeTags, excludeImpliedTags) && lastEatenMatchesQuery(meal.last_eaten, beforeDates, afterDates)
      );

      document.getElementById('count').textContent = visibleMeals.length;

      bestSortReferenceDate = new Date();
      const showBestScore = currentSortingMethodIndex === BEST_SORT_INDEX;

      visibleMeals.sort(sortingMethods[currentSortingMethodIndex].sortFunction).forEach(meal => {
        const titleEl = document.createElement('span');
        titleEl.classList.add('mdc-list-item__primary-text');
        titleEl.textContent = meal.name;

        const tagsEl = document.createElement('span');
        tagsEl.classList.add('mdc-list-item__secondary-text');
        tagsEl.textContent = meal.tags.join(', ');

        const wrapperEl = document.createElement('span');
        wrapperEl.classList.add('mdc-list-item__text');

        const iconEls = getMealIcons(meal);
        iconEls.forEach(iconEl => titleEl.appendChild(iconEl));

        const mealSourceUrl = meal.source ? getMealUrl(meal.source) : null;

        if (mealSourceUrl) {
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

        if (showBestScore) {
          const scoreEl = document.createElement('span');
          scoreEl.classList.add('mdc-list-item__secondary-text', 'meal-score');
          scoreEl.textContent = `Score: ${bestScore(meal, bestSortReferenceDate).toFixed(1)}`;
          wrapperEl.appendChild(scoreEl);
        }

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

const getMealIcons = (meal) => {
  let icons = [];

  if (meal.source !== null) {
    if (meal.source.type === 'recibase') {
      icons.push('fa-registered');
    } else if (meal.source.type === 'online') {
      icons.push('fa-globe');
    } else if (meal.source.type === 'google_drive') {
      icons.push('fa-google-drive');
    }
  }

  if (meal.dated_notes.length > 0) {
    icons.push('fa-comments');
  }
  
  return icons.map(iconName => {
    const i = document.createElement('img');
    i.src = `/assets/${iconName}.svg`;
    i.classList.add("icon");
    i.setAttribute('icon-name', iconName);
    if (iconName == 'fa-comments') {
      i.addEventListener('click', event => displayMealComments(event, meal.dated_notes));
    }
    return i;
  });
};

const displayMealComments = (event, datedNotes) => {
  if (!event.target.classList.contains('icon')) {
    return;
  }

  event.preventDefault();

  const parentEl = event.target.closest(".mdc-list-item__text")
  if (!parentEl.classList.contains('comments-expanded')){
    datedNotes.forEach(datedNote => {
      const noteEl = document.createElement('span');
      noteEl.classList.add('mdc-list-item__secondary-text');
      noteEl.textContent = `${datedNote.date}: ${datedNote.note}`;
      parentEl.appendChild(noteEl);
    });
    parentEl.classList.add('comments-expanded');
  }
};

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

const monthsBetween = (from, to) => (to - from) / MS_PER_MONTH;

const linearDecay = (elapsed, windowMonths) =>
  elapsed >= windowMonths ? 0 : 1 - elapsed / windowMonths;

const bestScore = (meal, now = new Date()) => {
  if (meal.tags.includes('Not a Meal')) {
    return -Infinity;
  }

  let score = Math.log1p(meal.times_eaten) * bestScoreWeights.timesEaten;

  if (meal.featured !== null) {
    const monthsFeatured = monthsBetween(meal.featured, now);
    score += bestScoreWeights.featured * linearDecay(monthsFeatured, 6);
  }

  if (meal.last_eaten !== null) {
    const monthsSince = monthsBetween(meal.last_eaten, now);
    score -= bestScoreWeights.recentPenalty * linearDecay(monthsSince, 4);
    if (monthsSince > 6) {
      score += bestScoreWeights.stale * Math.min((monthsSince - 6) / 6, 1);
    }
    if (meal.tags.includes('Popular') && monthsSince > 3) {
      score += bestScoreWeights.popularRediscovery;
    }
  } else {
    score += bestScoreWeights.neverEaten;
  }

  if (meal.tags.includes('New')) {
    score += bestScoreWeights.newTag;
  }
  if (meal.tags.includes('Never Eaten')) {
    score += bestScoreWeights.neverEatenTag;
  }
  if (meal.tags.includes('Infrequent')) {
    score += bestScoreWeights.infrequent;
  }

  return score;
};

const sortByBest = (left, right) => {
  const scoreDiff = bestScore(right, bestSortReferenceDate) - bestScore(left, bestSortReferenceDate);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  const leftDate = left.last_eaten !== null ? left.last_eaten : defaultDate;
  const rightDate = right.last_eaten !== null ? right.last_eaten : defaultDate;
  const dateDiff = leftDate - rightDate;
  if (dateDiff !== 0) {
    return dateDiff;
  }

  return left.name.localeCompare(right.name);
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
  },
  {
    name: "Best",
    sortFunction: sortByBest
  }
];

const changeSortingMethod = () => {
  currentSortingMethodIndex = (currentSortingMethodIndex + 1) % sortingMethods.length;
  reloadPage();
  delayedSaveSearchQueryToHash(tagsSearchEl.value);
};

sortBoxEl.addEventListener('click', changeSortingMethod);

setTimeout(displayNoticeIfStillLoading, 2000);

tagListToggleEl.addEventListener('click', () => {
  tagsListWrapperEl.hidden = !tagsListWrapperEl.hidden;

  tagsListIconEl.textContent = tagsListWrapperEl.hidden ? '►' : '▼';
});

const initWeightsPanel = () => {
  bestScoreWeightConfig.forEach(({ key, label, min, max }) => {
    const rowEl = document.createElement('div');
    rowEl.classList.add('weight-row');

    const labelEl = document.createElement('label');
    labelEl.htmlFor = `weight-${key}`;
    labelEl.textContent = label;

    const sliderEl = document.createElement('input');
    sliderEl.type = 'range';
    sliderEl.id = `weight-${key}`;
    sliderEl.min = min;
    sliderEl.max = max;
    sliderEl.step = 1;
    sliderEl.value = bestScoreWeights[key];

    const valueEl = document.createElement('span');
    valueEl.classList.add('weight-value');
    valueEl.textContent = bestScoreWeights[key];

    sliderEl.addEventListener('input', () => {
      bestScoreWeights[key] = parseInt(sliderEl.value, 10);
      valueEl.textContent = bestScoreWeights[key];
      reloadPage();
    });

    rowEl.appendChild(labelEl);
    rowEl.appendChild(sliderEl);
    rowEl.appendChild(valueEl);
    weightsListEl.appendChild(rowEl);
  });
};

weightsListToggleEl.addEventListener('click', () => {
  weightsListWrapperEl.hidden = !weightsListWrapperEl.hidden;

  weightsListIconEl.textContent = weightsListWrapperEl.hidden ? '►' : '▼';
});

initWeightsPanel();

// Initialises Material Design Components
// See: https://github.com/material-components/material-components-web#javascript
Array.from(document.getElementsByClassName('mdc-text-field')).forEach(mdc.textField.MDCTextField.attachTo);
Array.from(document.getElementsByTagName('button')).forEach(mdc.iconButton.MDCIconButtonToggle.attachTo);
