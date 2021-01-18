var express = require('express');
var router = express.Router();
var vendorHelpers = require('../helpers/vendor-helpers')
var productHelpers = require('../helpers/product-helpers')
var categoryHelpers = require('../helpers/category-helpers')
var userHelpers = require('../helpers/user-helpers');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt')
/* GET home page. */
let adminDetais = {
  Name: "shahana",
  Password: "qwerty",
};
router.get('/', function (req, res, next) {
  console.log('sdsdsdshi hi');
  res.render('admin/login', { title: 'Express' })
  console.log('hi end');
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/home')
  } else {
    res.render('admin/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})

/*router.get('/login', function (req, res, next) {
  console.log('sdsdsdshi hi');

  res.render('admin/login', { title: 'Express' });
});*/

router.post('/login', async(req, res) => {
  totalProducts =  await productHelpers.getTotalProducts()
  itemSaled=await productHelpers.getItemSaled()
  amount=await productHelpers.getTotalAmount()
  console.log('hi dologin admin.....')
await  userHelpers.doLoginAdmin(req.body).then((response) => {
    if (response.status) {
      console.log("true admin");
      req.session.loggedIn = true
      req.session.admin = response.admin
      adminsession=req.session.admin
      console.log("hi admin session...")
      console.log(req.session.admin)
       
   
console.log("itemSaled");
    console.log(totalProducts);
    console.log(req.body.Name);
    console.log(req.body.Password);
    res.render('admin/home', { admin: true,totalProducts,itemSaled ,amount,adminsession});
      

    } else {

      console.log("false admin");
      req.session.loginErr = "Invalid username or password"
      res.redirect('admin/login')

    }
  })

})


/*router.post('/login', async(req, res, next) => {
  console.log('hi login')
  if ((req.body.Name === adminDetais.Name) && (req.body.Password === adminDetais.Password)) {
    
    totalProducts =  await productHelpers.getTotalProducts()
    itemSaled=await productHelpers.getItemSaled()
    amount=await productHelpers.getTotalAmount()
console.log("itemSaled");
    console.log(totalProducts);
    console.log(req.body.Name);
    console.log(req.body.Password);
    res.render('admin/home', { admin: true,totalProducts,itemSaled ,amount});
   
  }
  else {
    console.log('false');

    /*res.render('admin/else');
    req.session.loginErr = "Invalid username or password"
    res.render('admin/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }


})*/

router.get('/salesReport',async(req,res)=>{
  console.log("hi sales admin");
  
  
/*let orderId=await userHelpers.getAllOrders()
console.log("hi orderessssss");
console.log(orderId);*/

/*console.log(orders[0]._id);*/

 let orderedAllItems=await userHelpers.getOrderallProducts()
 console.log("vendr ordrd prods...");
 console.log(orderedAllItems);

 /* let orders=await userHelpers.getUserOrders(req.session.user._id)
  console.log(orders);
  console.log("hi new orders");*/

  res.render('admin/salesreport',{admin:true,orderedAllItems})
  console.log("hi after adminsales");
  /*res.redirect('login');*/ 
  /*res.render('admin/login')*/
})
router.get('/logout', (req, res) => {

  //res.redirect('/admin/login');
  res.render('admin/login')
})

 

router.get('/profile', (req, res) => {
console.log(req.session.admin);
console.log("prof....");
let adminsession=req.session.admin


  res.render('admin/profile',{adminsession});
  /*res.render('admin/login')*/
})
router.get('/addAdmin',async(req,res)=>{
  

  
  res.render('admin/addAdmin')
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})

router.get('/home', async(req, res) => {
  totalProducts =  await productHelpers.getTotalProducts()
    itemSaled=await productHelpers.getItemSaled()
    amount=await productHelpers.getTotalAmount()
  res.render('admin/home', { admin: true,totalProducts,itemSaled ,amount})
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})


router.get('/vendorManagement', (req, res) => {

  
  vendorHelpers.getAllvendors().then((vendors) => {
    res.render('admin/vendorManagement', { admin: true, vendors })

  })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})


router.get('/userManagement', (req, res) => {

  userHelpers.getActiveUsers().then((users) => {
    console.log(users);
    res.render('admin/userManagement', { admin: true, users })

  })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})

router.get('/categoryManagement', (req, res) => {

  categoryHelpers.getAllcategories().then((categories) => {
    res.render('admin/categoryManagement', { admin: true, categories })

  })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})


router.get('/addCategory', (req, res) => {
  res.render('admin/addCategory', { admin: true })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})
router.get('/addVendor', (req, res) => {
  res.render('admin/addVendor', { admin: true })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})
router.get('/addUser', (req, res) => {
  res.render('admin/addUser', { admin: true })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})
/*
router.post('/addUser',(req,res)=>{
  /*console.log(req.body)*/
/* console.log(req.files.image)*/
/*userHelpers.adduser(req.body,(id)=>{
   
   res.render("admin/addUser",{admin:true})
   console.log(id)
  
 })
   
 })*/
router.post('/addUser', async (req, res) => {
  await userHelpers.doSignup(req.body).then((response) => {
    console.log("hi sgnup")
    req.session.loggedIn = true
    req.session.user = response


    res.render("admin/addUser", { admin: true })
    console.log(id)

  })
})




router.post('/addCategory', (req, res) => {
  /*console.log(req.body)*/
  /* console.log(req.files.image)*/
  categoryHelpers.addCategory(req.body, (id) => {

    res.render("admin/categoryManagement", { admin: true, categories })
    console.log(id)

  })

})

router.get('/addProduct', (req, res) => {
  res.render('vendor/addProduct', { vendor: true })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})
router.post('/addProduct', (req, res) => {
  /*console.log(req.body)*/
  /* console.log(req.files.image)*/
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image
    console.log(id)
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render("vendor/addProduct", { vendor: true })
      } else {
        console.log(err)
      }
    })
  })

})

router.get('/addProduct', (req, res) => {
  res.render('vendor/addProduct', { vendor: true })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})
router.post('/addProduct', (req, res) => {
  /*console.log(req.body)*/
  /* console.log(req.files.image)*/
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image
    console.log(id)
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render("vendor/addProduct", { vendor: true })
      } else {
        console.log(err)
      }
    })
  })

})


   router.post('/addVendor',async(req,res)=>{
      
 await vendorHelpers.doSignup(req.body).then((id)=>{
  let image = req.files.image
  console.log("hi imageeee");
  console.log(image);

  image.mv('./public/vendor-images/' + id + '.jpg', (err) => {
    if (!err) {
      res.render("admin/addVendor", { admin: true })
    } else {
      console.log(err)
    }
  })
      console.log("hi sgnupvendor")
      req.session.vendorloggedIn=true
      req.session.vendor=response
      
    
      res.render("admin/addVendor",{admin:true})
      console.log(id)
  
    })
  })
  
  router.post('/addAdmin',async(req,res)=>{
      console.log("hi admin add admin post");
    await vendorHelpers.doSignupadmin(req.body).then((id)=>{
     let image = req.files.image
     console.log("hi imageeee");
     console.log(image);
   
     image.mv('./public/vendor-images/' + id + '.jpg', (err) => {
       if (!err) {
         res.render("admin/addAdmin", { admin: true })
       } else {
         console.log(err)
       }
     })
         console.log("hi sgnupadmin")
         req.session.adminloggedIn=true
         req.session.admin=response
         
       
         res.render("admin/addAdmin",{admin:true})
         console.log(id)
     
       })
     })


/*router.post('/addVendor', (req, res) => {
  console.log(req.body)
  console.log(req.files.image)
  vendorHelpers.addVendor(req.body, (id) => {
    let image = req.files.image
    console.log(id)
    image.mv('./public/vendor-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render("admin/addVendor", { admin: true })
      } else {
        console.log(err)
      }
    })
  })

})*/


router.get('/orderDetails', async (req, res) => {
  let orderedAllItems=await userHelpers.getOrderallProducts()

  res.render('admin/orderDetails', { admin: true, orderedAllItems })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})

router.get('/userDetails', async (req, res) => {
  let orders = await userHelpers.getUserOrders(req.session.user._id)
  res.render('admin/userDetails', { admin: true, orders })
  /*res.redirect('login');*/
  /*res.render('admin/login')*/
})















router.get('/editVendor/:id', async (req, res) => {
  let vendor = await vendorHelpers.getVendorDetails(req.params.id)
  console.log(vendor);
  res.render('admin/editVendor', { vendor })

})


router.post('/editVendor/:id', (req, res) => {
  let id = req.params.id
  vendorHelpers.updateVendor(req.params.id, req.body).then(() => {
    res.redirect('/admin/vendorManagement')
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/vendor-images/' + id + '.jpg')
    }
  })
})
router.get('/editAdmin', async (req, res) => {

  console.log("hi edit admin");
  let admin = await vendorHelpers.getAdminDetails(req.session.admin._id)
  console.log(admin);
  res.render('admin/editAdmin', { admin})

})


router.post('/editAdmin/:id', (req, res) => {
  let id = req.session.admin._id
  vendorHelpers.updateAdmin(id, req.body).then(() => {
    res.redirect('/admin/login')
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/vendor-images/' + id + '.jpg')
    }
  })
})
router.get('/editCategory/:id', async (req, res) => {
  let category = await categoryHelpers.getCategoryDetails(req.params.id)
  console.log(category);
  res.render('admin/editCategory', { admin: true, category })

})


router.get('/salesReportVendor/:id', async (req, res) => {
  let venSailedProducts = await userHelpers.getOrderProducts(req.params.id)
  res.render('admin/salesReportVendor', { vendor: req.session.vendor, venSailedProducts });
});


router.get('/blockVendor/:id', async(req, res) => {
 

  
    console.log("hi block vndor router");
    console.log(req.params.id);
    console.log("Success full blocked");
    await userHelpers.blockVendor(req.params.id).then(()=>{

      res.redirect('/admin/vendorManagement')
    
      
      console.log("hi user help");
    })
 })

 router.get('/unblockVendor/:id', async(req, res) => {
 

  
  console.log("hi unblock vndor router");
  console.log(req.params.id);
  console.log("Success full blocked");
 await userHelpers.unblockVendor(req.params.id).then(()=>{

    
      res.redirect('/admin/vendorManagement')
  
    
    
  })
})

router.get('/blockUser/:id', async(req, res) => {
 

  console.log("hi block user router");
  console.log(req.params.id);
  console.log("Success full user blocked");
  await userHelpers.blockUser(req.params.id).then(()=>{
    console.log("hi user help");
    res.redirect('/admin/userManagement')
  })


 



})
router.get('/unblockUser/:id', async(req, res) => {
  
  console.log("hi unblock user router");
  console.log(req.params.id);
  console.log("Success full unblocked");
 await userHelpers.unblockUser(req.params.id).then(()=>{
    console.log("hi user help");
    res.redirect('/admin/userManagement')
  })
})


router.post('/editCategory/:id', async (req, res) => {
  let id = req.params.id
  await categoryHelpers.updateCategory(req.params.id, req.body).then(() => {
    res.redirect('/admin/categoryManagement', { admin: true, categories })

  })
})


router.get('/deleteVendor', (req, res) => {
  venId = req.query.id
  console.log(venId);
  console.log(req.query.name);
  vendorHelpers.deleteVendor(venId).then((response) => {
    res.redirect('/admin/vendorManagement')
  })

})
router.get('/deleteUser', (req, res) => {
  useId = req.query.id
  console.log(useId);
  console.log(req.query.name);
  userHelpers.deleteUser(useId).then((response) => {
    res.redirect('/admin/userManagement')
  })

})

router.get('/deleteCategory', (req, res) => {
  catId = req.query.id
  console.log(catId);
  console.log(req.query.name);
  categoryHelpers.deleteCategory(catId).then((response) => {
    res.redirect('/admin/categoryManagement')
  })

})



router.get('/editUser/:id', async (req, res) => {
  let user = await userHelpers.getUserDetails(req.params.id)
  console.log("hi userrrrr");
  console.log(user);
  res.render('admin/editUser', { user })

})


router.post('/editUser/:id', (req, res) => {
  let id = req.params.id
  userHelpers.updateUser(req.params.id, req.body).then(() => {
    res.redirect('/admin/userManagement')

  })
})

module.exports = router;
