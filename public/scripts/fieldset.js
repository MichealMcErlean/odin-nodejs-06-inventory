document.addEventListener('DOMContentLoaded', () => {
  const groups = document.querySelectorAll('fieldset.required-group');

  function updateGroupValidation(fieldset) {
    const checkboxes = fieldset.querySelectorAll('input[type="checkbox"]');
    const isOneChecked = Array.from(checkboxes).some(cb => cb.checked);

    checkboxes.forEach(cb => {
      cb.required = !isOneChecked;

      if (isOneChecked) {
        cb.setCustomValidity("");
      } else {
        cb.setCustomValidity("Please select at least one option in this group.")
      }
    });
  }

  groups.forEach(fieldset => {
    updateGroupValidation(fieldset);
    fieldset.addEventListener('change', () => updateGroupValidation(fieldset));
  });

  const gamePriceField = document.querySelector('#gamePrice');

  gamePriceField.addEventListener('blur', (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      e.target.value = value.toFixed(2);
    }
  })
})