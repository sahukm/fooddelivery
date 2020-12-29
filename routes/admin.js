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



router.get('/login', function (req, res, next) {
  console.log('sdsdsdshi hi');

  res.render('admin/login', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
  console.log('hi login')
  if ((req.body.Name === adminDetais.Name) && (req.body.Password === adminDetais.Password)) {

    console.log('true');
    console.log(req.body.Name);
    console.log(req.body.Password);

    res.render('admin/home', { admin: true });
  }
  else {
    console.log('false');

    /*res.render('admin/else');*/
    req.session.loginErr = "Invalid username or password"
    res.render('admin/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }


})
router.get('/logout', (req, res) => {

  res.redirect('/admin/login');
  /*res.render('admin/login')*/
})
router.get('/home', (req, res) => {
  res.render('admin/home', { admin: true })
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

  userHelpers.getAllusers().then((users) => {
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
  let products = await userHelpers.getCartProducts(req.session.user._id)

  res.render('admin/orderDetails', { admin: true, products })
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
router.get('/editCategory/:id', async (req, res) => {
  let category = await categoryHelpers.getCategoryDetails(req.params.id)
  console.log(category);
  res.render('admin/editCategory', { admin: true, category })

})


router.get('/salesReportVendor/:id', async (req, res) => {
  let venSailedProducts = await userHelpers.getOrderProducts(req.params.id)
  res.render('admin/salesReportVendor', { vendor: req.session.vendor, venSailedProducts });
});

router.get('/blockUser/:id', (req, res) => {
  console.log(req.session)
  let userId = ObjectID(req.params.id)
  console.log("hi block");

  req.session.unBlock = false


  



 



})
router.get('/unblockUser/:id', (req, res) => {
  console.log(req.session)
  let userId = ObjectID(req.params.id)

  console.log(userId);
  req.session.unBlock = true



  console.log(req.session.unBlock)
  console.log("hi unbloch");


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
