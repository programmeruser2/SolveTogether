window.api = {};
api.login = async function (data) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  //console.log(res.ok);
  if (res.ok) {
    window.location.href = '/';
  } else {
    throw Error('Failed to login');
  }
}

api.signup = async function (data) {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    window.location.href = '/';
  } else {
    throw Error('Failed to signup');
  }
}

api.newproject = async function(data) {
  const res = await fetch('/api/newproject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const {id} = await res.json();
  if (res.ok) {
    window.location.href = '/project/'+id;
  } else {
    throw Error('Failed to create new project');
  }
}

api.joinProject =  async function() {
  const res = await fetch('/api/joinproject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id:Number(location.href.split('/').at(-1))})
  });
  if (res.ok) {
    return true;
  } else {
    throw Error('Failed to join the project');
  }
}

api.newresource = async function(data) {
  const res = await fetch('/api/makeresource', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const {id} = await res.json();
  if (res.ok) {
    const parts = location.href.split('/');
    parts.pop();
    location.href = parts.join('/') + '/resource/' + id;
  } else {
    throw Error('Failed to create a new resource');
  }
}


api.newPost = async function(data) {
  const res = await fetch('/api/createpost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const {id} = await res.json();
  if (res.ok) {
    const parts = location.href.split('/');
    parts.pop();
    location.href = parts.join('/') + '/post/' + id;
  } else {
    throw Error('Failed to create a new post');
  }
}

api.newReply = async function(data) {
  const res = await fetch('/api/replypost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const {id} = await res.json();
  if (res.ok) {
    location.reload();
  } else {
    throw Error('Failed to create a new reply');
  }
}

api.newQuestion = async function(data) {
  const res = await fetch('/api/createquestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const {id} = await res.json();
  if (res.ok) {
    const parts = location.href.split('/');
    parts.pop();
    location.href = parts.join('/') + '/question/' + id;
  } else {
    throw Error('Failed to create a new question');
  }
}