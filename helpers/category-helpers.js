var db = require("../config/connection")
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt')
const { response } = require("express")

module.exports={

    addCategory:(category,callback)=>{
        console.log(category)
        db.get().collection('category').insertOne(category).then((data)=>{
            /*console.log(data*/
            callback(data.ops[0]._id)
        })
    },
    getAllcategories:()=>{
        return new Promise(async(resolve,reject)=>{
            let categories=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(categories)
        })
    },

    deleteCategory:(catId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).removeOne({_id:objectId(catId)}).then((response)=>{
               console.log(response);
                resolve(response)
    
            })
        })
    },
    
    getCategoryDetails:(catId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:objectId(catId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateCategory:(catId,catDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:objectId(catId)},{
                $set:{
                    name:catDetails.name
                    
                    
                
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
    
    

}