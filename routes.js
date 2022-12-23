const router = require('express').Router();
router.use('/api', require('./api'));
const { requireAuth, setAuthed } = require('./requireauth');
const Client = require('@replit/database');
const client = new Client();

router.use(setAuthed);
router.get('/', (req, res) => res.render('home', {title:'Home', user:req.session.user,authed:req.authed}));
router.get('/login', (req,res) => res.render('login',{title:'Login',authed:req.authed}));
router.get('/signup', (req,res) => res.render('signup',{title:'Sign Up',authed:req.authed}));
router.get('/signout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});
router.get('/myprojects', requireAuth, async (req,res) => {
  const ids = await client.get('USER_PROJECTS_'+req.session.user);
  const projects = [];
  for (const id of ids) {
    projects.push({
      id: id,
      name: await client.get('PROJECT_NAME_'+id),
      description: await client.get('PROJECT_DESC_'+id)
    });
  }
  res.render('myprojects', {
    projects: projects,
    title: "Projects",
    authed: req.authed
  });
});
router.get('/project/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!(Number.isInteger(id) && id >= 0)) {
    return res.status(404).render('404', {msg:'Project does not exist.'});
  }
  const name=await client.get('PROJECT_NAME_'+id);
  const description=await client.get('PROJECT_DESC_'+id);
  let inProject = false;
  //console.log(await client.get('USER_PROJECTS_'+req.session.user));
  //console.log('before auth check');
  //console.log(req.authed)
  if (req.authed) {
    /*console.log('authed');
    console.log(await client.get('USER_PROJECTS_'+req.session.user));
    console.log(id);*/
    if ((await client.get('USER_PROJECTS_'+req.session.user)).includes(id)) {
      inProject = true;
    }
  }
  
  const resourceIds = await client.get('PROJECT_RESOURCES_'+id);
  const resources = [];
  for (const resource of resourceIds) {
    resources.push({
      id: resource,
      title: await client.get('RESOURCE_TITLE_'+resource),
      url: '/project/'+id+'/resource/'+resource
    });
  }

  const postIds = await client.get('PROJECT_MESSAGES_'+id);
  const posts = [];
  for (const post of postIds) {
    posts.push({
      id: post,
      title: await client.get('POST_TITLE_'+post),
      url: '/project/'+id+'/post/'+post
    });
  }

  const questionIds = await client.get('PROJECT_QUESTIONS_'+id);
  const questions = [];
  for (const question of questionIds) {
    questions.push({
      id: question,
      title: await client.get('QUESTION_TITLE_'+question),
      url: '/project/'+id+'/question/'+question
    });
  }
  
  //console.log(inProject);
  res.render('project', {
    title: 'Project '+name, authed:req.authed, 
    name: name,
    description: description,
    inProject: inProject,
    resources: resources,
    posts: posts,
    questions: questions
  });
});
router.get('/newproject', requireAuth, (req, res) => res.render('newproject', {title: 'New Project', authed:req.authed}));
router.get('/project/:id/newresource', requireAuth, (req,res)=>res.render('newresource', {title: 'New Resource', authed:req.authed}));
router.get('/project/:id/newpost', requireAuth, (req,res)=>res.render('newpost', {title: 'New Post', authed:req.authed}));
router.get('/project/:id/newquestion', requireAuth, (req, res) => res.render('newquestion', {title:'New Question', authed: req.authed}))
router.get('/project/:pid/resource/:id', async (req, res) => {
  const {pid,id} = req.params;
  const pname = await client.get('PROJECT_NAME_' + pid);
  const title = await client.get('RESOURCE_TITLE_'+id);
  const text = await client.get('RESOURCE_TEXT_'+id);
  const author = await client.get('RESOURCE_AUTHOR_'+id);
  //console.log(pname,title,text,author);
  res.render('resource', {
    title: `Project ${pname} - ${title}`,
    authed: req.authed,
    text: text,
    author: author,
    rtitle: title,
    project: pname
  });
});
router.get('/project/:pid/resource/:id', async (req, res) => {
  const {pid,id} = req.params;
  const pname = await client.get('PROJECT_NAME_' + pid);
  const title = await client.get('RESOURCE_TITLE_'+id);
  const text = await client.get('RESOURCE_TEXT_'+id);
  const author = await client.get('RESOURCE_AUTHOR_'+id);
  //console.log(pname,title,text,author);
  res.render('resource', {
    title: `Project ${pname} - ${title}`,
    authed: req.authed,
    text: text,
    author: author,
    rtitle: title,
    project: pname
  });
});
router.get('/project/:pid/post/:id', async (req, res) => {
  const {pid,id} = req.params;
  const pname = await client.get('PROJECT_NAME_' + pid);
  const title = await client.get('POST_TITLE_'+id);
  const text = await client.get('POST_TEXT_'+id);
  const author = await client.get('POST_AUTHOR_'+id);
  //console.log(pname,title,text,author);
  const posts = [];
  const postIds = await client.get('POST_REPLIES_'+id);
  for (const postId of postIds) {
    posts.push({
      text: await client.get('REPLY_TEXT_'+postId),
      author: await client.get('REPLY_AUTHOR_'+postId)
    });
  }
  /*console.log({
    title: `Project ${pname} - ${title}`,
    authed: req.authed,
    text: text,
    author: author,
    ptitle: title,
    project: pname, 
    posts: posts
  });*/
  res.render('post', {
    title: `Project ${pname} - ${title}`,
    authed: req.authed,
    text: text,
    author: author,
    ptitle: title,
    project: pname, 
    posts: posts
  });
});
router.get('/project/:pid/question/:id', async (req, res) => {
  const {pid,id} = req.params;
  const pname = await client.get('PROJECT_NAME_' + pid);
  const title = await client.get('QUESTION_TITLE_'+id);
  const text = await client.get('QUESTION_TEXT_'+id);
  const author = await client.get('QUESTION_AUTHOR_'+id);
  //console.log(pname,title,text,author);
  const posts = [];
  const postIds = await client.get('QUESTION_REPLIES_'+id);
  for (const postId of postIds) {
    posts.push({
      text: await client.get('REPLY_TEXT_'+postId),
      author: await client.get('REPLY_AUTHOR_'+postId)
    });
  }
  /*console.log({
    title: `Project ${pname} - ${title}`,
    authed: req.authed,
    text: text,
    author: author,
    ptitle: title,
    project: pname, 
    posts: posts
  });*/
  const state = await client.get('QUESTION_STATE_'+id);
  res.render('question', {
    title: `Project ${pname} - ${title}`,
    authed: req.authed,
    text: text,
    author: author,
    qtitle: title,
    project: pname, 
    posts: posts,
    state: state
  });
});

// note: add explorer view for projects
router.get('/projects', async (req,res) => {
  //const ids = await client.get('USER_PROJECTS_'+req.session.user);
  const maxid = await client.get('CURRENT_PROJECT_ID');
  const projects = [];
  for (let id = 0; id < maxid; ++id) {
    projects.push({
      id: id,
      name: await client.get('PROJECT_NAME_'+id),
      description: await client.get('PROJECT_DESC_'+id)
    });
  }
  res.render('myprojects', {
    projects: projects,
    title: "Projects",
    authed: req.authed
  });
});
// also profile (descrption, username, points, etc.)
// * profile page
//   - profile display points
//   - display username
//   - display description
//   - ...and more???
router.get('/user/:username', async (req, res) => {  
  const {username} = req.params;
  if ((await client.get('PASSWORD_' + username)) === null) {
    return res.status(404).render('404', {msg: `User "${username}" does not exist`})
  }
  const points = await client.get('USER_CONTRIBUTION_POINTS_' + username);
  const description = await client.get('USER_DESCRIPTION_' + username);
  res.render('profile', {
    title: `User ${username}`,
    username: username,
    points: points,
    description: description,
    authed: req.authed,
    isUser: username == req.session.user
  });
});
router.get('/myuser', requireAuth, async (req, res) => res.redirect('/user/' + req.session.user));
router.get('/editprofile', requireAuth, async (req, res) => {
  res.render('editprofile', {title: 'Edit Profile', authed: req.authed});
});


// will work on this more tomorrow
// also maybe add project tags/question tags/resource tags/post tags/user tags??? idk
// possibly private messaging

// also error handling
module.exports = router;