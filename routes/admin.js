var express = require('express');
var router = express.Router();
var vendorHelpers=require('../helpers/vendor-helpers')
var categoryHelpers=require('../helpers/category-helpers')
var userHelpers=require('../helpers/user-helpers')
/* GET home page. */
let adminDetais={
  Name:"shahana",
  Password:"qwerty",
};
router.get('/', function(req, res, next) {
  console.log('sdsdsdshi hi');
  res.render('admin/login',{title: 'Express'})
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

  res.render('admin/home',{admin:true});
}
else{
  console.log('false');
  
 /*res.render('admin/else');*/
 req.session.loginErr="Invalid username or password"
 res.render('admin/login',{"loginErr":req.session.loginErr})
 req.session.loginErr=false
 
}
  

})
router.get('/logout',(req,res)=>{
  
  res.redirect('login');
  /*res.render('admin/login')*/
})
router.get('/home',(req,res)=>{
  res.render('admin/home',{admin:true})
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})


router.get('/vendorManagement',(req,res)=>{

  vendorHelpers.getAllvendors().then((vendors)=>{
    res.render('admin/vendorManagement',{admin:true,vendors})

  })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})


router.get('/categoryManagement',(req,res)=>{

  categoryHelpers.getAllcategories().then((categories)=>{
    res.render('admin/categoryManagement',{admin:true,categories})

  })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})


router.get('/addCategory',(req,res)=>{
  res.render('admin/addCategory',{admin:true})
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})
router.get('/addVendor',(req,res)=>{
  res.render('admin/addVendor',{admin:true})
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})




router.post('/addCategory',(req,res)=>{
  /*console.log(req.body)*/
 /* console.log(req.files.image)*/
 categoryHelpers.addCategory(req.body,(id)=>{
    
    res.render("admin/categoryManagement",{admin:true,categories})
    console.log(id)
   
  })
    
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
  
  
    router.post('/addVendor',(req,res)=>{
      /*console.log(req.body)*/
     /* console.log(req.files.image)*/
      vendorHelpers.addVendor(req.body,(id)=>{
        let image=req.files.image
        console.log(id)
        image.mv('./public/vendor-images/'+id+'.jpg',(err)=>{
          if(!err){
            res.render("admin/addVendor",{vendor:true})
          }else{
            console.log(err)
          }
        })
      })
        
      })
    
    
  
router.get('/orderDetails',async(req,res)=>{
  let products=await userHelpers.getCartProducts(req.session.user._id)
   
        res.render('admin/orderDetails',{admin:true,products})
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})
  
router.get('/userDetails',async(req,res)=>{
  let orders=await userHelpers.getUserOrders(req.session.user._id)
  res.render('admin/userDetails',{admin:true,orders})
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})















  router.get('/editVendor/:id',async (req,res)=>{
    let vendor=await vendorHelpers.getVendorDetails(req.params.id)
    console.log(vendor);
    res.render('admin/editVendor',{vendor})
    
  })


  router.post('/editVendor/:id',(req,res)=>{
    let id=req.params.id
   vendorHelpers.updateVendor(req.params.id,req.body).then(()=>{
     res.redirect('/admin/vendorManagement')
     if(req.files.image){
       let image=req.files.image
       image.mv('./public/vendor-images/'+id+'.jpg')
     }
   })
    })
    router.get('/editCategory/:id',async (req,res)=>{
      let category=await categoryHelpers.getCategoryDetails(req.params.id)
      console.log(category);
      res.render('admin/editCategory',{admin:true,category})
      
    })
  
  
    router.post('/editCategory/:id',(req,res)=>{
      let id=req.params.id
     categoryHelpers.updateCategory(req.params.id,req.body).then(()=>{
       res.redirect('/admin/categoryManagement',{admin:true})
       
     })
      })
  

    router.get('/deleteVendor',(req,res)=>{
      venId=req.query.id
      console.log(venId);
      console.log(req.query.name);
      vendorHelpers.deleteVendor(venId).then((response)=>{
        res.redirect('/admin/vendorManagement')
      })
    
    })
    
    router.get('/deleteCategory',(req,res)=>{
      catId=req.query.id
      console.log(catId);
      console.log(req.query.name);
      categoryHelpers.deleteCategory(catId).then((response)=>{
        res.redirect('/admin/categoryManagement')
      })
    
    })

module.exports = router;
