const createError = require('http-errors');
const express = require('express');
const http = require('http')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('express-flash');

const firebase = require('./firebase/config')

var app = express();
const server = http.createServer(app)
const socketio = require('socket.io')(server)

var indexRouter = require('./routes/index');
var listRouter = require('./routes/list');
var pollRouter = require('./routes/poll');
var announcementRouter = require('./routes/announcement');
var accountRouter = require('./routes/account');
var playgroundRouter = require('./routes/playground');
var authRouter = require('./routes/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1)

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:60000 }
}))


app.use((req, res, next) => {
  res.io = socketio;
  // if(!req.session.email){
  //   res.redirect('/auth/signin')
  // }else{
  //   next();
  // }
  next()
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/s/:server_code/list', listRouter);
app.use('/s/:server_code/polls', pollRouter);
app.use('/s/:server_code/announcement', announcementRouter);
app.use('/account', accountRouter);
app.use('/playground', playgroundRouter);
app.use('/auth', authRouter);

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

const PORT = 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
