const express = require('express');
const bp = require('body-parser');
const app = express();
const data = require('../database/database');
const ba_tamil = require('../models/models');
const setLimit = require('../models/models')

const login_data=require('../models/login');
const mongoose = require('mongoose');

const uidMiddleMapping = {
    'BA Tamil':'TL', 'BA English':'EL','B Com':'CO','B Com CA':'CC','B Com PA':'CP','B Com BI':'BI','B Com BA':'CB','B Com IT':'CI','BBA':'BA','BSC Maths':'MA','BSC Physics':'PH','BSC CS':'CS','BSC IT':'IT','BSC CT':'CT','BCA':'CA','BSC IOT':'OT','BSC CS AIDS':'AI','BSC Physical Education':'PE','MA Tamil':12,'MA English':10,'M Com':'03','MSC CS':'06','MSC IT':'09','MSC Physics':'08','MSC Chemistry':11,'MBA':13,'PGDCA':'05','CA Foundation':'CF'
};
const options = ['Select Course','BA Tamil', 'BA English','B Com','B Com CA','B Com PA','B Com BI','B Com BA','B Com IT','BBA','BSC Maths','BSC Physics','BSC CS','BSC IT','BSC CT','BCA','BSC IOT','BSC CS AIDS','BSC Physical Education','MA Tamil','MA English','M Com','MSC CS','MSC IT','MSC Physics','MSC Chemistry','MBA','PGDCA','CA Foundation'];
    const MAX_DOCUMENTS_PER_COLLECTION  =  async (req,res)=>{
        const setting = await setLimit.find();
        console.log(setting);
        return setting.limit;
    }

// exports.admin = async (req,res)=>{
    
//     res.render('admin', {  });
// }
exports.update_limit = async (req,res)=>{
    const newLimit = req.body.newLimit;
    if (newLimit && !isNaN(newLimit)) {
        await setLimit.findOneAndUpdate({},{limit:newLimit});
        res.render('home');
    } else {
        res.status(400).send("Invalid limit provided.");
    }
}
const saveDocument = async (document) => {
    try {
        await document.save();
        console.log('Document saved successfully.');
    } catch (error) {
        console.error('Error saving document:', error);
        throw error; 
    }
};
exports.login=async(req,res)=>{
    res.render('login',{layout:false})
}
exports.login_fill=async(req,res)=>{
    const name=req.body.username;
    const pass=req.body.password;
    const user=await login_data.findOne({name});
    if (!user) {
     res.send('User not found');
    }
    if (name === 'admin') {
        const setting = await setLimit.find();
        console.log(setting);
        res.render('admin',{layout:false,setting});
        return;
    }
    if (user.pass === pass) {
        res.render('home');
    } else {
     res.send('Invalid password');
    }
    
}
exports.sign_form=async(req,res)=>{
    res.render('singup',{layout:false});
}
exports.signdata=async(req,res)=>{
    const data={
        name:req.body.username,
        pass:req.body.password,
        cpass:req.body.cpassword
    }
const insert=await login_data.insertMany([data]);
console.log(insert);
res.render('login')
}
 exports.home = async(req,res)=>{
    res.render('home');
 }
   
 exports.new = async(req,res)=>{
   
  
   const options = ['Select Course','BA Tamil', 'BA English','B Com','B Com CA','B Com PA','B Com BI','B Com BA','B Com IT','BBA','BSC Maths','BSC Physics','BSC CS','BSC IT','BSC CT','BCA','BSC IOT','BSC CS AIDS','BSC Physical Education','MA Tamil','MA English','M Com','MSC CS','MSC IT','MSC Physics','MSC Chemistry','MBA','PGDCA','CA Foundation'];
  res.render('new-admission', { options: options,uid:"nodata", });
 }
 exports.new2 = async(req,res)=>{
    var uid=req.params.id;
     res.render('new-admission', { options: options,uid});
  }
 exports.transfer = async(req,res)=>{
    res.render('transfer-admission',{data:null,options:options});
 }

 exports.cancel = async(req,res)=>{
    res.render('cancel')
 }
 
 exports.report = async(req,res)=>{
    res.render('reports',{options:options});
 }
 exports.courseadd=async(req,res)=>{
    var name=req.body.course;
    var st=req.body.short;
    var fees=req.body.fees;
    // options.push(name)
    res.send({name,st,fees});
 }

 function getCurrentYearLastTwoDigits() {
    var currentDate= new Date();
    return currentDate.getFullYear().toString().slice(-2);
}

exports.dept = async (req, res) => {
    const transformInputToCollectionName = (input) => {
        return input.toLowerCase().replace(/\s+/g, '_');
    };
    const currentYearLastTwoDigits = getCurrentYearLastTwoDigits();
    const searchName = req.body.cname;
    const collectionName = transformInputToCollectionName(searchName);

    // Dynamically access or define a collection based on the collectionName
    const CollectionModel = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({ any: mongoose.Schema.Types.Mixed }, { strict: false }));

    try {
        // Check the current count of documents in the collection
        const currentDocumentCount = await CollectionModel.countDocuments();
        if (currentDocumentCount >= MAX_DOCUMENTS_PER_COLLECTION()) {
            // If the limit is reached, prevent adding a new document and inform the user
            return res.status(400).send(`The limit of ${MAX_DOCUMENTS_PER_COLLECTION()} documents has been reached for the ${searchName} collection.`);
        }

        var total = currentDocumentCount + 1;
        const middlePart = uidMiddleMapping[searchName];
        var uid = `${currentYearLastTwoDigits}-${middlePart}-${total.toString().padStart(3, '0')}`;

        // Assuming you have the rest of your document fields ready to be saved
        const newDocumentData = {
            date: req.body.date,
            cname: req.body.cname,
            token: total,
            s_name: req.body.s_name,
            uid:uid,
            fees: req.body.fees,
            in_dept:true,
            balance:req.body.balance,
            cancel:false
        };
        const newDocument = new CollectionModel(newDocumentData);

        await saveDocument(newDocument);
        // After successful insertion, you can redirect or respond as needed
        res.redirect(`/new_student/${uid}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data');
    }
};

async function sound(col) {
    var value = col;
    const model = mongoose.model(value);
    var test = await model.find();
    console.log(test.length);
}

 exports.getCollectionCount = async (req, res) => {
    const collectionName = req.query.collectionName.toLowerCase().replace(/\s+/g, '_');
    const model = mongoose.model(collectionName);
    try {
        const count = await model.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).send(error.toString());
    }
};

exports.get_uid = async(req,res)=>{
    const fetch=req.body.uid;
    var found=false;
   const models=mongoose.modelNames();
for(var dept of models){
    var dept_model=mongoose.model(dept);
    if (found) {
        break;
    }
    else{
   var data= await dept_model.findOne({uid:fetch,in_dept:true});
   console.log(data);
  
   if (data!==null) {
    found=true;
    res.render('transfer-admission',{data,options});
     }
       }
   }
  if (!found) {
    res.render('transfer-admission',{data:'no data',options});
    
  }
   
}



exports.transfer_admission = async (req, res) => {
   
    const transformInputToCollectionName = (input) => {
        if (!input) {
            throw new Error('Course name is undefined');
        }
        return input.toLowerCase().replace(/\s+/g, '_');
    };

   
    const uid = req.body.uid;
    const sourceCourseName = req.body.o_cname;
    const destCourseName = req.body.cname; 

   
    const sourceCourse = mongoose.model(transformInputToCollectionName(sourceCourseName));
    const destCourse = mongoose.model(transformInputToCollectionName(destCourseName));

    const searchName = req.body.cname;
    const collectionName = transformInputToCollectionName(searchName);
    const existingModels = mongoose.connection.modelNames(collectionName);
    let model;
    if (existingModels.includes(collectionName)) {
        model = mongoose.model(collectionName);
    } else {
        const schema = new mongoose.Schema({}); 
        model = mongoose.model(collectionName, schema);
    }

    try {
        // await transferStudent(uid, sourceCourse, destCourse);
        await sourceCourse.updateOne({"uid":uid,"in_dept":true},{$set:{"in_dept":false}})

        const newDocument = new model({
            date: req.body.date,
            cname: req.body.cname,
            token: req.body.token,
            s_name: req.body.s_name,
            uid: req.body.uid,
            fees: req.body.fees,
            in_dept:true,
            cancel:false
        });
        await saveDocument(newDocument)

        sound(collectionName);

        res.redirect('/transfer-admission');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during transfer');
    }
};



exports.searchAndDateFind = async (req, res) => {
    try {
        
       const transformInputToCollectionName = (input) => {
         return input.toLowerCase().replace(/\s+/g, '_');
       }
        const { dept, date } = req.body;
        const collectionName = transformInputToCollectionName(dept);

        let data = {
            number_of_entries: 0,
            number_of_entries_in_dept: 0,
            in_department_entries: [],
            totalData: []
        };

        // Search by department
        if (collectionName && mongoose.connection.modelNames().includes(collectionName)) {
            const Model = mongoose.model(collectionName);
            const totalData = await Model.find({}, { uid: 1, in_dept: 1, token: 1 });

            let in_department_entries = [];
            for (let i = 0; i < totalData.length; i++) {
                if (totalData[i].in_dept === true) {
                    in_department_entries.push(totalData[i]);
                }
            }

            data = {
                number_of_entries: totalData.length,
                number_of_entries_in_dept: in_department_entries.length,
                in_department_entries: in_department_entries,
                totalData: totalData
            };
        } else {
            data.totalData = "No data available for selected course";
        }

        // Search by date
        if (date) {
            var specificDate = new Date(date);
            var fulldata = [];

            const models = mongoose.modelNames();
            for (const modelName of models) {
                const Model = mongoose.model(modelName);
                const modelData = await Model.find({ date: specificDate });
                fulldata.push(...modelData);
            }
            data.fulldata = fulldata;
            console.log(fulldata);
            data.date = date;
        }

        res.render('reports', { options, data,fulldata,date});
    } catch (error) {
        console.error(error);
        res.status(500);
    }
}

  //--------------------------------------cancel UID---------------------------------------
exports.cancel_uid = async(req,res)=>{
    const fetch=req.body.uid;
    var found=false;
   const models=mongoose.modelNames();
for(var dept of models){
    var dept_model=mongoose.model(dept);
    if (found) {
        break;
    }
    else{
   var data= await dept_model.findOne({uid:fetch,in_dept:true,cancel:false});
   console.log(data);
  
   if (data!==null) {
    found=true;
    res.render('cancel_admission',{data});
     }
       }
   }
  if (!found) {
    res.render('cancel_admission',{data:'no data'});
    
  }
}

exports.update_uid = async (req,res)=>{
    const uidToUpdate = req.params.uid;
    const dept=req.params.dept;

  
        deptname= dept.toLowerCase().replace(/\s+/g, '_');
        console.log(deptname);
        dept_model=mongoose.model(deptname);
   
 const data= await  dept_model.findOneAndUpdate({uid:uidToUpdate},{$set:{in_dept:false,cancel:true}});
 console.log(data);
 res.render('cancel_admission');

}


exports.cancel_admission = async(req,res)=>{
    res.render('cancel_admission');
}

exports.cancel_reports = async(req,res)=>{
    res.render('cancel_reports');
}

exports.cancel_reports_date = async(req,res)=>{
    res.render('date_cancel');
}

exports.cancel_reports_dept = async(req,res)=>{
    res.render('dept_cancel',{options});
}

exports.date_cancel_reports = async(req,res)=>{
    const date = req.body.date;
    const fullDate = [];
    if(date){
        console.log(date);
        const models = mongoose.modelNames();
        for(const model of models){
            const collection = mongoose.model(model);
            const modelDate =await collection.find({date:date,cancel:true});
            fullDate.push(...modelDate);
        }

        fullDate.date=date;
        console.log(fullDate);

    }
    res.render('date_cancel',{fullDate,date})

}
exports.dept_cancel_reports = async (req,res)=>{
    try {
        const transformInputToCollectionName = (input) => {
            return input.toLowerCase().replace(/\s+/g, '_');
        }
    
        const formatDate = (date) => {
            const d = new Date(date);
            const day = ('0' + d.getDate()).slice(-2); // Add leading 0 if needed
            const month = ('0' + (d.getMonth() + 1)).slice(-2); // Add leading 0 if needed, month is 0-indexed
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        }
    
        const { dept } = req.body;
        const collectionName = transformInputToCollectionName(dept);
    
        let data = [];
        // Search by department
        if (collectionName && mongoose.connection.modelNames().includes(collectionName)) {
            const Model = mongoose.model(collectionName);
            const totalData = await Model.find({ cancel: true });
    
            // Format each date and add cname to the modified object before pushing it into data
            totalData.forEach(item => {
                const formattedItem = {
                    ...item._doc,
                    date: formatDate(item.date),
                    cname: dept // Here we are adding the dept name as cname to each item
                };
                data.push(formattedItem);
            });
        }
        console.log(data);
        res.render('dept_cancel', { options, data, dept }); // Pass dept to the template if needed
    } catch (error) {
        console.error(error);
        res.status(500);
    }
    
    
}