const createError = require('http-errors');
const express = require('express');
const http = require('http')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const moment = require('moment');
const firebase = require('./firebase/config');

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
var adminServerRouter = require('./routes/admin-server');
var serverRouter = require('./routes/server');
var apiAnnouncementRouter = require('./routes/api/announcement.js');
var apiAuthRouter = require('./routes/api/auth.js');
var apiListRouter = require('./routes/api/list.js');
var apiPollRouter = require('./routes/api/poll.js');
var apiServerRouter = require('./routes/api/server.js');
var apiAdminServerRouter = require('./routes/api/admin-server.js');

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

    res.locals.userId = req.session.uid;
    res.locals.displayName = req.session.displayName;
    res.locals.fullName = req.session.fullName;
    res.locals.nickname = req.session.nickname;
    res.locals.nim = req.session.nim;
    res.locals.moment = moment;
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

app.all('/', isLoggedIn, indexRouter);
app.use('/playground', playgroundRouter);
app.use('/auth', authRouter);
app.use('/api/auth',apiAuthRouter);
app.use('/server', isLoggedIn, adminServerRouter);
app.use('/account/', isLoggedIn ,accountRouter);
app.use('/api/server', isLoggedIn, apiAdminServerRouter);
app.use('/api/:server_code', isLoggedIn, apiServerRouter);
app.use('/api/:server_code/list', isLoggedIn,apiListRouter);
app.use('/api/:server_code/poll', isLoggedIn,apiPollRouter);
app.use('/api/:server_code/announcement', isLoggedIn,apiAnnouncementRouter);
app.use('/s/:server_code', isLoggedIn, serverRouter);
app.use('/s/:server_code/list', isLoggedIn, listRouter);
app.use('/s/:server_code/poll', isLoggedIn, pollRouter);
app.use('/s/:server_code/announcement', isLoggedIn, announcementRouter);

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
