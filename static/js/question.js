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
    const parts = location.href.split('/');
    parts.pop();
    parts.pop();
    data.postId = id;
    //console.log(data);
    try {
      await api.newReply(data, 'question');
      localStorage.setItem('DRAFT_QUESTION_'+id, '');
    } catch (err) {
      errText.innerText = 'Failed to create a new reply';
    }
  });
}
function toggle(state) {
  //const questionId = id;
  if (state) api.openQuestion({questionId:id});
  else api.closeQuestion({questionId:id});
}

const postText = document.getElementById('newpost-text');
postText.value = localStorage.getItem('DRAFT_QUESTION_'+id) || '';
postText.addEventListener('oninput', e => {
  localStorage.setItem('DRAFT_QUESTION_'+id, postText.value);
});