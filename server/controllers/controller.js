const express = require('express');
const bp = require('body-parser');
const app = express();
const xlsx = require('xlsx');
const fs = require('fs');
const db = require('../database/database');
require('../models/models')
const {dept_schema} = require('../models/models');
 const {setCourse} = require('../models/models');

const login_data=require('../models/login');
const mongoose = require('mongoose');

console.log(mongoose.modelNames());

const transformInputToCollectionName = (input) => {
    return input.toLowerCase().replace(/\s+/g, '_');
};
// const feesMapping = {
//     'BA Tamil':11400, 'BA English':12400,'B Com':17400,'B Com CA':17400,'B Com PA':17400,'B Com BI':16400,'B Com BA':16400,'B Com IT':17400,'BBA':15400,'BSC Maths':12400,'BSC Physics':12400,'BSC CS':19400,'BSC IT':19400,'BSC CT':17400,'BCA':19400,'BSC IOT':17400,'BSC CS AIDS':17400,'BSC Physical Education':13400,'MA Tamil':12950,'MA English':12950,'M Com':12950,'MSC CS':12950,'MSC IT':12950,'MSC Physics':14950,'MSC Chemistry':15950,'MBA':28950,'PGDCA':6050,
// };
// const uidMiddleMapping = {
//     'BA Tamil':'TL', 'BA English':'EL','B Com':'CO','B Com CA':'CC','B Com PA':'CP','B Com BI':'BI','B Com BA':'CB','B Com IT':'CI','BBA':'BA','BSC Maths':'MA','BSC Physics':'PH','BSC CS':'CS','BSC IT':'IT','BSC CT':'CT','BCA':'CA','BSC IOT':'OT','BSC CS AIDS':'AI','BSC Physical Education':'PE','MA Tamil':12,'MA English':10,'M Com':'03','MSC CS':'06','MSC IT':'09','MSC Physics':'08','MSC Chemistry':11,'MBA':13,'PGDCA':'05','CA Foundation':'CF'
// };
const option_val = ['Select Course','BA Tamil', 'BA English','B Com','B Com CA','B Com PA','B Com BI','B Com BA','B Com IT','BBA','BSC Maths','BSC Physics','BSC CS','BSC IT','BSC CT','BCA','BSC IOT','BSC CS AIDS','BSC Physical Education','MA Tamil','MA English','M Com','MSC CS','MSC IT','MSC Physics','MSC Chemistry','MBA','PGDCA','CA Foundation'];
    






const saveDocument = async (document) => {
    try {
        await document.save();
        console.log('Document saved successfully.');
    } catch (error) {
        console.error('Error saving document:', error);
        throw error; 
    }
};

exports.login_fill=async(req,res)=>{
    console.log(req.body);
    const name=req.body.username;
    const pass=req.body.password;
    const user = await login_data.findOne({ name });
    console.log('hello '+user);
    if (!user) {
     res.render('login',{layout:false,ch:'Invalid username'});
    }
    else if (user.name === 'admin') {
        if (user.pass === pass) {
            const option = await setCourse.find();
            res.render('admin', { layout: false,option });
            return;
        } 
        else {
            res.render('login',{layout:false,ch:'Wrong Password'});
           }
    }
    else {
        if (user.pass === pass) {
            res.render('home');
        }
        else {
            res.render('login', { layout: false,ch:'Wrong Password'})
        }
   
    }
} 

exports.signdata=async(req,res)=>{
    const data={
        name:req.body.username,
        pass:req.body.password,
        cpass:req.body.cpassword
    }
const insert=await login_data.insertMany([data]);
console.log(insert);
res.render('login',{layout:false,ch:''})
}
 
   

exports.new2 = async (req, res) => {
    const fitchdata = await setCourse.find({});
    console.log(fitchdata);
   
    var uid = req.params.id;
    var s_name = req.params.s_name;
    var token = req.params.token;
    var fees = req.params.fees;
    var cname = req.params.cname;

    console.log("sound" ,req.params);
     res.render('new-admission', { uid,s_name,token,fees,cname,fitchdata});
  }
 

 exports.courseAdd = async (req, res) => {
    const course = req.body.course;
    const {fees,key,actualLimit,allortedLimit } = req.body; // Extracting data from request body
    try {
        const newCourse = new setCourse({
            title: course,
            fees: Number(fees),
            key: key,
            actualLimit:actualLimit,
            allortedLimit:allortedLimit
        });
       
        await newCourse.save();
        res.render('admin',{layout:false});
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to add new course");
    }
};



 function getCurrentYearLastTwoDigits() {
    var currentDate= new Date();
    return currentDate.getFullYear().toString().slice(-2);
}

exports.dept = async (req, res) => {
    console.log('Processing request');

    // Helper function to transform input to a valid collection name
    const transformInputToCollectionName = (input) => {
        return input.toLowerCase().replace(/\s+/g, '_');
    };

    // Helper function to get the last two digits of the current year
    const getCurrentYearLastTwoDigits = () => {
        return new Date().getFullYear().toString().slice(-2);
    };

    const currentYearLastTwoDigits = getCurrentYearLastTwoDigits();
    const searchName = req.body.cname;
    const balance = 0;
    const extra = 0;
    console.log(balance);
    console.log(extra);
    
    const collectionName = transformInputToCollectionName(searchName);

    // Dynamically define a collection based on the collectionName
    const CollectionModel = mongoose.model(collectionName, dept_schema);

    try {
        // Check the current count of documents in the collection
        const currentDocumentCount = await CollectionModel.countDocuments();
        const result = await setCourse.findOne({ title: searchName }, { key: 1, _id: false, allortedLimit: 1 });

        // If no matching document (course) is found
        if (!result) {
            return res.status(404).send('Course not found');
        }

        var middlePart = result.key;
        var uid = `${currentYearLastTwoDigits}-${middlePart}-${(currentDocumentCount + 1).toString().padStart(3, '0')}`;

        // Check if the current document count exceeds or equals the allotted limit
        if (currentDocumentCount >= result.allortedLimit) {
            return res.send('Admission Full');
        }

        // Proceed with creating and saving the new document
        const newDocumentData = {
            date: req.body.date,
            trans_date:null,
            cname: req.body.cname,
            token: currentDocumentCount + 1,
            s_name: req.body.s_name,
            uid: uid,
            fees: req.body.fees,
            in_dept: true,
            transfered:false,
            balance: balance,
            extra: extra,
            paid: req.body.fees,
            cancel: false,
            old_fees:0
        };

        const newDocument = new CollectionModel(newDocumentData);
        await newDocument.save(); // Use the save method directly on the document instance

        await saveDocument(newDocument);
        // After successful insertion, you can redirect or respond as needed
        res.redirect(`/new_student/${uid}/${req.body.s_name}/${total}/${req.body.fees}/${req.body.cname}`);
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
    const fetch = req.body.uid;
    console.log(fetch);
    var found=false;
    const fitchdata = await setCourse.find({});
    console.log(fitchdata);

   //console.log(fitchdata);  
    const models = mongoose.modelNames();
    console.log(models);
    for (var dept of fitchdata) {
        var dept_name = transformInputToCollectionName(dept['title']);
    var dept_model = mongoose.model(dept_name,dept_schema);
    console.log(dept);
    if (found) {
        break;
    }
    else{
   var data= await dept_model.findOne({uid:fetch,in_dept:true});
   console.log(data);
  
   if (data!==null) {
    found=true;
    res.render('transfer-admission',{data,options:fitchdata});
     }
       }
   }
  if (!found) {
    res.render('transfer-admission',{data:'no data',options:option_val});
    
  }
   
}



exports.transfer_admission = async (req, res) => {
    const transformInputToCollectionName = (input) => {
        if (!input) {
            throw new Error('Course name is undefined');
        }
        return input.toLowerCase().replace(/\s+/g, '_');
    };

    var extra = 0;
    let balance = 0;
    const uid = req.body.uid;
    const sourceCourseName = req.body.o_cname;
    const destCourseName = req.body.cname; 
    var paid = parseFloat(req.body.paid);
    console.log(paid);
    const ver = parseFloat(req.body.balance); // Assuming balance is a number
    console.log(ver);

    if (ver > 0) {
        extra = ver;
        console.log('put in extra');
    } else {
        balance = ver;
        console.log('put in balance');
    }
    var old_fees = paid;
    paid+=extra
    
    const sourceCourse = mongoose.model(transformInputToCollectionName(sourceCourseName), dept_schema);
    const destCourse = mongoose.model(transformInputToCollectionName(destCourseName), dept_schema);


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
        const currentDocumentCount = await destCourse.countDocuments();
        const result = await setCourse.findOne({ title: searchName }, { key: 1, _id: false, allortedLimit: 1 });

        // If no matching document (course) is found
        if (!result) {
            return res.status(404).send('Course not found');
        }
        // await transferStudent(uid, sourceCourse, destCourse);
        await sourceCourse.updateOne({"uid":uid,"in_dept":true},{$set:{"in_dept":false}})
        if (currentDocumentCount >= result.allortedLimit) {
            return res.send('Admission Full');
        }
        const newDocument = new model({
            date: req.body.date,
            cname: req.body.cname,
            pcname:sourceCourseName,
            token: tt,
            paid: paid,
          
            s_name: req.body.s_name,
            uid: req.body.uid,
            fees: req.body.new_fees, // Assuming this is correct
            in_dept: true,
            cancel: false,
            transfered: true,
            balance: balance,
            old_fees:old_fees,
            extra: extra
        });
        console.log(newDocument);

        await saveDocument(newDocument);
        sound(collectionName);

        res.redirect('transfer-admission');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during transfer');
    }
};



exports.searchAndDateFind = async (req, res) => {
    try {
        
        const transformInputToCollectionName = (input) => {
            console.log('inp',input);
            return input.toLowerCase().replace(/\s+/g, '_');
        }
        const dept = req.body.dept;
        console.log('Deppp',dept);
        const collectionName = transformInputToCollectionName(dept);
        console.log('cln',collectionName);

        let data = {
            number_of_entries: 0,
            number_of_entries_in_dept: 0,
            in_department_entries: [],
            totalData: [],
            fulldata: [],
        };

        try {
            // 
            if (collectionName) {
                // mongoose.connection.modelNames().includes(collectionName)
                console.log('vanakam da mapala');
                 const Model = mongoose.model(collectionName,dept_schema);
                console.log('rfr',Model);
                const totalData = await Model.find({}, { uid: 1, in_dept: 1, token: 1,s_name:1,cancel:1, balance:1});
                console.log("fef",totalData);

                const in_department_entries = totalData.filter(entry => entry.in_dept == true);

                data = {
                    number_of_entries: totalData.length,
                    number_of_entries_in_dept: in_department_entries.length,
                    in_department_entries: in_department_entries,
                    totalData: totalData
                };

            } else {
                data.totalData = "No data available for selected course";
            }
            const fitchdata= await setCourse.find({});
            res.render('admission_reportResult', { fitchdata, data });

        }
        
    
        catch (error) {
            console.error(error);
            res.status(500);
        }



      
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
}
exports.report_date= async (req,res) =>{
    const date = req.body.date;
    console.log('g',date);
    var specificDate = new Date(date);
    console.log("d",specificDate);
            var fulldata = [];

            const models = mongoose.modelNames();
            for (const modelName of models) {
                const Model = mongoose.model(modelName);
                const modelData = await Model.find({ date: specificDate });
                fulldata.push(...modelData);
                
    }
    //console.log('hirfnrf', fulldata);
    for (let i in fulldata) {
       // if()
    }
    var feee = fulldata.map(obj => obj.fees);
    var pai = fulldata.map(obj=> obj.paid)
var bal = fulldata.map(obj => obj.extra);
var trr = fulldata.map(obj => obj.transfered);
var tot = 0; // Initialize the total variable

    console.log('dbebhef', trr);
    console.log('gerjgenr', bal);
    console.log('paa', pai);
    var bank = [];

for (let i = 0; i < feee.length; i++) {
    if (trr[i] === true) {
        if (bal[i]) {
            tot += parseInt(bal[i]);
        bank.push(parseInt(bal[i]))
        }
        else {
            bank.push(0)
        }
       
    }
    else {
        tot += parseInt(feee[i]);
        bank.push(parseInt(feee[i]))
    }
}
console.log(bank);
console.log(tot);
    // for (feess in feee) {
    //     if (bal[feess]){
    //         tot += parseInt(bal[feess])
    //     }
            
    //     if (trr[feess]== false) {
    //         tot += parseInt(feee[feess]);
    //     }
        
    //     // Add the fee to the total (after converting it to a number)
    // }
    
    //console.log('Total fees:', tot);
    
            const fitchdata= await setCourse.find({});
            res.render('admission_reportResult', { fitchdata,fulldata,date,tot,bank});
        
        }



exports.cancel_data = async (req, res) => {
    try {
        const transformInputToCollectionName = (input) => {
            return input.toLowerCase().replace(/\s+/g, '_');
        };

        const { dept, date } = req.body;
        const collectionName = transformInputToCollectionName(dept);

        if (date) {
            var specificDate = new Date(date);
            var fulldata = [];

            const models = mongoose.modelNames();
            for (const modelName of models) {
                const Model = mongoose.model(modelName);
                const modelData = await Model.find({ date: specificDate,cancel:true });
                fulldata.push(...modelData);
            }
            console.log(fulldata);
        }

       return res.render('admission_reports', { option_val,fulldata,date});

    } catch (err) {
        console.log(err);
       return  res.status(500).send(err);
    }
};



exports.admission_report = async (req, res) => {
    const fitch = await setCourse.find({})
    // const fitchdata = await setCourse.find({},{title:1,_id:0});
   

    var ddd = 0;
    const darrs = await setCourse.find({}, { title: 1, _id: 0 });
    
    // Extract titles from the array of objects
    const titles = darrs.map(item => item.title);
    
    console.log(titles);
    
    const transformInputToCollectionName = (input) => {
        return input.toLowerCase().replace(/\s+/g, '_')
    };
    const transformedTitles = titles.map(transformInputToCollectionName);
console.log(transformedTitles);
   
for (let title of titles) {
    const collectionName = transformInputToCollectionName(title);
    // Access the collection dynamically and retrieve all data
    const collectionData = await mongoose.model(collectionName, dept_schema).find({cancel:false}).count();
    console.log(`Data for collection "${collectionName}":`, collectionData);
    ddd = collectionData+ddd
    console.log(typeof(ddd));
}
    console.log(ddd);


  
    res.render('admission_report', { options: fitch,count: ddd });
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
    res.render('cancel',{data});
     }
       }
   }
  if (!found) {
    res.render('cancel',{data:'no data'});
    
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
 res.render('cancel');

}

exports.cancel_reports = async (req, res) => {
    const fitch = await setCourse.find({})




    var ddd = 0;
    const darrs = await setCourse.find({}, { title: 1, _id: 0 });
    
    // Extract titles from the array of objects
    const titles = darrs.map(item => item.title);
    
    console.log(titles);
    
    const transformInputToCollectionName = (input) => {
        return input.toLowerCase().replace(/\s+/g, '_')
    };
    const transformedTitles = titles.map(transformInputToCollectionName);
console.log(transformedTitles);
   
for (let title of titles) {
    const collectionName = transformInputToCollectionName(title);
    // Access the collection dynamically and retrieve all data
    const collectionData = await mongoose.model(collectionName, dept_schema).find({cancel:true}).count();
    console.log(`Data for collection "${collectionName}":`, collectionData);
    ddd = collectionData+ddd
    console.log(typeof(ddd));
}
    console.log(ddd);
    res.render('cancel_reports',{options:fitch,count:ddd});
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
    res.render('dept_cancel',{fullDate,date})

}
exports.dept_cancel_reports = async (req, res) => {
    try {
        // Function to transform department input into a collection name
        const transformInputToCollectionName = (input) => {
            return input.toLowerCase().replace(/\s+/g, '_');
        };

        // Function to format dates
        const formatDate = (date) => {
            const d = new Date(date);
            const day = ('0' + d.getDate()).slice(-2);
            const month = ('0' + (d.getMonth() + 1)).slice(-2);
            const year = d.getFullYear();
            return `${year}-${month}-${day}`;
        };

        // Extract department from request body or query
        const { dept } = req.body; // or req.query for GET requests
        const collectionName = transformInputToCollectionName(dept);
        console.log(collectionName);

        let data = [];
        if (collectionName) {
            const Model = mongoose.model(collectionName,dept_schema);
            const totalData = await Model.find({ cancel: true });

            // Format date and add cname for each item
            totalData.forEach(item => {
                const formattedItem = {
                    ...item._doc,
                    date: formatDate(item.date),
                    cname: dept
                };
                data.push(formattedItem);
            });
        }
        const fitch = await setCourse.find();
        const options = fitch;
        res.render('dept_cancel', { fulldata:data, options, dept });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};
exports.updateAdmin = async (req, res) => {
    
    console.log(req.body.dept);
    var depta = req.body.dept; // Make sure to declare depta with 'const' or 'let'
    const upp = {
        title: depta,
        fees: req.body.fees,
        key: req.body.key
    };
    const optionn = {
        new: true
    };
    
    try {
        const updat_fff = await setCourse.findOneAndUpdate({ title: depta }, upp, optionn);
        console.log('yvyhv', updat_fff);
        const fitch = await setCourse.find()
        res.render('admin',{layout:false,option:fitch})
    } catch (error) {
        console.error('Error occurred during findOneAndUpdate:', error);
    }
    
}


exports.date_admission_reports = async(req,res)=>{
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
    res.render('date_cancel',{fullDate:fullDate,date:date})
  //  res.render('date-cancel')
}
exports.dept_admission_report = async (req, res) => {
    try {
        // Function to transform department input into a collection name
        const transformInputToCollectionName = (input) => {
            return input.toLowerCase().replace(/\s+/g, '_');
        };

        // Function to format dates
        const formatDate = (date) => {
            const d = new Date(date);
            const day = ('0' + d.getDate()).slice(-2);
            const month = ('0' + (d.getMonth() + 1)).slice(-2);
            const year = d.getFullYear();
            return `${year}-${month}-${day}`;
        };

        // Extract department from request body or query
        const { dept } = req.body; // or req.query for GET requests
        const collectionName = transformInputToCollectionName(dept);

        let data = [];
        if (collectionName && mongoose.connection.modelNames().includes(collectionName)) {
            const Model = mongoose.model(collectionName);
            const totalData = await Model.find({ cancel: true });

            // Format date and add cname for each item
            totalData.forEach(item => {
                const formattedItem = {
                    ...item._doc,
                    date: formatDate(item.date),
                    cname: dept
                };
                data.push(formattedItem);
            });
        }
        const options = option_val;
        res.render('cancel_reports', { data, options, dept });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};


        // xlsx.utils.book_append_sheet(workbook, worksheet, coo);
        // coo = coo + 1;
        // console.log('cccc',coo);

        // // Write workbook to a file
        // xlsx.writeFile(workbook, excelFileName, { bookType: 'xlsx', type: 'file' });

        // console.log(`Data exported to ${excelFileName}`);
        // // ddd = collectionData+ddd
        // //     console.log(typeof(ddd));
    
  // console.log(ddd);

    // File Name for Excel






exports.fullcoo = async (req, res) => {
    let ddd = []; // Initialize as an array
    const darrs = await setCourse.find({}, { title: 1, _id: 0 });
    
    // Extract titles from the array of objects
    const titles = darrs.map(item => item.title);
    
    console.log(titles);
    
    const transformInputToCollectionName = (input) => {
        return input.toLowerCase().replace(/\s+/g, '_')
    };
    const transformedTitles = titles.map(transformInputToCollectionName);
    console.log(transformedTitles);
   
    for (let title of titles) {
        const collectionName = transformInputToCollectionName(title);
        // Access the collection dynamically and retrieve all data
        const collectionData = await mongoose.model(collectionName, dept_schema).find();
        console.log(`Data for collection "${collectionName}":`, collectionData);
        ddd = ddd.concat(collectionData); // Concatenate collectionData to ddd
        console.log(typeof (ddd));
        

    }
    console.log(ddd);
   
    res.render('ttreport',{fulldata:ddd})
}



// // Converting data into Excel sheet


// const excelFileName = 'Admission.xlsx';

// // Create a new workbook
// const workbook = xlsx.utils.book_new();

// var coo = 4;
// exports.excel = async (req, res) => {
//     var ddd = 0;
//     var daa = [];
//     const darrs = await setCourse.find({}, { title: 1, _id: 0 });
    
//     // Extract titles from the array of objects
//     const titles = darrs.map(item => item.title);
    
//     console.log(titles);
    
//     const transformInputToCollectionName = (input) => {
//         return input.toLowerCase().replace(/\s+/g, '_')
//     };
//     const transformedTitles = titles.map(transformInputToCollectionName);
//     console.log(transformedTitles);
   
//     for (let title of titles) {
//         const collectionName = transformInputToCollectionName(title);
//         // Access the collection dynamically and retrieve all data
//         const collectionData = await mongoose.model(collectionName, dept_schema).find({ cancel: false })
//         console.log(`Data for collection "${collectionName}":`, collectionData);
//         daa.push(...collectionData)
//         console.log(daa);
//         const worksheet = xlsx.utils.json_to_sheet(daa)
//     }
// }
