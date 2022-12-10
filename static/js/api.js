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
    throw Error('Failed to create new project');
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
    parts.pop();
    location.href = parts.join('/') + '/resource/' + id;
  } else {
    throw Error('Failed to create new project');
  }
}