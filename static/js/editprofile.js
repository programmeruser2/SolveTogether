// localStorage:
// EDIT_PROFILE_HAS_DRAFT 
// EDIT_PROFILE_DRAFT
// button to reset to presets
const form = document.getElementById('form');
const errText = document.getElementById('err-text');
form.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((val, key) => data[key]=val);
  try {
    api.updateDescription(data);
    location.href = '/myuser';
  } catch (err) {
    errText.innerText = 'Failed to update description';
  }
});
const descriptionArea = document.getElementById('description');
//const original = descriptionArea;
descriptionArea.addEventListener('input', e => {
  localStorage.setItem('EDIT_PROFILE_HAS_DRAFT', true);
  localStorage.setItem('EDIT_PROFILE_DRAFT', descriptionArea.value);
});
let original;
function reset() {
  if (confirm('Are you sure?')) {
    localStorage.setItem('EDIT_PROFILE_HAS_DRAFT', false);
    descriptionArea.value = original;
  }
}

(async function () {
  try {
    original = await api.getDescription('genericuser', true);
    if (localStorage.getItem('EDIT_PROFILE_HAS_DRAFT')) {
      descriptionArea.value = localStorage.getItem('EDIT_PROFILE_DRAFT');  
    } else {
      descriptionArea.value = original;
    }
  } catch (err) {
    errText.innerText = 'Failed to fetch original description';
  }
})();
