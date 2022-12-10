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
  const name=await client.get('PROJECT_NAME_'+id);
  const description=await client.get('PROJECT_DESC_'+id)
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
  if (!(Number.isInteger(id) && id >= 0)) {
    return res.status(404).render('404', {msg:'Project does not exist.'});
  }
  //console.log(inProject);
  res.render('project', {title: 'Project '+name, authed:req.authed, 
                        name:name,description:description,inProject:inProject});
});
router.get('/newproject', requireAuth, (req, res) => res.render('newproject', {title: 'New Project', authed:req.authed}));
router.get('/project/:id/newresource', requireAuth, (req,res)=>res.render('newresource', {title: 'New Resource', authed:req.authed}))
module.exports = router;