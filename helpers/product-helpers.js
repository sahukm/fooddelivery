
var db = require("../config/connection")
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const { response } = require("express")


module.exports = {

    addProduct: (product, callback) => {
        console.log(product)
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            /*console.log(data*/
            callback(data.ops[0]._id)
        })

    },
    addAdmin: (admin, callback) => {
        console.log(admin)
        db.get().collection(collection.ADMIN_COLLECTION).insertOne(admin).then((data) => {
            /*console.log(data*/
            callback(data.ops[0]._id)
        })

    }
,

    getAllproducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    getVendorAllProducts: (vendor) => {
        console.log(vendor);

        return new Promise(async (resolve, reject) => {

            let vendorProducts = await db.get().collection(collection.PRODUCT_COLLECTION)
                .find({ vendorId: vendor }).toArray()
            resolve(vendorProducts)
            console.log("hivend productsssss")
            console.log(vendorProducts);
        })
    },
    getCategoryAllProducts: (categoryId) => {
        console.log(category);

        return new Promise(async (resolve, reject) => {

            let categoryProducts = await db.get().collection(collection.PRODUCT_COLLECTION)
                .find({ category: categoryId }).toArray()
            resolve(categoryProducts)
            console.log("hivend  cateogery productsssss")
            console.log(categoryProducts);
        })
    },

    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(proId) }).then((response) => {
                console.log(response);
                resolve(response)

            })
        })
    },

    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    getAdminDetails: () => {
        return new Promise(async(resolve, reject) => {
          await  db.get().collection(collection.ADMIN_COLLECTION).find({'name':'shahana'}).then((admin) => {
                resolve(admin)
            })
        })
    },
    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(proId) }, {
                $set: {
                    name: proDetails.name,
                    shopname: proDetails.shopname,
                    category: proDetails.category,
                    price: proDetails.price,

                }
            }).then((response) => {
                resolve()
            })
        })
    },
    updateAdmin: (admId, admDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_COLLECTION).updateOne({ _id: objectId(admId) }, {
                $set: {
                    name: admDetails.name,
                    place: admDetails.place,
                    email: admDetails.email,
                    phonenumber: admDetails.phonenumber

                }
            }).then((response) => {
                resolve()
            })
        })
    },
    getTotalProducts: () => {
        return new Promise(async (resolve, reject) => {
            let totalProducts = await db.get().collection(collection.PRODUCT_COLLECTION).count()
            resolve(totalProducts)
        })


    },
    getItemSaled: () => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let saledproducts = await db.get().collection(collection.ORDER_COLLECTION).find({ status: "placed" }).toArray()
            if (saledproducts)
                count = saledproducts.length
            resolve(count)
            console.log(count);
        })

    },
    getTotalAmount:()=>{
        return new Promise(async(resolve,reject)=>{
            let total=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                
    
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity',
                        totalAmount:'$totalAmount'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]},totalAmount:1
                    }
                },
    
                {
                    $group:{
                        _id:null,
            
                        total:{$sum:'$totalAmount'}
                    }
                }
                /*{
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        let: {prodList:'$products'},
    
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$prodList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
    
    
    
                    }
                }*/
            ]).toArray()
    
        
            resolve(total[0].total)
            console.log(total[0].total);
        })
    
    
    },
    getVendorTotalProducts: (vendor) => {
        console.log(vendor);

        return new Promise(async (resolve, reject) => {

            let vendorProducts = await db.get().collection(collection.PRODUCT_COLLECTION)
                .find({ vendorId: vendor }).toArray()
            resolve(vendorProducts.length)
            console.log("hivend productsssss")
            console.log(vendorProducts.length);
        })
    },
    getVendorSaledProducts:(venId)=>{
        console.log(objectId(venId));
         return new Promise(async(resolve,reject)=>{
            let vendorSaledItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
               
                {
                    $unwind:'$products'
                }
               /*{
                    $project:{
                    
                    
                    product:'$products.product'
                        }
                },  
                
                {
                    $unwind:'$product'
                },   
    
                {
                    $project:{
                    
                    name:'$product.name',
                   vendorId :'$product.vendorId'
                        }
                }*/
                   
                ,
                
                
                  { 
                      $match:{  "products.product.vendorId" :venId,"status":"placed"}
                
                 }
                ,
              {
                    $unwind:'$products'
                },
                
    
                {   
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity',
                        totalAmount:'$totalAmount',
                        paymentMethod:'$paymentMethod',
                        date:'$date',
                        status:'$status'
    
    
                    }
                    
                },
                { $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
                },
                { $project:{
                        
                    item:1,product:{$arrayElemAt:['$product',0]},quantity:1,totalAmount:1,paymentMethod:1,date:1,status:1
                    }
                }
            ]).toArray()
            resolve(vendorSaledItems.length)
            console.log("vendor saled items");
             console.log(vendorSaledItems.length);
        })
    },
    getVendorTotalAmount:(venId)=>{
        return new Promise(async(resolve,reject)=>{
            let total=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                
    
                {
                    $unwind:'$products'
                },
                
                { 
                    $match:{  "products.product.vendorId" :venId}
              
               },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity',
                        totalAmount:'$totalAmount',
                        price:'$product.price'

                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]},totalAmount:1
                    }
                },
                
            {
                $group:{
                    _id:null,
        
                    total:{$sum:{$multiply:['$quantity','$product.price']}}
                }
            }
    
               /* {
                    $group:{
                        _id:null,
            
                        total:{$sum:'$totalAmount'}
                    }
                }*/
                /*{
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        let: {prodList:'$products'},
    
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$prodList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
    
    
    
                    }
                }*/
            ]).toArray()
    
        
            resolve(total[0].total)
            console.log(total[0].total);
        })
    
    
    },
    getVendorTotalOrders:(venId)=>{
        
        return new Promise(async (resolve, reject) => {
            return new Promise(async(resolve,reject)=>{
                let vendororderItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                   
                    {
                        $unwind:'$products'
                    }
                   /*{
                        $project:{
                        
                        
                        product:'$products.product'
                            }
                    },  
                    
                    {
                        $unwind:'$product'
                    },   
        
                    {
                        $project:{
                        
                        name:'$product.name',
                       vendorId :'$product.vendorId'
                            }
                    }*/
                       
                    ,
                    
                    
                      { 
                          $match:{  "products.product.vendorId" :venId}
                    
                     }
                    ,
                  {
                        $unwind:'$products'
                    },
                    
        
                    {   
                        $project:{
                            item:'$products.item',
                            quantity:'$products.quantity',
                            totalAmount:'$totalAmount',
                            paymentMethod:'$paymentMethod',
                            date:'$date',
                            status:'$status',
                            price:'$product.price'
        
        
                        }
                        
                    },
                    { $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                    },
                    { $project:{
                            
                        item:1,product:{$arrayElemAt:['$product',0]},quantity:1,totalAmount:1,paymentMethod:1,date:1,status:1
                        }
                    }
        
                   
                ]).toArray()
                resolve(vendororderItems.length)
                console.log("end of sales vendororderitems lenghth");
                 console.log(vendororderItems.length);
            })
        })

    }
        
}


