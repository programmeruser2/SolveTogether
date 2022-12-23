const form = document.getElementById('form');
const errText = document.getElementById('err-text');
const parts = location.href.split('/');
//parts.pop();
//parts.pop();
const id = Number(parts.at(-1) == '' ? parts.at(-2) : parts.at(-1));
if (form !== null) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((val, key) => data[key]=val);
    data.postId = id;
    //console.log(data);
    try {
      await api.newReply(data, 'post');
      localStorage.setItem('DRAFT_POST_'+id, '');
    } catch (err) {
      errText.innerText = 'Failed to create a new reply';
    }
  });
}
const postText = document.getElementById('newpost-text');
postText.value = localStorage.getItem('DRAFT_POST_'+id) || '';
postText.addEventListener('input', e => {
  //console.log(postText.value);
  localStorage.setItem('DRAFT_POST_'+id, postText.value);
});