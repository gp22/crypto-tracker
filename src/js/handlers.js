function toggleButton(id) {
  const button = document.getElementById(id);

  if (button.classList.contains('btn--disabled')) {
    button.classList.remove('btn--disabled');
    button.classList.add('btn--enabled');
  } else {
    button.classList.remove('btn--enabled');
    button.classList.add('btn--disabled');
  }
}

function enableButton(id) {
  const button = document.getElementById(id);

  if (button.classList.contains('btn--disabled')) {
    button.classList.remove('btn--disabled');
    button.classList.add('btn--enabled');
  }
}

function disableButton(id) {
  const button = document.getElementById(id);

  if (button.classList.contains('btn--enabled')) {
    button.classList.remove('btn--enabled');
    button.classList.add('btn--disabled');
  }
}

module.exports = {
  toggleButton,
  enableButton,
  disableButton,
};
