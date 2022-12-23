function requireAuth(req, res, next) {
  if (!req.authed) {
    res.redirect('/login');
  } else {
    next();
  }
}
const setAuthed = (req, res, next) => {
  if (req.session === undefined) {
    req.authed = false;
  } else {
    req.authed = req.session.user !== undefined;
  }
  next();
};
module.exports={requireAuth,setAuthed};