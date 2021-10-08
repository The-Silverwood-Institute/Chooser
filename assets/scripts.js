const listEl = document.createElement('ul');
listEl.classList.add('mdc-list', 'mdc-list--two-line');

for (const [name, tags] of Object.entries(meals)) {
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

document.getElementById('recipe-list').replaceWith(listEl);

// Initialises Material Design Components
// See: https://github.com/material-components/material-components-web#javascript
Array.from(document.getElementsByClassName('mdc-text-field')).forEach(mdc.textField.MDCTextField.attachTo);
Array.from(document.getElementsByTagName('button')).forEach(mdc.iconButton.MDCIconButtonToggle.attachTo);
