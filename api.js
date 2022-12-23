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

// Contribution points: (\/ [supposed to be a checkmark but wtv] DONE)
// New project = 5 points (DONE)
// Resource = 3 points (DONE)
// Question = 2 points (DONE)
// Message Board Post = 1 point(s)


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

async function addPoints(user, amount) {
  const points = await client.get('USER_CONTRIBUTION_POINTS_' + req.session.user);
  await client.set('USER_CONTRIBUTION_POINTS_'+req.session.user, points+amount);
}

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
  await client.set('USER_CONTRIBUTION_POINTS_' + username, 0);
  await client.set('USER_DESCRIPTION_' + username, '');
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
  
  await client.set('PROJECT_RESOURCES_'+id, []);
  await client.set('PROJECT_MESSAGES_'+id, []);
  await client.set('PROJECT_QUESTIONS_'+id, []);

  const projs = await client.get('USER_PROJECTS_'+req.session.user);
  projs.push(id);
  await client.set('USER_PROJECTS_'+req.session.user, projs);

  // Contribution Points
  addPoints(req.session.user, 5);
  
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
  // Input: JSON {title:<title>,text:<text>,projectId:<projectId>}
  // Output: status, id
  const {title,text,projectId} = req.body;
  let id = await client.get('CURRENT_RESOURCE_ID');
  if (id == null) id = 0;
  await client.set('CURRENT_RESOURCE_ID', id+1);
  await client.set('RESOURCE_TITLE_' + id, title);
  await client.set('RESOURCE_TEXT_' + id, text);
  await client.set('RESOURCE_AUTHOR_' + id, req.session.user);

  const reses = await client.get('PROJECT_RESOURCES_'+projectId);
  reses.push(id);
  await client.set('PROJECT_RESOURCES_'+projectId, reses);

  // Contribution Points
  addPoints(req.session.user, 3);
  
  return res.status(200).send({status:'OK', id: id});
});

// Message Board API
// Create Post
router.post('/createpost', requireAuth, async (req, res) => {
  // Input: JSON {title:<title>,text:<text>,projectId:<projectId>}
  // Output: status, id
  const {title,text,projectId} = req.body;
  let id = await client.get('CURRENT_POST_ID');
  if (id == null) id = 0;
  await client.set('CURRENT_POST_ID', id+1);
  await client.set('POST_TITLE_' + id, title);
  await client.set('POST_TEXT_' + id, text);
  await client.set('POST_AUTHOR_' + id, req.session.user);
  await client.set('POST_REPLIES_'+id, []);

  const reses = await client.get('PROJECT_MESSAGES_'+projectId);
  reses.push(id);
  await client.set('PROJECT_MESSAGES_'+projectId, reses);

  // Contribution Points
  addPoints(req.session.user, 1);
  
  return res.status(200).send({status:'OK', id: id});
});
router.post('/replypost', requireAuth, async (req, res) => {
  // Input: JSON {text:<text>,postId:<postId>}
  // Output: status
  const {text,postId} = req.body;
  let id = await client.get('CURRENT_REPLY_ID');
  if (id == null) id = 0;
  await client.set('CURRENT_REPLY_ID', id+1);
  await client.set('REPLY_TEXT_' + id, text);
  await client.set('REPLY_AUTHOR_' + id, req.session.user);

  const reses = await client.get('POST_REPLIES_'+postId);
  reses.push(id);
  await client.set('POST_REPLIES_'+postId, reses);
  
  return res.status(200).send({status:'OK'});
});

// Questions API
// Actions: Create, comment, open, close a question
// Create Post
router.post('/createquestion', requireAuth, async (req, res) => {
  // Input: JSON {title:<title>,text:<text>,projectId:<projectId>}
  // Output: status, id
  const {title,text,projectId} = req.body;
  let id = await client.get('CURRENT_QUESTION_ID');
  if (id == null) id = 0;
  await client.set('CURRENT_QUESTION_ID', id+1);
  await client.set('QUESTION_TITLE_' + id, title);
  await client.set('QUESTION_TEXT_' + id, text);
  await client.set('QUESTION_AUTHOR_' + id, req.session.user);
  await client.set('QUESTION_REPLIES_'+id, []);
  await client.set('QUESTION_STATE_'+id, true);

  const reses = await client.get('PROJECT_QUESTIONS_'+projectId);
  reses.push(id);
  await client.set('PROJECT_QUESTIONS_'+projectId, reses);

  // Contribution Points
  addPoints(req.session.user, 2);
  
  return res.status(200).send({status:'OK', id: id});
});
router.post('/replyquestion', requireAuth, async (req, res) => {
  // Input: JSON {text:<text>,postId:<postId>}
  // Output: status
  const {text,postId} = req.body;
  let id = await client.get('CURRENT_REPLY_ID');
  if (id == null) id = 0;
  await client.set('CURRENT_REPLY_ID', id+1);
  await client.set('REPLY_TEXT_' + id, text);
  await client.set('REPLY_AUTHOR_' + id, req.session.user);

  const reses = await client.get('QUESTION_REPLIES_'+postId);
  reses.push(id);
  await client.set('QUESTION_REPLIES_'+postId, reses);
  //console.log(reses);
  
  return res.status(200).send({status:'OK'});
});
router.post('/openquestion', requireAuth, async (req, res) => {
  const {questionId} = req.body;
  await client.set('QUESTION_STATE_'+questionId, true);
  return res.status(200).send({status:'OK'});
});
router.post('/closequestion', requireAuth, async (req, res) => {
  const {questionId} = req.body;
  await client.set('QUESTION_STATE_'+questionId, false);
  return res.status(200).send({status:'OK'});
});
router.get('/description/:user', async (req, res) => {
  let user;
  if (req.query.current === 'true') {
    if (!req.authed) {
      return res.status(403).send({error:'You are not logged in'});
    } else {
      user = req.session.username;
    }
  } else {
    user = req.params.user;
  }
  const description = await client.get('USER_DESCRIPTION_' + user);
  res.send({status:'OK', description});
});
router.post('/updatedescription', requireAuth, async (req, res) => {
  const { description } = req.body;
  await client.set('USER_DESCRIPTION_' + req.session.user, description);
  res.send({status:'OK'});
});
module.exports = router;