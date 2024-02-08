const mongoose = require('mongoose');

const login_sch=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    pass:{
        type:String,
        require:true
    },
    cpass:{
        type:String,
        require:true
    }
});
const models = mongoose.model('login',login_sch);
module.exports=models