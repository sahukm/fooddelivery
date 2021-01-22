var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')
var categoryHelpers = require('../helpers/category-helpers');
var vendorHelpers=require('../helpers/vendor-helpers')
/* GET home page. */
const verifyVendorLogin=async(req,res,next)=>{
  console.log("lofin verify111. vendor...");
  
  let vendorBlockStatus=await userHelpers.getVendorBlockDetails(req.session.vendor._id)

console.log(vendorBlockStatus);
  console.log("lofin verify....");
 /* console.log(req.session.user.blockStatus);*/
 /* console.log(req.session.loggedIn);
  console.log(req.session.unBlock);*/
  if(req.session.vendorloggedIn && vendorBlockStatus) 
  {
    console.log("iam next");
    next()
  }
  else{
    res.render('vendor/login')
  }
}

router.get('/', function(req, res, next) {
  res.render('vendor/login', { title: 'Express' });
});
router.get('/home',verifyVendorLogin,async(req,res)=>{
 /*let totalOrder=await productHelpers.getVendorTotalOrders(req.session.vendor._id)
  console.log(totalOrder);*/
  totalSaledItems=await productHelpers.getVendorSaledProducts(req.session.vendor._id)
  totalProducts=await productHelpers.getVendorTotalProducts(req.session.vendor._id)
  totalAmount=await productHelpers.getVendorTotalAmount(req.session.vendor._id)
  res.render('vendor/home',{vendorHead:true  ,vendor:req.session.vendor,totalProducts,totalSaledItems,totalAmount})
  
  console.log("hi vendor");
  console.log(totalOrder);
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})

router.post('/login',async(req,res)=>{
  console.log('hi login')
 
      
   await vendorHelpers.doLogin(req.body).then((response)=>{
   
      if(response.status){
        console.log("true vendor");
        req.session.vendorloggedIn=true
        req.session.vendor=response.vendor
        
        
      
       res.render('vendor/home',{vendorHead:true,vendor:req.session.vendor})
        
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
  
  router.get('/productManagement',async(req,res)=>{
    console.log("hi pro mngmnt true");
    
      
    await productHelpers.getVendorAllProducts(req.session.vendor._id).then((products)=>{
      res.render('vendor/productManagement',{vendorHead:true,products})

    })
    
    /*res.redirect('login');*/
    /*res.render('admin/login')*/
  })
  router.get('/addProduct',async(req,res)=>{
    let categoriestable=null

    await categoryHelpers.getAllcategories().then((categories) => {
      categoriestable = categories
      console.log(categoriestable);
    })
    res.render('vendor/addProduct',{vendorHead:true,vendor:req.session.vendor,categoriestable})
    /*res.redirect('login');*/
    /*res.render('admin/login')*/
  })

  router.get('/delivered/:id', async(req, res) => {
    console.log("hi deliver router");
    console.log(req.params.id);
    console.log("Success fully delivered");
    await userHelpers.changePaymentStatus(req.params.id).then(()=>{
      console.log("hi user help");
     
    
   
   })
   let orders=await userHelpers.getUserOrders(req.session.user._id)
   res.render('vendor/orderManagement',{vendorHead:true,orders})
  })

  router.get('/cancelled/:id', async(req, res) => {
    console.log("hi deliver router cancel");
    console.log(req.params.id);
    console.log("Success fully cancelled");
   await userHelpers.changePaymentStatusCancel(req.params.id).then(()=>{
      console.log("hi user help cancell");
     
   })
   let orders=await userHelpers.getUserOrders(req.session.user._id)
   res.render('vendor/orderManagement',{vendorHead:true,orders})
 
  })
  
  router.post('/addProduct',async(req,res)=>{
    /*console.log(req.body)*/
   /* console.log(req.files.image)*/
   await productHelpers.addProduct(req.body,(id)=>{
      let image=req.files.image
      console.log(id)
      image.mv('./public/product-images/'+id+'.jpg',(err)=>{
        if(!err){
          res.render("vendor/addProduct",{vendorHead:true,vendor:req.session.vendor})
        }else{
          console.log(err)
        }
      })
    })
      
    })
    router.get('/orderManagement',async(req,res)=>{
      let orders=await userHelpers.getUserOrders(req.session.user._id)
      res.render('vendor/orderManagement',{vendorHead:true,orders})
      /*res.redirect('login');*/
      /*res.render('admin/login')*/
    })
    router.get('/orderHistory',async(req,res)=>{
      
      
      let orders= await userHelpers.getVendorOrderProducts(req.session.vendor._id)
      res.render('vendor/orderHistory',{vendorHead:true,orders,vendor:req.session.vendor})
      /*res.redirect('login');*/
      /*res.render('admin/login')*/
    })
    router.get('/editProduct/:id',async (req,res)=>{
      let categoriestable=null

      let product=await productHelpers.getProductDetails(req.params.id)

      console.log(product);
      await categoryHelpers.getAllcategories().then((categories) => {
        categoriestable = categories
        console.log(categoriestable);
      })
      res.render('vendor/editProduct',{product,vendor:req.session.vendor,vendorHead:true,categoriestable})
      
    })
    router.get('/salesReport',async(req,res)=>{
      console.log("hi sales vendor");
      
      console.log(req.session.vendor);
      console.log(req.session.vendor._id);
      console.log("hi vn idddd");
    
  
     let vendororderItems=await userHelpers.getVendorOrderProducts(req.session.vendor._id)
     console.log("vendr ordrd prods...");
     console.log(vendororderItems);
    
     /* let orders=await userHelpers.getUserOrders(req.session.user._id)
      console.log(orders);
      console.log("hi new orders");*/

      res.render('vendor/salesReport',{vendorHead:true,vendororderItems,vendor:req.session.vendor})
      console.log("hi after sales");
      /*res.redirect('login');*/ 
      /*res.render('admin/login')*/
    })
    router.get('/editProduct/:id',async (req,res)=>{
      let product=await productHelpers.getProductDetails(req.params.id)
      console.log(product);
      res.render('vendor/editProduct',{product,vendor:req.session.vendor,vendorHead:true})
      
    })
    /*router.get('/thisMonth',async(req,res)=>{
      console.log("hi sales vendor");
      
      console.log(req.session.vendor);
      console.log(req.session.vendor._id);
      console.log("hi vn idddd");
    
  
     let vendororderItems=await userHelpers.getVendorOrderProducts(req.session.vendor._id)
     console.log("vendr ordrd prods...");
     console.log(vendororderItems);
    
     /* let orders=await userHelpers.getUserOrders(req.session.user._id)
      console.log(orders);
      console.log("hi new orders");

      res.render('vendor/salesReport',{vendorHead:true,vendororderItems,vendor:req.session.vendor})
      console.log("hi after sales");
      /*res.redirect('login');*/ 
      /*res.render('admin/login')
    })*/
    router.get('/editProduct/:id',async (req,res)=>{
      let product=await productHelpers.getProductDetails(req.params.id)
      console.log(product);
      res.render('vendor/editProduct',{product,vendor:req.session.vendor,vendorHead:true})
      
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
