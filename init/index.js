const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGODB_URL='mongodb://127.0.0.1:27017/wanderlust';
main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGODB_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner:"689a2b3f9efc9ff0df507d01"}));
    await Listing.insertMany(initData.data);
    console.log("data initalised successfully")
};

initDB();
