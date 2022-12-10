const express = require('express');

// Prevent Crashing
process.on('uncaughtException', (err, orig) => {
  console.log('Error:')
  console.log(err)
  console.log('Origin:')
  console.log(orig)
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Promise rejection at:')
  console.log(promise)
  console.log('Reason:')
  console.log(reason)
});

const app = express();
app.set('view engine', 'pug');

const session = require('express-session');
app.set('trust proxy', 1)
app.use(session({
  secret: 'VB5zy0A9P9',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


app.use(express.json());
app.use('/static', express.static('static'));
app.use(require('./routes'));

app.listen(8080, () => {
  console.log('server started');
});
