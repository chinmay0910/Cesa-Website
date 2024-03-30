var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const expressSession = require('express-session');
const session = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}


var indexRouter = require('./routes/index');
//var userRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var studentRouter = require('./routes/student');
const fileUpload = require('express-fileupload');

var app = express();
app.use(fileUpload());

app.options("", cors(corsConfig))
app.use(cors(corsConfig));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('trust proxy', 1);

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "giteesh-gay",
  maxAge: 1000 * 60 * 15,
  cookie: {
    secure: true
  }
}))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(studentRouter.serializeUser());
passport.deserializeUser(studentRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/u', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
