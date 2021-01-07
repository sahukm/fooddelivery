require('dotenv/config')
var express = require('express');

var router = express.Router()


var TWILIO_SERVICE_ID = 'VAc233ab4b0848fa56d686b21de7df2d2c';
var TWILIO_TOKEN = 'ee51113c5e04d9fc5adbfe8c021d9a52';
var TWILIO_ACCOUNT_SID = 'ACaa6859015fecd41202571e728aa4dcb5';
var client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_TOKEN);


/*const otp=require('../config/otp')
require('dotenv/config')
const client=require("twilio")(otp.accountID,otp.authToken)*/

const { render, response } = require('../app');

var userHelpers = require('../helpers/user-helpers')
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var categoryHelpers = require('../helpers/category-helpers');
const vendorHelpers = require('../helpers/vendor-helpers');



/* GET home page. */



const verifyLogin = async (req, res, next) => {
  console.log("lofin verify111....");
  /*console.log(req.session.user._id);*/
  let userBlockStatus = await userHelpers.getUserBlockDetails(req.session.user._id)

  console.log(userBlockStatus);
  console.log("lofin verify....");
  /* console.log(req.session.user.blockStatus);*/
  /* console.log(req.session.loggedIn);
   console.log(req.session.unBlock);*/
  if (req.session.loggedIn && userBlockStatus) {
    console.log("iam next");
    next()
  }
  else {
    res.render('users/login')
  }
}

router.get('/', async function (req, res, next) {

  console.log("hi loginnnn checking");
  let user = req.session.user
  console.log(user);

  console.log(req.session);
  console.log(req.session.loggedIn);
  console.log("hi guest");

  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount((req.session.user._id))

  }

  res.render('users/home', { user });
});

router.get('/home', function (req, res, next) {
  let user = req.session.user
  res.render('users/home', { user });
});

router.get('/allProducts', async function (req, res, next) {
  console.log("hi all prod");

  /*let categoriestable = null*/
  let cartCount = null
  let user = req.session.user
  if (user) {
    cartCount = await userHelpers.getCartCount((req.session.user._id))
  }
  /*await categoryHelpers.getAllcategories().then((categories) => {
    categoriestable = categories
  })*/

  productHelpers.getAllproducts().then((products) => {
    
    console.log("checking catg");
    res.render('users/allProducts', { products,  user, cartCount })

  })

});

router.get('/bakerOne', verifyLogin, async function (req, res, next) {
  console.log("hi bakerone");

  let categoriestable = null
  let cartCount = null
  let user = req.session.user
  if (user) {
    cartCount = await userHelpers.getCartCount((req.session.user._id))
  }
  await categoryHelpers.getAllcategories().then((categories) => {
    categoriestable = categories
  })

  await productHelpers.getAllproducts().then((products) => {
    console.log(categoriestable);
    console.log("checking catg");
    res.render('users/bakerOne', { products, user, categoriestable,cartCount })

  })

});
router.get('/about', function (req, res, next) {
  console.log("i am bout");
  res.render('users/about');
});

router.get('/ourBakers', async function (req, res, next) {
  let allvendors= await vendorHelpers.getAllvendors()
  res.render('users/ourBakers', { allvendors,user: req.session.user });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/bakerOne')
  } else {
    res.render('users/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})





router.get('/signup', function (req, res, next) {
  res.render('users/signup');
});
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart', verifyLogin, async (req, res) => {

  let totalValue = await userHelpers.getTotalAmount(req.session.user._id)
  let products = await userHelpers.getCartProducts(req.session.user._id)

  console.log(products);
  console.log('cart helo');
  res.render('users/cart', { products, user: req.session.user, totalValue })
})


router.get('/addtoCart/:id',(req,res)=>{
  console.log("HI  api call new")
  
  userHelpers.addtoCart(req.params.id,req.session.user._id).then(()=>{
    //res.redirect('/')//
    res.render('users/bakerOne')
    res.json({status:true})
    
    
    
  })
})


router.post('/signup', async (req, res) => {
  await userHelpers.doSignup(req.body).then((response) => {
    console.log("hi sgnup")
    req.session.loggedIn = true
    req.session.user = response


    res.redirect('/login')
    console.log(response)

  })
})





router.post('/login', (req, res) => {
  console.log('hi login')
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      console.log("true user");
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/bakerOne')

    } else {

      console.log("false user");
      req.session.loginErr = "Invalid username or password"
      res.redirect('/login')

    }
  })

})



router.post('/change-product-quantity', (req, res, next) => {
  userHelpers.changeProductQuantity(req.body).then(async (response) => {
    response.total = await userHelpers.getTotalAmount(req.session.user._id)
    res.json(response)
  })
})
router.post('/remove', async (req, res, next) => {
  console.log("hi remov router...");
  console.log(req.body);

  await userHelpers.removeProduct(req.body).then((response) => {

    res.json(response)
  })
})

router.get('/order-success', (req, res) => {
  res.render('users/order-success', { user: req.session.user });
});
router.get('/orders', async (req, res) => {
  let orders = await userHelpers.getUserOrders(req.session.user._id)
  res.render('users/orders', { user: req.session.user, orders });
});
router.get('/view-order-products/:id', async (req, res) => {
  let products = await userHelpers.getOrderProducts(req.params.id)
  console.log("hi ordeer products..");
  console.log(products);
  res.render('users/view-order-products', { user: req.session.user, products });
});

router.get('/place-order', async (req, res) => {
  console.log('hiii  place order design')

  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('users/place-order', { total, user: req.session.user })
})
router.get('/place-order/:id',  async (req, res) => {
  console.log('hiii  place order design')

  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('users/place-order', { total, user: req.session.user })
})

/*router.get('/eachCategory/:id', async(req, res) => {
  let categoriestable=null
   console.log("hi each baker");
   console.log(req.params.id);
   await categoryHelpers.getAllcategories().then((categories) => {
     categoriestable = categories
   })
   
  await productHelpers. getCategoryAllProducts(req.params.id).then((eachCategoryProducts)=>{
     console.log("hi user help");
     
     console.log(eachCategoryProducts);
  
     res.render('users/eachCategory',{user:true,eachCategoryProducts,categoriestable,user: req.session.user,})
   
  
  })
  
 })*/
router.get('/eachBaker/:id', async(req, res) => {
 let categoriestable=null
  console.log("hi each baker");
  console.log(req.params.id);
  await categoryHelpers.getAllcategories().then((categories) => {
    categoriestable = categories
  })
  
 await productHelpers. getVendorAllProducts(req.params.id).then((eachVendorProducts)=>{
    console.log("hi user help");
    
    console.log(eachVendorProducts);
 
    res.render('users/eachBaker',{eachVendorProducts,categoriestable,user: req.session.user,})
  
 
 })
 
})

router.post('/place-order', async (req, res) => {
  /*let products =  let products = await userHelpers.getCartProducts(req.session.user._id)*/
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body, products, totalPrice).then((orderId) => {
    if (req.body['payment-method'] === 'COD') {
      res.json({ codeSuccess: true })
    } else {
      userHelpers.generateRazorpay(orderId, totalPrice).then((response) => {
        res.json(response)
      })

    }




  })

  console.log(req.body);

})
/* router.post('/place-order',async(req,res)=>{
 let products=await userHelpers.getCartProductList(req.body.userId)
 let totalPrice=await userHelpers.getTotalAmount(req.body.userId)
 userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
   if(req.body['payment-method']==='COD'){
   
   res.json({codSuccess:true})
   }else{
     userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
       res.json(response)
     })
   }

 })

 
 console.log(req.body);

})*/
router.get('/otpLoginform', (req, res) => {
  res.render("users/otpLoginform")
})
router.get('/verify', (req, res) => {
  res.render("users/verify")
})
router.post('/otpLoginform', (req, res) => {
  console.log("hi otplogin");
  console.log(req.body);
  if (req.body.phonenumber) {
    client
      .verify
      .services(otp.serviceId)
      .verifications
      .create({
        to: req.body.phonenumber,
        channel: req.body.channel
      })
      .then(data => {
        res.status(200).send({
          message: "Verification is sent!!",
          phonenumber: req.body.phonenumber,
          data
        })
      })
  } else {
    res.status(400).send({
      message: "Wrong phone number :(",
      phonenumber: req.body.phonenumber,
      data
    })
  }
})

router.get('/otpLogin', (req, res) => {
  console.log("hi service id");
  console.log(TWILIO_SERVICE_ID);


  if (req.body.phonenumber) {
    client
      .verify
      .services(TWILIO_SERVICE_ID)

      .verifications
      .create({
        to: '+${req.body.phonenumber}',
        channel: req.body.channel
      })
      .then(data => {
        res.status(200).send({

          message: "Verification is sent!!",
          phonenumber: req.body.phonenumber,
          data
        })
      })
  } else {
    res.status(400).send({
      message: "Wrong phone number :(",
      phonenumber: req.body.phonenumber,
      data
    })
  }
})
router.post('/verify', (req, res) => {
  if (req.query.phonenumber && (req.query.code).length === 4) {
    client
      .verify
      .services(TWILIO_SERVICE_ID)
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
})



router.post('/verify-payment', (req, res) => {
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(() => {
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
      console.log("payment successfull");
      res.json({ status: true })
    })


  }).catch((err) => {
    console.log(err);
    res.json({ status: 'false', errMsg: '' })
  })
})
module.exports = router;
