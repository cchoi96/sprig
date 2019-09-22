const minusButtons = document.getElementsByClassName('minus');
const plusButtons = document.getElementsByClassName('plus');
const inputFields = document.getElementsByClassName('menu-item-input');

for (let i = 0; i < minusButtons.length; i++) {
  minusButtons[i].addEventListener('click', event => {
    event.preventDefault();
    const currentValue = Number(inputFields[i].value) || 0;
    inputFields[i].value = currentValue - 1;
    minusButtons[i].disabled = inputFields[i].value <= 0 ? true : false;
  });
}

for (let i = 0; i < plusButtons.length; i++) {
  plusButtons[i].addEventListener('click', event => {
    event.preventDefault();
    const currentValue = Number(inputFields[i].value) || 0;
    inputFields[i].value = currentValue + 1;
    if (currentValue > -1) {
      minusButtons[i].disabled = false;
    }
  });
}