var express = require('express');
var Router = require('./modules/router/router');
var router = new Router(path.join(__dirname,'routes'));
const { render }=require('../app');
var router = express.Router();
var userHelper=require('../helpers/user-helpers');
var express = require('express');
var router = express.Router();

const userHelpers = require('../helpers/user-helpers');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users/home', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  res.render('users/home', { title: 'Express' });
});


router.get('/about', function(req, res, next) {
  res.render('users/about', { title: 'Express' });
});

router.get('/ourBakers', function(req, res, next) {
  res.render('users/ourBakers', { title: 'Express' });
});

router.get('/bakerOne', function(req, res, next) {
  res.render('users/bakerOne', { title: 'Express' });
});


router.get('/login', function(req, res, next) {
  res.render('users/login', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('users/signup', { title: 'Express' });
});


router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    console.log(response)

  })
})
module.exports = router;
