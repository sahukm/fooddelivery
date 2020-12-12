
var db = require("../config/connection")
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt')
const { response } = require("express")


module.exports={

    addVendor:(vendor,callback)=>{
        console.log(vendor)
        db.get().collection('vendor').insertOne(vendor).then((data)=>{
            /*console.log(data*/
            callback(data.ops[0]._id)
        })
    },
    getAllvendors:()=>{
        return new Promise(async(resolve,reject)=>{
            let vendors=await db.get().collection(collection.VENDOR_COLLECTION).find().toArray()
            resolve(vendors)
        })
    },

    deleteVendor:(venId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.VENDOR_COLLECTION).removeOne({_id:objectId(venId)}).then((response)=>{
               console.log(response);
                resolve(response)
    
            })
        })
    },
    
    getVendorDetails:(venId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENDOR_COLLECTION).findOne({_id:objectId(venId)}).then((vendor)=>{
                resolve(vendor)
            })
        })
    },
    updateVendor:(venId,venDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENDOR_COLLECTION).updateOne({_id:objectId(venId)},{
                $set:{
                    name:venDetails.name,
                    
                    shopname:venDetails.shopname,
                
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
    
    

}