var express = require('express');
var router = express.Router();

/* GET home page. */
let adminDetais={
  Name:"shahana",
  Password:"qwerty",
};
""
router.get('/', function(req, res, next) {
  console.log('sdsdsdshi hi');
  res.render('admin/login', { title: 'Express' })
  console.log('hi end');
});



router.get('/login', function(req, res, next) {
  console.log('sdsdsdshi hi');
  res.render('admin/login', { title: 'Express' });
});

router.post('/login',(req,res,next)=>{
  console.log('hi login')
  if((req.body.Name===adminDetais.Name) && (req.body.Password===adminDetais.Password)){
console.log('true');
console.log(req.body.Name);
console.log(req.body.Password);

  res.render('admin/home');
}
else{
  console.log('false');
  req.loginErr="Invalid usernameor password"
/*  res.render('admin/else');*/
 res.redirect('/admin/login');
}
  

})
router.get('/logout',(req,res)=>{
  
  res.redirect('/')
})
module.exports = router;
