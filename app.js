const createError = require('http-errors');
const express = require('express');
const http = require('http')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('express-flash');

const firebase = require('./firebase/config')
const db = firebase.firestore();

var app = express();
const server = http.createServer(app)
const socketio = require('socket.io')(server)

var indexRouter = require('./routes/index');
var serverRouter = require('./routes/server');
var listRouter = require('./routes/list');
var pollRouter = require('./routes/poll');
var announcementRouter = require('./routes/announcement');
var accountRouter = require('./routes/account');
var playgroundRouter = require('./routes/playground');
var authRouter = require('./routes/auth');
var apiAnnouncementRouter = require('./routes/api/announcement.js');
var apiAuthRouter = require('./routes/api/auth.js');
var apiListRouter = require('./routes/api/list.js');
var apiPollRouter = require('./routes/api/poll.js');
var apiServerRouter = require('./routes/api/server.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1)

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:null }
}))

// Make socket accessible to routes
app.use((req, res, next) => {
  res.io = socketio;  
  next()
});

app.use(require('ejs-yield'))
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/', indexRouter);
app.use('/account', accountRouter);
app.use('/playground', playgroundRouter);
app.use('/auth', authRouter);
app.use('/api/announcement',announcementRouter);
app.use('/api/auth',apiAuthRouter);
app.use('/api/list',apiListRouter);
app.use('/api/poll',apiPollRouter);
app.use('/api/server',apiServerRouter);
app.use('/s/:server_code', callServerList, serverRouter);
app.use('/s/:server_code/list', listRouter);
app.use('/s/:server_code/poll', pollRouter);
app.use('/s/:server_code/announcement', announcementRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// check if session has existed
function isLoggedIn(req, res, next) {
  if (!req.session.uid) {
    res.redirect('/auth/signin');
  } else {
    console.log(req.session.displayName);
    console.log(req.session.fullName);
    console.log(req.session.nickname);
    console.log(req.session.nim);
    next();
  }
}

function callServerList(req, res, next){
  const io = socketio

  const user_id = 'VQl24LbkRlVJn7xAvGDsVycvX4K3'

  console.log('Listening to server changes')

  const observer = db.collection(`users`).doc(user_id).collection('servers')
  .onSnapshot(async querySnapshot => {

    for (let change of querySnapshot.docChanges()){

      const server_id = change.doc.data().server_id

      const serverRef = db.collection('servers').doc(server_id);
      const doc = await serverRef.get()

      const { name, icon } = doc.data()

      const data = { server_id, name, icon }

      console.log('data', data);

      io.on('connection', socket => {
        socket.emit('server_changes', {type: change.type, data})
      })

      next()
    }
  });
}

const PORT = 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
