

var db = require("../config/connection")
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require("express")
var objectId=require('mongodb').ObjectId

module.exports={
   
    doSignup:(vendorData)=>{
        return new Promise(async(resolve,reject)=>{
            vendorData.Password=await bcrypt.hash(vendorData.Password,10)
            db.get().collection(collection.VENDOR_COLLECTION).insertOne(vendorData).then((data)=>{
                console.log(data)
                resolve(data.ops[0]._id)
            })
        })
},

doLogin:(vendorData)=>{
    return new Promise(async(resolve,reject)=>{
         let loginStatus=false
         let response={}
        let vendor=await db.get().collection(collection.VENDOR_COLLECTION).findOne({Name:vendorData.Name})
    if(vendor){
        bcrypt.compare(vendorData.Password,vendor.Password).then((status)=>{
            if(status)
            {
                console.log("login success")
                response.vendor=vendor
                response.status=true
                resolve(response)
    
    
            }
            else{
                console.log("login failed");
                resolve({status:false})
            }
        })
    
    }
    else{
        console.log('login failed 1213');
        resolve({status:false})
    }
    
    })
    },

 
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