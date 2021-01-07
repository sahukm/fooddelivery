
var db = require("../config/connection")
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt')
const { response } = require("express")


module.exports={

    addProduct:(product,callback)=>{
        console.log(product)
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            /*console.log(data*/
            callback(data.ops[0]._id)
        })

    },

    
    getAllproducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    getVendorAllProducts:(vendor)=>{
        console.log(vendor);
        
        return new Promise(async(resolve,reject)=>{
            
            let vendorProducts=await db.get().collection(collection.PRODUCT_COLLECTION)
            .find({vendorId:vendor}).toArray()
            resolve(vendorProducts)
            console.log("hivend productsssss")
            console.log(vendorProducts);
        })
    },
    getCategoryAllProducts:(categoryId)=>{
        console.log(category);
        
        return new Promise(async(resolve,reject)=>{
            
            let categoryProducts=await db.get().collection(collection.PRODUCT_COLLECTION)
            .find({category:categoryId}).toArray()
            resolve(categoryProducts)
            console.log("hivend  cateogery productsssss")
            console.log(categoryProducts);
        })
    },

    deleteProduct:(proId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
               console.log(response);
                resolve(response)
    
            })
        })
    },
    
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    name:proDetails.name,
                    shopname:proDetails.shopname,
                    category:proDetails.category,
                    price:proDetails.price,
                
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
    
    

}