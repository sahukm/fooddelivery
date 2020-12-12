var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')
/* GET home page. */
let vendorDetais={
    Name:"shinu",
    Password:"help",
  };
router.get('/', function(req, res, next) {
  res.render('vendor/login', { title: 'Express' });
});

router.post('/login',(req,res,next)=>{
    console.log('hi login vendor')
    if((req.body.Name===vendorDetais.Name) && (req.body.Password===vendorDetais.Password)){
      
  console.log('true');
  console.log(req.body.Name);
  console.log(req.body.Password);
  
    res.render('vendor/home',{vendor:true});
  }
  else{
    console.log(req.body.Name);
    console.log(req.body.Password);
    console.log('false');
    
   /*res.render('admin/else');*/
   req.session.loginErr="Invalid username or password"
   res.render('vendor/login',{"loginErr":req.session.loginErr})
   req.session.loginErr=false
   
  }
    
  
  })
  router.get('/logout',(req,res)=>{
    res.render('vendor/login')
    /*res.redirect('login');*/
    /*res.render('admin/login')*/
  })
  router.get('/home',(req,res)=>{
    res.render('vendor/home',{vendor:true})
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
    res.render('vendor/addProduct',{vendor:true})
    /*res.redirect('login');*/
    /*res.render('admin/login')*/
  })
  router.post('/addProduct',(req,res)=>{
    /*console.log(req.body)*/
   /* console.log(req.files.image)*/
    productHelpers.addProduct(req.body,(id)=>{
      let image=req.files.image
      console.log(id)
      image.mv('./public/product-images/'+id+'.jpg',(err)=>{
        if(!err){
          res.render("vendor/addProduct",{vendor:true})
        }else{
          console.log(err)
        }
      })
    })
      
    })
    router.get('/orderManagement',async(req,res)=>{
      let orders=await userHelpers.getUserOrders(req.session.user._id)
      res.render('vendor/orderManagement',{vendor:true,orders})
      /*res.redirect('login');*/
      /*res.render('admin/login')*/
    })
    router.get('/editProduct/:id',async (req,res)=>{
      let product=await productHelpers.getProductDetails(req.params.id)
      console.log(product);
      res.render('vendor/editProduct',{product})
      
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
