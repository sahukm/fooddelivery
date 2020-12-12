var express = require('express');
/*const otp=require('../config/otp')
const client=require("twilio")(otp.accountSID,otp.authToken)*/

const { render }=require('../app');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var categoryHelpers=require('../helpers/category-helpers')



/* GET home page. */


const veryfyLogin=(req,res,next)=>{
  if(req.session.loggedIn)
  {
    next()
  }
  else{
    res.redirect('/login')
  }
}
router.get('/', async function(req, res, next) {
  let user=req.session.user
  let cartCount=null
  if(req.session.user){
    cartCount=await   userHelpers.getCartCount((req.session.user._id))

  }
 
  res.render('users/home', { user});
});

router.get('/home', function(req, res, next) {
  let user=req.session.user
  res.render('users/home', { user});
});

router.get('/bakerOne', async function(req, res, next) {
  let categoriestable=null
  let cartCount=null
  let user=req.session.user
  if(user){
  cartCount=await   userHelpers.getCartCount((req.session.user._id))
  }
  categoryHelpers.getAllcategories().then((categories)=>{
   categoriestable=categories
  })
  
  productHelpers.getAllproducts().then((products)=>{
    console.log( categoriestable);
    console.log("checking catg");
    res.render('users/bakerOne',{products,categoriestable,user,cartCount})
  
  })
  
});
router.get('/about', function(req, res, next) {
  res.render('users/about', { title: 'Express' });
});

router.get('/ourBakers', function(req, res, next) {
  res.render('users/ourBakers', { title: 'Express'});
});

router.get('/login',(req,res)=>{
  if( req.session.loggedIn){
    res.redirect('/bakerOne')
  }else{
  res.render('users/login',{"loginErr":req.session.loginErr})
  req.session.loginErr=false}
})





router.get('/signup', function(req, res, next) {
  res.render('users/signup', { title: 'Express' });
});
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',veryfyLogin,async(req,res)=>{
 
 let totalValue=await userHelpers.getTotalAmount(req.session.user._id)
  let products=await userHelpers.getCartProducts(req.session.user._id)
  
  console.log(products);
  console.log('cart helo');
  res.render('users/cart',{products,user:req.session.user,totalValue})
})

router.get('/addtoCart/:id',(req,res)=>{
  console.log("HI  api call new")
  userHelpers.addtoCart(req.params.id,req.session.user._id).then(()=>{
    //res.redirect('/')//
    res.render('users/bakerOne')
    res.json({status:true})
    
  })
})

router.post('/signup', async(req,res)=>{
 await userHelpers.doSignup(req.body).then((response)=>{
    console.log("hi sgnup")
    req.session.loggedIn=true
    req.session.user=response
    
  
      res.redirect('/login')
    console.log(response)

  })
})





router.post('/login',(req,res)=>{
  console.log('hi login')
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      console.log("true user");
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/bakerOne')
      
    }else{
      console.log("false user");
      req.session.loginErr="Invalid username or password"
      res.redirect('/login')
      
    }
  })

})


router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total=await userHelpers.getTotalAmount(req.session.user._id)
    res.json(response)
  })
})

router.get('/order-success', (req, res) =>{
  res.render('users/order-success', {user:req.session.user});
});
router.get('/orders', async(req, res) =>{
  let orders=await userHelpers.getUserOrders(req.session.user._id)
  res.render('users/orders', {user:req.session.user,orders});
});
router.get('/view-order-products/:id', async(req, res) =>{
  let products=await userHelpers.getOrderProducts(req.params.id)
  res.render('users/view-order-products', {user:req.session.user,products});
});

router.get('/place-order', veryfyLogin,async(req,res)=>{
  console.log('hiii  place order design')
  
   let total=await userHelpers.getTotalAmount(req.session.user._id)
    res.render('users/place-order',{total,user:req.session.user})
  })
 /* router.post('/place-order',(req,res)=>{
    console.log("hi place order post");
    console.log(req.body);
  })*/
  router.post('/place-order',async(req,res)=>{
    let products=await userHelpers.getCartProductList(req.body.userId)
    let totalPrice=await userHelpers.getTotalAmount(req.body.userId)
    userHelpers.placeOrder(req.body,products,totalPrice).then((response)=>{
      res.json({status:true})

    })

    
    console.log(req.body);
  })

  /*router.get('/login', (req,res) => {
    if (req.query.phonenumber) {
       client
       .verify
       .services(process.env.SERVICE_ID)
       .verifications
       .create({
           to: `+${req.query.phonenumber}`,
           channel: req.query.channel==='call' ? 'call' : 'sms' 
       })
       .then(data => {
           res.status(200).send({
               message: "Verification is sent!!",
               phonenumber: req.query.phonenumber,
               data
           })
       }) 
    } else {
       res.status(400).send({
           message: "Wrong phone number :(",
           phonenumber: req.query.phonenumber,
           data
       })
    }
})
router.get('/verify', (req, res) => {
  if (req.query.phonenumber && (req.query.code).length === 4) {
      client
          .verify
          .services(process.env.SERVICE_ID)
          .verificationChecks
          .create({
              to: `+${req.query.phonenumber}`,
              code: req.query.code
          })
          .then(data => {
              if (data.status === "approved") {
                  res.status(200).send({
                      message: "User is Verified!!",
                      data
                  })
              }
          })
  } else {
      res.status(400).send({
          message: "Wrong phone number or code :(",
          phonenumber: req.query.phonenumber,
          data
      })
  }
})*/
  
module.exports = router;
