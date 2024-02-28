// const error = require('console');
const mongoose = require('mongoose');
// const models = require('../models/models')


 mongoose.connect("mongodb://127.0.0.1:27017/gasc").then(()=>{
    console.log("Connected");
}).catch((err)=>{
    console.log(err);
})


//module.exports = mongoose;