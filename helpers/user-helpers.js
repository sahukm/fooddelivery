var db = require("../config/connection")
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require("express")
var objectId = require('mongodb').ObjectId
const Razorpay = require('razorpay')
const { resolve } = require("path")
var instance = new Razorpay({
    key_id: 'rzp_test_TZdDL7Szmwn5In',
    key_secret: 'JuOfBkWxquL7P7GejkFot9Gt'
});



module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                console.log(data)
                resolve(data.ops[0])
            })
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Name: userData.Name })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("login success")
                        response.user = user
                        response.status = true
                        resolve(response)


                    }
                    else {
                        console.log("login failed");
                        resolve({ status: false })
                    }
                })

            }
            else {
                console.log('login failed 1213');
                resolve({ status: false })
            }

        })
    },
    doLoginAdmin: (adminData) => {
        console.log(adminData);
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ name: adminData.Name })
            console.log("hi.....admin...");
            console.log(admin);
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
                        console.log("login success")
                        response.admin = admin
                        response.status = true
                        resolve(response)


                    }
                    else {
                        console.log("login failed");
                        resolve({ status: false })
                    }
                })

            }
            else {
                console.log('login failed 1213');
                resolve({ status: false })
            }

        })
    },


    addtoCart: (proId, userId) => {
        let proObj = {
            item: objectId(proId),

            quantity: 1
        }

        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).
                findOne({ user: objectId(userId) })
            if (userCart) {
                let proExist = userCart.products.findIndex(product => product.item == proId)
                console.log(proExist);
                if (proExist != -1) {
                    db.get().collection(collection.CART_COLLECTION).
                        updateOne({ user: objectId(userId) }, { 'products.item': objectId(proId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then(() => {
                            resolve()
                        })
                } else {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) },
                        {

                            $push: { products: proObj }

                        }
                    ).then((response) => {
                        resolve()
                    })
                }
            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    removeProduct: (details) => {
        console.log("reached user helpers");
        console.log(details);
        console.log("after detais");
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).
                findOne({ user: objectId(details.user) })

            console.log("hi usr cart");
            console.log(userCart);
            console.log("prod array..");
            console.log(userCart.products);




            if (userCart) {
                let isExistingProduct = userCart.products.findIndex(product => product.item == details.product)
                console.log(isExistingProduct);
                if (isExistingProduct >= 0) {
                    /*let newProductsArray=  userCart.products.splice(isExistingProduct, 1);*/
                    userCart.products.splice(isExistingProduct, 1);


                    console.log("after splice..");
                    /*console.log(newProductsArray);*/

                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(details.user) },
                        { $set: { products: userCart.products } }).then((response) => {
                            console.log(response);
                            resolve(response)

                        })
                    /*db.get().collection(collection.CART_COLLECTION).deleteOne( { "products.item" : objectId(isExistingProduct) } ).then((response)=>{
            
                        console.log(response);
                        resolve(response)*
               
            
                    })*/

                    /*)let newProductsArray=  userCart.products.splice(isExistingProduct, 1);
                  
              
                   console.log("after splice..");
                   console.log(newProductsArray);
                    /*db.get().collection(collection.CART_COLLECTION).update({'products':userCart.products},
                    {$set:{'products':newProductsArray}}).then((response)=>{
                          console.log(response);
                           resolve(response)
                  
                       })*/


                }
            }
        })
    },

    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {

                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

                /*  {
                      $lookup:{
                          from:collection.PRODUCT_COLLECTION,
                          let:{prodList:'$products'},
                          pipeline:[
                              {
                                  $match:{
                                      $expr:{
                                          $in:['$_id',"$$prodList"]
                                          
                                      }
                                  }
                              }
                          ],
                          as:'cartItems'
                      }
                  }*/

            ]).toArray()
            console.log(cartItems[0].products);
            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },
    changeProductQuantity: (details) => {
        console.log("hi change Product ....");
        console.log(details);
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)

        return new Promise((resolve, reject) => {
            if (details.count == -1 && details.quantity == 1) {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: objectId(details.cart) }, {
                        $pull: { products: { item: objectId(details.product) } }
                    }).then((response) => {

                        resolve({ removeProduct: true })
                    })


            } else {

                db.get().collection(collection.CART_COLLECTION).
                    updateOne({ _id: objectId(details.cart), 'products.item': objectId(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }
                        }
                    ).then((response) => {
                        resolve({ status: true })
                    })


            }

        })


    },

    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },

                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },

                {
                    $group: {
                        _id: null,

                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
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
        })


    },
    placeOrder: (order, products, total) => {
        return new Promise((resolve, reject) => {
            console.log("hi sheza placeorder");
            console.log(order, products, total);
            let status = order['payment-method'] === 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    name: order.name,
                    mobile: order.mobile,
                    address: order.address,
                    email: order.email,
                    pincode: order.pincode
                },
                userId: objectId(order.userId),
                paymentMethod: order['payment-method'],
                products: products
                ,
                totalAmount: total,
                status: status,
                date: new Date()
            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collection.CART_COLLECTION).removeOne({ user: objectId(order.userId) })
                resolve(response.ops[0]._id)
                /* resolve()*/
            })

        })


    },

    adduser: (user, callback) => {
        console.log(user)
        db.get().collection('user').insertOne(user).then((data) => {
            /*console.log(data*/
            callback(data.ops[0]._id)
        })
    },
    getAllusers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    getActiveUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find({ activeStatus: "true" }).toArray()
            resolve(users)
            console.log(users);
            console.log("active users...");
        })
    },
    deleteUser: (useId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: objectId(useId) },
                    {
                        $set: {
                            activeStatus: false
                        }
                    }
                ).then(() => {
                    resolve()

                })
        })
    },


    getUserDetails: (useId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(useId) }).then((user) => {
                resolve(user)
            })
        })
    },
    getUserBlockDetails: (useId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(useId) }).then((user) => {
                resolve(user.blockStatus)
            })
        })
    },

    updateUser: (useId, useDetails) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(useId) }, {
                $set: {
                    Name: useDetails.Name,

                    Email: useDetails.Email,

                    phonenumber: useDetails.phonenumber

                }
            }).then((response) => {
                resolve()
            })
        })
    }
    ,

    addVendor: (vendor, callback) => {
        console.log(vendor)
        db.get().collection('vendor').insertOne(vendor).then((data) => {
            /*console.log(data*/
            callback(data.ops[0]._id)
        })
    },
    getAllvendors: () => {
        return new Promise(async (resolve, reject) => {
            let vendors = await db.get().collection(collection.VENDOR_COLLECTION).find().toArray()
            resolve(vendors)
        })
    },

    deleteVendor: (venId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENDOR_COLLECTION).removeOne({ _id: objectId(venId) }).then((response) => {
                console.log(response);
                resolve(response)

            })
        })
    },

    getVendorBlockDetails: (venId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENDOR_COLLECTION).findOne({ _id: objectId(venId) }).then((vendor) => {
                resolve(vendor.blockStatus)
            })
        })
    },
    getVendorDetails: (venId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENDOR_COLLECTION).findOne({ _id: objectId(venId) }).then((vendor) => {
                resolve(vendor)
            })
        })
    },
    updateVendor: (venId, venDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENDOR_COLLECTION).updateOne({ _id: objectId(venId) }, {
                $set: {
                    name: venDetails.name,

                    shopname: venDetails.shopname,

                }
            }).then((response) => {
                resolve()
            })
        })
    }

    ,
    getUserOrders: (userId) => {
        console.log("hi user idddddddd");
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            console.log(userId);
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ userId: objectId(userId) }).toArray()
            console.log(orders);
            resolve(orders)
        })
    },
    getAllOrders: () => {
        console.log("hi all orders");

        return new Promise(async (resolve, reject) => {

            let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            console.log(orders);
            resolve(orders[0]._id)
        })
    },
    getVendorOrders: (products, vendor) => {

        return new Promise(async (resolve, reject) => {
            console.log(vendor);
            let allOrderProducts = await db.get().collection(collection.ORDER_COLLECTION).find({ shopname: objectId(userId) }).toArray()
            console.log(orders);
            resolve(orders)
        })
    }
    ,
    getOrderProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(orderId) }
                },
                {
                    $unwind: '$products'
                },
                {

                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',

                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

                /*  {
                      $lookup:{
                          from:collection.PRODUCT_COLLECTION,
                          let:{prodList:'$products'},
                          pipeline:[
                              {
                                  $match:{
                                      $expr:{
                                          $in:['$_id',"$$prodList"]
                                          
                                      }
                                  }
                              }
                          ],
                          as:'cartItems'
                      }
                  }*/

            ]).toArray()
            console.log("hi userhelper order");
            console.log(orderItems);
            console.log("order products above....");
            resolve(orderItems)
        })
    },
    getOrderallProducts: () => {
        return new Promise(async (resolve, reject) => {
            let orderedAllItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([


                {
                    $unwind: '$products'
                },
                {

                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        totalAmount: '$totalAmount',
                        paymentMethod: '$paymentMethod',
                        date: '$date',
                        status: '$status'


                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, product: { $arrayElemAt: ['$product', 0] }, quantity: 1, totalAmount: 1, paymentMethod: 1, date: 1, status: 1

                    }
                }
                /*  {
                      $lookup:{
                          from:collection.PRODUCT_COLLECTION,
                          let:{prodList:'$products'},
                          pipeline:[
                              {
                                  $match:{
                                      $expr:{
                                          $in:['$_id',"$$prodList"]
                                          
                                      }
                                  }
                              }
                          ],
                          as:'cartItems'
                      }
                  }*/

            ]).toArray()
            console.log("hi adminsales order");
            console.log(orderedAllItems);
            console.log("order products above....");
            resolve(orderedAllItems)
        })
    },

    getVendorOrderProducts: (venId) => {
        console.log(objectId(venId));
        return new Promise(async (resolve, reject) => {
            let vendororderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([

                {
                    $unwind: '$products'
                }


                ,


                {
                    $match: { "products.product.vendorId": venId }

                }
                ,
                {
                    $unwind: '$products'
                },


                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                      
                        paymentMethod: '$paymentMethod',
                        date: '$date',
                        status: '$status',
                        price: '$product.price',
                        totalAmount: quantity*price


                    }

                },

                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {

                        item: 1, product: { $arrayElemAt: ['$product', 0] }, 
                        quantity: 1, totalAmount: 1, paymentMethod: 1, date: 1, status: 1
                    }
                }


            ]).toArray()
            resolve(vendororderItems)
            console.log("end of sales vendororderitems");
            console.log(vendororderItems);
        })
    },




    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            resolve(cart.products)
        })
    }
    ,
    generateRazorpay: (orderId, total) => {
        console.log(orderId);
        return new Promise((resolve, reject) => {

            var options = {
                amount: total * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("New order :", order);

                    resolve(order)
                }
            });


        })
    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', 'JuOfBkWxquL7P7GejkFot9Gt')
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }

        })
    },
    blockVendor: (vendorId) => {
        console.log(" vendor block usrhlp status");

        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENDOR_COLLECTION)
                .updateOne({ _id: objectId(vendorId) },
                    {
                        $set: {
                            blockStatus: false
                        }
                    }
                ).then(() => {
                    resolve()

                })
        })
    },
    unblockVendor: (vendorId) => {
        console.log(" vendor block usrhlp status");

        return new Promise((resolve, reject) => {
            db.get().collection(collection.VENDOR_COLLECTION)
                .updateOne({ _id: objectId(vendorId) },
                    {
                        $set: {
                            blockStatus: true
                        }
                    }
                ).then(() => {
                    resolve()

                })
        })
    },
    blockUser: (userId) => {
        console.log(" user block usrhlp status");

        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: objectId(userId) },
                    {
                        $set: {
                            blockStatus: false
                        }
                    }
                ).then(() => {
                    resolve()

                })
        })
    },
    unblockUser: (userId) => {


        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: objectId(userId) },
                    {
                        $set: {
                            blockStatus: true
                        }
                    }
                ).then(() => {
                    resolve()

                })
        })
    },
    changePaymentStatus: (orderId) => {
        console.log("payment status");
        console.log(orderId);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION)
                .updateOne({ _id: objectId(orderId) },
                    {
                        $set: {
                            status: 'placed'
                        }
                    }
                ).then(() => {
                    resolve()

                })
        })
    },
    changePaymentStatusCancel: (orderId) => {
        console.log(orderId);
        console.log("cancell");
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION)
                .updateOne({ _id: objectId(orderId) },
                    {
                        $set: {
                            status: 'Cancelled'
                        }
                    }
                ).then(() => {
                    resolve()

                })
        })
    }



}