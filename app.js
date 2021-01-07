var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/*var indexRouter = require('./routes/index');*/
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var vendorRouter = require('./routes/vendor');
var db=require('./config/connection')
var session=require('express-session')
var hbs=require('express-handlebars')

var app = express();
var fileUpload=require('express-fileupload')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:"key",cookie:{maxAge:6000000},resave: true,
saveUninitialized: true}))

db.connect((err)=>{
  if(err) console.log("connection error"+err)
  else console.log("datbase connected to the port 27017")
})
/*app.use('/', indexRouter);*/

app.use('/', usersRouter);
app.use('/admin',adminRouter);
/*app.use('/users', usersRouter);*/
app.use('/vendor', vendorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
