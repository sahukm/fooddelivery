const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=function(done){
    //const url='mongodb://localhost:27017'
  const url = "mongodb+srv://shahana:eshanali@skmcluster.spxff.mongodb.net/test"
    //var url           =    process.env.MONGODB_URI;
   // const url='mongodb+srv://shahanafaisal:eshan@newcluster.v2pix.mongodb.net/test?authSource=admin&replicaSet=atlas-10y7ti-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
    const dbname='fooddelivery'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()

    })

   
}
module.exports.get=function(){
    return state.db
}