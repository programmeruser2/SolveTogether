async function joinProject() {
  try {
    if (await api.joinProject()) {
      document.getElementById('success-text').innerText = 'Successfully joined project';
    }
  } catch (err) {
    errText.innerText = 'Failed to join project';
  }
}

document.getElementById('newresource').href = location.href + '/newresource';