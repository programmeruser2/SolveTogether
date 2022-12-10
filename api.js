// API:

/*
Login API:

POST /api/login
Input: JSON 
{
  username: "[username]",
  password: "[password]"
}
Login the user.
Output: status

POST /api/signup
Input: JSON
{
  username: "[username]",
  password: "[password]"
}
Signup and automatically logins in the user.
Output: status

*/

/*
Project API:
POST /api/newproject
Input: JSON
{
  name: "Name of my project"
  description: "Description of my project"
}
Output: {status:"<status>", id: "<project id>"}

POST /api/getproject
Input: JSON
{id:<nonnegative integer id>}
output:{status:"<status>",name:<name>,description:<description>}
*/
/*
Project resources:
List with link to posts which have resources
Features: make resource
*/

/*
Project message board: make post/reply to post
*/

/*
Questions API:
Builds off of Project API.
Basic features: Create question, make post on question, open/close question
*/
/*
Idea: perhaps add points for each message/resource/question?
*/

// Database:
/*
We use replit db which is a simple key value database.
User credentials:
These correspond to PASSWORD_user -> hashed password
*/

const argon2 = require('argon2');
const Client = require('@replit/database');
const client = new Client();
const router = require('express').Router();

const { requireAuth, setAuthed } = require('./requireauth');

router.use(setAuthed);
// Initialize Database
/*if (client.get('CURRENT_PROJECT_ID') == null) {
  client.set('CURRENT_PROJECT_ID', 0);
}*/
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const hash = await client.get('PASSWORD_' + username);
  if (hash === null) {
    return res.status(403).send({error:'No such user'});
  }
  if (await argon2.verify(hash, password)) {
    req.session.user = username;
    res.status(200).send({status:'OK'}); // honestly idk what to send
  } else {
    res.status(403).send({error:'Invalid credentials'});
  }
});
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  //console.log('HI!', username, password)
  if ((await client.get('PASSWORD_' + username)) !== null) {
    return res.status(400).send({error: 'User already exists'});
  }
  const hash = await argon2.hash(password);
  await client.set('PASSWORD_' + username, hash);
  await client.set('USER_PROJECTS_' + username, []);
  req.session.user = username;
  res.status(200).send({status:'OK'});
});
router.post('/newproject', requireAuth, async (req, res) => {
  const { name, description } = req.body;
  let id = await client.get('CURRENT_PROJECT_ID');
  if (id == null) id = 0;
  await client.set("CURRENT_PROJECT_ID",id+1);
  await client.set('PROJECT_NAME_'+id, name);
  await client.set('PROJECT_DESC_'+id, description);
  await client.set('PROJECT_MEMBERS_'+id, [req.session.user]);
  
  await client.set('PROJECT_RESOURCES', []);
  await client.set('PROJECT_MESSAGES', []);
  await client.set('PROJECT_QUESTIONS', []);

  const projs = await client.get('USER_PROJECTS_'+req.session.user);
  projs.push(id);
  await client.set('USER_PROJECTS_'+req.session.user, projs);
  
  res.status(200).send({status:'OK', id: id});
});
router.post('/getproject', async (req,res) => {
  const {id}=req.body;
  const curr = await client.get('CURRENT_PROJECT_ID');
  if (id >= curr) {
    res.status(400).send({error:"no such project"});
  }
  const name = await client.get('PROJECT_NAME_'+id);
  const desc =await client.get('PROJECT_DESC_'+id);
  
  res.status(200).send({status:'OK',name:name,description:desc});
});
router.post('/joinproject', requireAuth, async (req,res) => {
  if (!setAuthed) {
    return res.status(403).send({error:'pls login first'});
  }
  const {id}=req.body;
  const {user}=req.session;
  
  const members = await client.get('PROJECT_MEMBERS_'+id);
  members.push(user);
  await client.set('PROJECT_MEMBERS_'+id, members);
  
  const projs = await client.get('USER_PROJECTS_'+user);
  projs.push(id);
  await client.set('USER_PROJECTS_'+user, projs);

  return res.status(200).send({status:'OK'});
});




// Resources API
router.post('/makeresource', requireAuth, async (req, res) => {
  // Input: JSON {title:<title>,text:<text>}
  // Output: status, id
  const {title,text} = req.body;
  let id = await client.get('CURRENT_RESOURCE_ID');
  if (id == null) id = 0;
  await client.set('CURRENT_RESOURCE_ID', id+1);
  await client.set('RESOURCE_TITLE_' + id, title);
  await client.set('RESOURCE_TEXT_' + id, text);
  return res.status(200).send({status:'OK', id: id});
});


module.exports = router;