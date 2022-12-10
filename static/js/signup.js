const form = document.getElementById('form');
const errText = document.getElementById('err-text');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((val, key) => data[key]=val);
  //console.log(data);
  try {
    await api.signup(data);
  } catch (err) {
    errText.innerText = 'Failed to sign up';
  }
});