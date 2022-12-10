const form = document.getElementById('form');
const errText = document.getElementById('err-text');
if (form !== null) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((val, key) => data[key]=val);
    const parts = location.href.split('/');
    parts.pop();
    parts.pop();
    data.postId = Number(parts.at(-1));
    //console.log(data);
    try {
      await api.newReply(data);
    } catch (err) {
      errText.innerText = 'Failed to create a new reply';
    }
  });
}