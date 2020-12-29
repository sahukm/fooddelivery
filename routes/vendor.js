var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')
var vendorHelpers=require('../helpers/vendor-helpers')
/* GET home page. */
let vendorDetais={
    Name:"shinu",
    Password:"help",
  };
router.get('/', function(req, res, next) {
  res.render('vendor/login', { title: 'Express' });
});


router.post('/login',(req,res)=>{
  console.log('hi login')
    vendorHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
        console.log("true vendor");
        req.session.vendorloggedIn=true
        req.session.vendor=response.vendor
      
    
        res.render('vendor/home',{vendor:true,vendor:req.session.vendor})
        
      }else{
        console.log("false vendor");
        req.session.loginErr="Invalid username or password"
      
        req.session.loginErr="Invalid username or password"
        res.render('vendor/login',{"loginErr":req.session.loginErr})
        req.session.loginErr=false
        
      }
    })
  
  })
/*router.post('/login',(req,res,next)=>{
    console.log('hi login vendor')
    if((req.body.Name===vendorDetais.Name) && (req.body.Password===vendorDetais.Password)){
      req.session.vendorloggedIn=true

      
  console.log('true');
  console.log(req.body.Name);
  console.log(req.body.Password);
  
    res.render('vendor/home',{vendor:true});
  }
  else{
    console.log(req.body.Name);
    console.log(req.body.Password);
    console.log('false');
    
   
   req.session.loginErr="Invalid username or password"
   res.render('vendor/login',{"loginErr":req.session.loginErr})
   req.session.loginErr=false
   
  }
    
  
  })*/
  router.get('/logout',(req,res)=>{
    res.render('vendor/login')
    /*res.redirect('login');*/
    /*res.render('admin/login')*/
  })
  router.get('/home',(req,res)=>{
    res.render('vendor/home',{vendor:true  ,vendor:req.session.vendor})
    console.log(vendor);
    console.log("hi vendor");
    /*res.redirect('login');*/
    /*res.render('admin/login')*/
  })
  router.get('/productManagement',(req,res)=>{

    productHelpers.getAllproducts().then((products)=>{
      res.render('vendor/productManagement',{vendor:true,products})

    })
    
    /*res.redirect('login');*/
    /*res.render('admin/login')*/
  })
  router.get('/addProduct',(req,res)=>{
    res.render('vendor/addProduct',{vendor:true,vendor:req.session.vendor})
    /*res.redirect('login');*/
    /*res.render('admin/login')*/
  })

  router.get('/delivered/:id', (req, res) => {
    console.log("hi deliver router");
    console.log(req.params.id);
    console.log("Success fully delivered");
    userHelpers.changePaymentStatus(req.params.id).then(()=>{
      console.log("hi user help");
     
    
   })
  })

  router.get('/cancelled/:id', (req, res) => {
    console.log("hi deliver router cancel");
    console.log(req.params.id);
    console.log("Success fully cancelled");
    userHelpers.changePaymentStatusCancel(req.params.id).then(()=>{
      console.log("hi user help cancell");
     
    
   })
  })
  
  router.post('/addProduct',(req,res)=>{
    /*console.log(req.body)*/
   /* console.log(req.files.image)*/
    productHelpers.addProduct(req.body,(id)=>{
      let image=req.files.image
      console.log(id)
      image.mv('./public/product-images/'+id+'.jpg',(err)=>{
        if(!err){
          res.render("vendor/addProduct",{vendor:true,vendor:req.session.vendor})
        }else{
          console.log(err)
        }
      })
    })
      
    })
    router.get('/orderManagement',async(req,res)=>{
      let orders=await userHelpers.getUserOrders(req.session.user._id)
      res.render('vendor/orderManagement',{vendor:true,orders,vendor:req.session.vendor})
      /*res.redirect('login');*/
      /*res.render('admin/login')*/
    })
    router.get('/orderHistory',async(req,res)=>{
      let orders=await userHelpers.getUserOrders(req.session.user._id)
      res.render('vendor/orderHistory',{vendor:true,orders,vendor:req.session.vendor})
      /*res.redirect('login');*/
      /*res.render('admin/login')*/
    })
    router.get('/editProduct/:id',async (req,res)=>{
      let product=await productHelpers.getProductDetails(req.params.id)
      console.log(product);
      res.render('vendor/editProduct',{product,vendor:req.session.vendor,vendor:true})
      
    })
    router.get('/salesReport',async(req,res)=>{
      console.log("hi sales");
      console.log(req.body);
      console.log("hi sales above");
      /*let vendorProducts=await productHelpers.getVendorAllProducts(req.session.vendor)*/
      let orders=await userHelpers.getUserOrders(req.session.user._id)
      console.log(orders);
      console.log("hi new orders");

      res.render('vendor/salesReport',{vendor:true,orders,vendor:req.session.vendor})
      console.log("hi after sales");
      /*res.redirect('login');*/ 
      /*res.render('admin/login')*/
    })
    router.get('/editProduct/:id',async (req,res)=>{
      let product=await productHelpers.getProductDetails(req.params.id)
      console.log(product);
      res.render('vendor/editProduct',{product,vendor:req.session.vendor,vendor:true})
      
    })


    router.post('/editProduct/:id',(req,res)=>{
      let id=req.params.id
     productHelpers.updateProduct(req.params.id,req.body).then(()=>{
       res.redirect('/vendor/productManagement')
       if(req.files.image){
         let image=req.files.image
         image.mv('./public/product-images/'+id+'.jpg')
       }
     })
      })

      router.get('/deleteProduct',(req,res)=>{
        proId=req.query.id
        console.log(proId);
        console.log(req.query.name);
        productHelpers.deleteProduct(proId).then((response)=>{
          res.redirect('/vendor/productManagement')
        })
      
      })
module.exports = router;
