const form = document.getElementById('form');
const errText = document.getElementById('err-text');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((val, key) => data[key]=val);
  const parts = location.href.split('/');
  parts.pop();
  data.projectId = Number(parts.at(-1));
  //console.log(data);
  try {
    await api.newQuestion(data);
  } catch (err) {
    errText.innerText = 'Failed to create a new question';
  }
});