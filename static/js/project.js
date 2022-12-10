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
document.getElementById('newpost').href = location.href + '/newpost';
document.getElementById('newquestion').href = location.href + '/newquestion';